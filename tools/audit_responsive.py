from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from collections import defaultdict
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXCLUDED_PARTS = {".git", ".agents", ".codex", "tools"}
ROOT_OVERFLOW_SELECTORS = {"html", "body", ":root", "html, body", "*"}

# Hooks que identifican herramientas completas. Los marcadores son clases que
# deben aparecer en una media/container query, no necesariamente en el nodo raíz.
INTERACTIVE_COMPONENTS = {
    "Navegación principal": ("data-site-nav", {"site-nav", "explore-panel", "menu-toggle"}),
    "Buscador global": ("data-command-palette", {"command-palette", "command-result", "command-shell"}),
    "Selector de perfil": ("data-visitor-selector", {"visitor-layout", "visitor-options", "visitor-selector"}),
    "Mapa CAMS": ("data-ecosystem-map", {"ecosystem-stage", "ecosystem-nodes", "ecosystem-layout"}),
    "Modos de lectura": ("data-view-modes", {"view-mode-bar", "segmented-control", "mode-status"}),
    "Árbol del problema": ("data-problem-tree", {"problem-tree-layout", "problem-tree-column", "problem-filters"}),
    "Núcleo de la propuesta": ("data-proposal-core", {"core-layout", "core-diagram", "core-orbit"}),
    "Estado del arte": ("data-state-of-art", {"art-grid", "art-filters", "comparison-matrix"}),
    "Mapa institucional": ("data-institutional-map", {"institutional-layout", "institution-layer", "institution-detail"}),
    "Simulador normativo": ("data-decision-lab", {"decision-grid", "question-grid", "decision-output"}),
    "Expediente técnico": ("data-expediente-builder", {"expediente-grid", "expediente-builder", "progress-label"}),
    "Biblioteca documental": ("data-document-library", {"library-controls", "document-results", "card--document"}),
    "Participación": ("data-participation", {"participation-path", "share-actions", "participation-hub"}),
}


@dataclass(frozen=True)
class Rule:
    path: Path
    line: int
    context: tuple[str, ...]
    selector: str
    body: str


@dataclass(frozen=True)
class Declaration:
    name: str
    value: str


class ResponsiveHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.images: list[tuple[dict[str, str], int]] = []
        self.inline_svgs: list[tuple[dict[str, str], int]] = []
        self.inline_styles: list[tuple[str, str, int]] = []
        self.hooks: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        values = {key.lower(): value or "" for key, value in attrs}
        line = self.getpos()[0]
        self.hooks.update(key for key in values if key.startswith("data-"))
        if tag == "img":
            self.images.append((values, line))
        elif tag == "svg":
            self.inline_svgs.append((values, line))
        if values.get("style"):
            self.inline_styles.append((tag, values["style"], line))


def is_excluded(path: Path) -> bool:
    parts = path.relative_to(ROOT).parts
    return bool(EXCLUDED_PARTS.intersection(parts) or any(part.startswith(".") for part in parts))


def report(kind: str, path: Path | None, line: int | None, message: str) -> None:
    location = ""
    if path is not None:
        try:
            relative = path.resolve().relative_to(ROOT).as_posix()
        except ValueError:
            relative = str(path)
        location = f" {relative}"
        if line is not None:
            location += f":{line}"
    print(f"{kind}{location} - {message}")


def strip_comments(text: str) -> str:
    return re.sub(
        r"/\*.*?\*/",
        lambda match: "\n" * match.group(0).count("\n"),
        text,
        flags=re.DOTALL,
    )


def matching_brace(text: str, opening: int, limit: int) -> int:
    depth = 1
    quote = ""
    escaped = False
    index = opening + 1
    while index < limit:
        char = text[index]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = ""
        elif char in {"\"", "'"}:
            quote = char
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index
        index += 1
    return -1


def split_selectors(prelude: str) -> list[str]:
    selectors: list[str] = []
    start = 0
    depth = 0
    quote = ""
    for index, char in enumerate(prelude):
        if quote:
            if char == quote and (index == 0 or prelude[index - 1] != "\\"):
                quote = ""
        elif char in {"\"", "'"}:
            quote = char
        elif char in "([":
            depth += 1
        elif char in ")]":
            depth = max(0, depth - 1)
        elif char == "," and depth == 0:
            selectors.append(prelude[start:index].strip())
            start = index + 1
    selectors.append(prelude[start:].strip())
    return [selector for selector in selectors if selector]


def parse_rules(path: Path, text: str, line_offset: int = 0) -> list[Rule]:
    clean = strip_comments(text)
    rules: list[Rule] = []

    def walk(start: int, end: int, context: tuple[str, ...]) -> None:
        cursor = start
        while cursor < end:
            while cursor < end and clean[cursor].isspace():
                cursor += 1
            semicolon = clean.find(";", cursor, end)
            opening = clean.find("{", cursor, end)
            if opening == -1:
                break
            if semicolon != -1 and semicolon < opening:
                cursor = semicolon + 1
                continue
            prelude = re.sub(r"\s+", " ", clean[cursor:opening].strip())
            closing = matching_brace(clean, opening, end)
            if closing == -1:
                break
            body = clean[opening + 1 : closing]
            line = line_offset + clean.count("\n", 0, cursor) + 1
            lower = prelude.lower()
            if lower.startswith(("@media", "@supports", "@container", "@layer", "@scope", "@document")):
                walk(opening + 1, closing, context + (prelude,))
            elif not lower.startswith(("@keyframes", "@-webkit-keyframes", "@font-face", "@property")):
                for selector in split_selectors(prelude):
                    rules.append(Rule(path, line, context, re.sub(r"\s+", " ", selector), body))
            cursor = closing + 1

    walk(0, len(clean), ())
    return rules


def declarations(body: str) -> list[Declaration]:
    return [
        Declaration(match.group(1).lower(), match.group(2).strip())
        for match in re.finditer(r"(?:^|;)\s*([a-zA-Z-][\w-]*)\s*:\s*([^;{}]+)", body)
    ]


def absolute_pixels(value: str) -> float | None:
    normalized = re.sub(r"\s*!important\s*$", "", value.strip(), flags=re.IGNORECASE)
    match = re.fullmatch(r"(-?(?:\d+(?:\.\d+)?|\.\d+))(px|rem|em|pt|pc|in|cm|mm)", normalized, re.IGNORECASE)
    if not match:
        return None
    number = float(match.group(1))
    factors = {
        "px": 1.0,
        "rem": 16.0,
        "em": 16.0,
        "pt": 96.0 / 72.0,
        "pc": 16.0,
        "in": 96.0,
        "cm": 96.0 / 2.54,
        "mm": 96.0 / 25.4,
    }
    return number * factors[match.group(2).lower()]


def selector_tokens(selector: str) -> set[str]:
    return set(re.findall(r"(?<![\w-])[.#]([_a-zA-Z][\w-]*)", selector))


def media_contexts(rule: Rule) -> list[str]:
    return [item for item in rule.context if item.lower().startswith("@media")]


def is_adaptive_rule(rule: Rule) -> bool:
    # responsive.css is deliberately authored mobile-first: its root rules are
    # the compact state and min-width queries progressively add space.
    if rule.path.name == "responsive.css":
        return True
    if any(item.lower().startswith("@container") for item in rule.context):
        return True
    for item in media_contexts(rule):
        lower = item.lower()
        if any(capability in lower for capability in ("pointer: coarse", "hover: none", "orientation:")):
            return True
        for number, unit in re.findall(r"max-width\s*:\s*([0-9.]+)(px|rem|em)", lower):
            pixels = float(number) * (16.0 if unit in {"rem", "em"} else 1.0)
            if pixels <= 1024.5:
                return True
        if re.search(r"min-width\s*:\s*[0-9.]+(?:px|rem|em)", lower):
            return True
    return False


def parse_html(path: Path) -> ResponsiveHTMLParser:
    parser = ResponsiveHTMLParser()
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()
    return parser


def collect_rules(css_files: list[Path], html_files: list[Path], parsers: dict[Path, ResponsiveHTMLParser]) -> list[Rule]:
    rules: list[Rule] = []
    for path in css_files:
        rules.extend(parse_rules(path, path.read_text(encoding="utf-8")))
    for path in html_files:
        text = path.read_text(encoding="utf-8")
        for match in re.finditer(r"<style\b[^>]*>(.*?)</style\s*>", text, re.IGNORECASE | re.DOTALL):
            rules.extend(parse_rules(path, match.group(1), text.count("\n", 0, match.start(1))))
        for tag, style, line in parsers[path].inline_styles:
            rules.append(Rule(path, line, ("inline",), f"{tag}[style]", style))
    return rules


def audit_fixed_widths(rules: list[Rule]) -> tuple[int, int]:
    errors = 0
    for rule in rules:
        for declaration in declarations(rule.body):
            if declaration.name != "width":
                continue
            pixels = absolute_pixels(declaration.value)
            if pixels is not None and pixels > 1000:
                errors += 1
                report("ERROR", rule.path, rule.line, f"Ancho fijo mayor de 1000 px ({declaration.value}) en {rule.selector}")
    if not errors:
        report("PASS", None, None, "No se encontraron width CSS fijos mayores de 1000 px")
    return errors, 0


def has_controlled_overflow(rule: Rule, rules: list[Rule]) -> bool:
    tokens = selector_tokens(rule.selector)
    prefixes = {token.split("-")[0] for token in tokens if "-" in token}
    if not prefixes:
        return False
    for candidate in rules:
        values = {item.name: item.value.lower() for item in declarations(candidate.body)}
        if values.get("overflow-x") not in {"auto", "scroll"}:
            continue
        other_tokens = selector_tokens(candidate.selector)
        other_prefixes = {token.split("-")[0] for token in other_tokens if "-" in token}
        table_region = "table" in rule.selector.lower() and "table" in candidate.selector.lower()
        if prefixes.intersection(other_prefixes) or table_region:
            return True
    return False


def audit_min_widths(rules: list[Rule]) -> tuple[int, int]:
    errors = 0
    warnings = 0
    controlled = 0
    for rule in rules:
        for declaration in declarations(rule.body):
            if declaration.name != "min-width":
                continue
            pixels = absolute_pixels(declaration.value)
            if pixels is None or pixels <= 0:
                continue
            root_selector = rule.selector.strip().lower() in {"html", "body", ":root"}
            if root_selector:
                errors += 1
                report("ERROR", rule.path, rule.line, f"min-width problemático ({declaration.value}) en la raíz; impide reflow con zoom o viewports menores")
            elif pixels <= 320.5:
                continue
            elif pixels > 1000:
                errors += 1
                report("ERROR", rule.path, rule.line, f"min-width problemático ({declaration.value}; supera 1000 px) en {rule.selector}")
            elif has_controlled_overflow(rule, rules):
                controlled += 1
            else:
                warnings += 1
                report("WARNING", rule.path, rule.line, f"Revisar min-width de {declaration.value} en {rule.selector}; puede desbordar pantallas compactas")
    if not errors and not warnings:
        suffix = f"; {controlled} ancho(s) amplio(s) contenido(s) por scroll local" if controlled else ""
        report("PASS", None, None, f"No se encontraron min-width problemáticos{suffix}")
    return errors, warnings


def audit_rigid_viewport_height(rules: list[Rule]) -> tuple[int, int]:
    errors = 0
    for rule in rules:
        items = declarations(rule.body)
        by_name: dict[str, list[str]] = defaultdict(list)
        for item in items:
            by_name[item.name].append(item.value.lower())
        for name, values in by_name.items():
            rigid_indexes = [index for index, value in enumerate(values) if re.search(r"(?<![\w-])100vh\b", value)]
            for index in rigid_indexes:
                has_later_dynamic_fallback = any(re.search(r"\b100[ds]vh\b", value) for value in values[index + 1 :])
                if not has_later_dynamic_fallback:
                    errors += 1
                    report("ERROR", rule.path, rule.line, f"{name}: {values[index]} usa 100vh rígido sin fallback dvh/svh en {rule.selector}")
    if not errors:
        report("PASS", None, None, "No se encontró uso rígido de 100vh")
    return errors, 0


def audit_global_overflow_patch(rules: list[Rule]) -> tuple[int, int]:
    errors = 0
    warnings = 0
    for rule in rules:
        selector = re.sub(r"\s+", " ", rule.selector.strip().lower())
        for declaration in declarations(rule.body):
            if declaration.name != "overflow-x" or selector not in ROOT_OVERFLOW_SELECTORS:
                continue
            value = declaration.value.lower().split()[0]
            if value == "hidden":
                errors += 1
                report("ERROR", rule.path, rule.line, f"overflow-x: hidden global en {rule.selector}; oculta el síntoma en lugar de corregirlo")
            elif value == "clip":
                warnings += 1
                report("WARNING", rule.path, rule.line, f"overflow-x: clip global en {rule.selector}; comprobar que no esté ocultando desbordamientos")
    if not errors and not warnings:
        report("PASS", None, None, "No se usa overflow-x: hidden como parche global")
    return errors, warnings


def audit_tiny_fonts(rules: list[Rule]) -> tuple[int, int]:
    warnings = 0
    for rule in rules:
        if any(token in rule.selector.lower() for token in ("visually-hidden", "sr-only", "screen-reader")):
            continue
        for declaration in declarations(rule.body):
            if declaration.name != "font-size":
                continue
            pixels = absolute_pixels(declaration.value)
            if pixels is not None and 0 < pixels < 10:
                warnings += 1
                report("WARNING", rule.path, rule.line, f"Fuente extremadamente pequeña ({declaration.value}, aprox. {pixels:.1f}px) en {rule.selector}")
    if not warnings:
        report("PASS", None, None, "No se encontraron fuentes CSS menores de 10 px equivalentes")
    return 0, warnings


def fixed_rule_is_safe(rule: Rule, adaptive_tokens: set[str]) -> bool:
    if rule.context != ():
        return True
    lower_selector = rule.selector.lower()
    values = {item.name: item.value.lower() for item in declarations(rule.body)}
    if "skip-link" in lower_selector:
        return True
    if values.get("pointer-events") == "none" and (
        "inset" in values or absolute_pixels(values.get("height", "")) is not None
    ):
        return True
    return bool(selector_tokens(rule.selector).intersection(adaptive_tokens))


def audit_fixed_position(rules: list[Rule]) -> tuple[int, int]:
    warnings = 0
    fixed_count = 0
    adaptive_tokens = {
        token
        for rule in rules
        if is_adaptive_rule(rule)
        for token in selector_tokens(rule.selector)
    }
    for rule in rules:
        if not any(item.name == "position" and item.value.lower().split()[0] == "fixed" for item in declarations(rule.body)):
            continue
        fixed_count += 1
        if not fixed_rule_is_safe(rule, adaptive_tokens):
            warnings += 1
            report("WARNING", rule.path, rule.line, f"Elemento fixed sin regla responsive o límites seguros aparentes: {rule.selector}")
    if not warnings:
        report("PASS", None, None, f"Los {fixed_count} usos de position: fixed están acotados o tienen adaptación")
    return 0, warnings


def audit_svg(html_files: list[Path], parsers: dict[Path, ResponsiveHTMLParser]) -> tuple[int, int]:
    errors = 0
    inline_count = 0
    for path in html_files:
        for attrs, line in parsers[path].inline_svgs:
            inline_count += 1
            if not attrs.get("viewbox", "").strip():
                errors += 1
                report("ERROR", path, line, "SVG inline sin viewBox")
    svg_files = sorted(path for path in ROOT.rglob("*.svg") if not is_excluded(path))
    for path in svg_files:
        try:
            root = ET.parse(path).getroot()
        except (ET.ParseError, OSError) as error:
            errors += 1
            report("ERROR", path, getattr(error, "position", (None,))[0], f"SVG inválido: {error}")
            continue
        if not any(key.lower() == "viewbox" and value.strip() for key, value in root.attrib.items()):
            errors += 1
            report("ERROR", path, 1, "SVG externo sin viewBox")
    if not errors:
        report("PASS", None, None, f"SVG con viewBox: {inline_count} inline y {len(svg_files)} archivo(s)")
    return errors, 0


def audit_image_dimensions(html_files: list[Path], parsers: dict[Path, ResponsiveHTMLParser]) -> tuple[int, int]:
    warnings = 0
    image_count = 0
    for path in html_files:
        for attrs, line in parsers[path].images:
            image_count += 1
            missing = [name for name in ("width", "height") if not attrs.get(name, "").strip()]
            if missing:
                warnings += 1
                src = attrs.get("src", "imagen sin src")
                report("WARNING", path, line, f"Imagen {src} sin {'/'.join(missing)}; puede causar CLS")
    if not warnings:
        report("PASS", None, None, f"Las {image_count} imágenes HTML declaran width y height")
    return 0, warnings


def media_bounds(query: str) -> list[tuple[float | None, float | None]]:
    branches: list[tuple[float | None, float | None]] = []
    for branch in query.lower().split(","):
        minimums: list[float] = []
        maximums: list[float] = []
        for kind, number, unit in re.findall(r"(min|max)-width\s*:\s*([0-9.]+)(px|rem|em)", branch):
            pixels = float(number) * (16.0 if unit in {"rem", "em"} else 1.0)
            (minimums if kind == "min" else maximums).append(pixels)
        branches.append((max(minimums) if minimums else None, min(maximums) if maximums else None))
    return branches


def audit_media_queries(rules: list[Rule]) -> tuple[int, int]:
    errors = 0
    warnings = 0
    seen_queries: set[tuple[Path, str]] = set()
    values_by_context: dict[tuple[str, str, str], list[tuple[str, Rule]]] = defaultdict(list)
    ineffective_grid: dict[tuple[str, str], list[Rule]] = defaultdict(list)
    root_displays: dict[str, str] = {}
    media_grid_selectors: set[str] = set()
    for rule in rules:
        for declaration in declarations(rule.body):
            if declaration.name == "display":
                display = declaration.value.lower().split()[0]
                if media_contexts(rule):
                    if display in {"grid", "inline-grid"}:
                        media_grid_selectors.add(rule.selector)
                elif not any(item.lower().startswith("@container") for item in rule.context):
                    root_displays[rule.selector] = display
    for rule in rules:
        for context in media_contexts(rule):
            normalized = re.sub(r"\s+", " ", context.lower()).strip()
            key = (rule.path, normalized)
            if key not in seen_queries:
                seen_queries.add(key)
                for minimum, maximum in media_bounds(normalized):
                    if minimum is not None and maximum is not None and minimum > maximum:
                        errors += 1
                        report("ERROR", rule.path, rule.line, f"Media query imposible: {context}")
            for declaration in declarations(rule.body):
                values_by_context[(normalized, rule.selector, declaration.name)].append((declaration.value, rule))
        if media_contexts(rule):
            rule_declarations = {item.name: item.value.lower().split()[0] for item in declarations(rule.body)}
            base_display = root_displays.get(rule.selector)
            responsive_display = rule_declarations.get("display", base_display)
            if responsive_display not in {"grid", "inline-grid"} and rule.selector in media_grid_selectors:
                responsive_display = "grid"
            has_grid_template = any(name.startswith("grid-template-") for name in rule_declarations)
            if has_grid_template and responsive_display not in {"grid", "inline-grid"}:
                display_label = responsive_display or "no declarado"
                ineffective_grid[(rule.selector, display_label)].append(rule)
    for (selector, display_label), occurrences in ineffective_grid.items():
        warnings += 1
        first = occurrences[0]
        repeat = f" en {len(occurrences)} media queries" if len(occurrences) > 1 else ""
        report(
            "WARNING",
            first.path,
            first.line,
            f"Regla responsive potencialmente ineficaz{repeat}: {selector} usa grid-template-* con display {display_label}",
        )
    for (context, selector, name), occurrences in values_by_context.items():
        distinct = {re.sub(r"\s+", " ", value.strip().lower()) for value, _rule in occurrences}
        locations = {(rule.path, rule.line) for _value, rule in occurrences}
        if len(distinct) > 1 and len(locations) > 1:
            warnings += 1
            first = occurrences[0][1]
            report("WARNING", first.path, first.line, f"Media query repetida asigna valores distintos a {name} en {selector}: {context}")
    if not errors and not warnings:
        report("PASS", None, None, f"Media queries coherentes: {len(seen_queries)} contextos revisados")
    return errors, warnings


def audit_interactive_mobile_styles(
    parsers: dict[Path, ResponsiveHTMLParser], rules: list[Rule]
) -> tuple[int, int]:
    warnings = 0
    hooks = set().union(*(parser.hooks for parser in parsers.values()))
    adaptive_classes = {
        match
        for rule in rules
        if is_adaptive_rule(rule)
        for match in re.findall(r"(?<![\w-])\.([_a-zA-Z][\w-]*)", rule.selector)
    }
    present = 0
    for name, (hook, markers) in INTERACTIVE_COMPONENTS.items():
        if hook not in hooks:
            continue
        present += 1
        if not markers.intersection(adaptive_classes):
            warnings += 1
            expected = ", ".join(f".{marker}" for marker in sorted(markers))
            report("WARNING", None, None, f"{name} ({hook}) no tiene estilo móvil/container aparente; se buscó {expected}")
    if not warnings:
        report("PASS", None, None, f"Los {present} componentes interactivos detectados tienen adaptación móvil aparente")
    return 0, warnings


def main() -> int:
    html_files = sorted(path.resolve() for path in ROOT.rglob("*.html") if not is_excluded(path))
    css_files = sorted(path.resolve() for path in ROOT.rglob("*.css") if not is_excluded(path))
    if not html_files or not css_files:
        report("ERROR", None, None, f"Se requieren HTML y CSS; encontrados {len(html_files)} HTML y {len(css_files)} CSS")
        return 1

    try:
        parsers = {path: parse_html(path) for path in html_files}
        rules = collect_rules(css_files, html_files, parsers)
    except (OSError, UnicodeError) as error:
        report("ERROR", None, None, f"No se pudieron leer los archivos: {error}")
        return 1

    checks = (
        audit_fixed_widths(rules),
        audit_min_widths(rules),
        audit_rigid_viewport_height(rules),
        audit_global_overflow_patch(rules),
        audit_tiny_fonts(rules),
        audit_fixed_position(rules),
        audit_svg(html_files, parsers),
        audit_image_dimensions(html_files, parsers),
        audit_media_queries(rules),
        audit_interactive_mobile_styles(parsers, rules),
    )
    errors = sum(item[0] for item in checks)
    warnings = sum(item[1] for item in checks)

    print(f"PASS Auditoría responsive completada: {len(html_files)} HTML, {len(css_files)} CSS, {len(rules)} reglas")
    if warnings:
        print(f"WARNING Total de advertencias: {warnings}")
    if errors:
        print(f"ERROR Total de errores: {errors}")
        return 1
    print("PASS Sin errores bloqueantes; la inspección visual sigue siendo obligatoria")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
