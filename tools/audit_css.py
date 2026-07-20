from __future__ import annotations

import re
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
ENTRY = ROOT / "styles.css"
EXCLUDED_PARTS = {".git", ".agents", ".codex", "tools"}
HEX_RE = re.compile(r"#[0-9a-fA-F]{3,8}\b")
VARIABLE_RE = re.compile(r"(?m)(--[\w-]+)\s*:")
IMPORT_RE = re.compile(
    r"@import\s+(?:url\(\s*)?[\"']?([^\"')\s]+)[\"']?\s*\)?[^;]*;",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class Rule:
    path: Path
    line: int
    context: tuple[str, ...]
    selector: str
    body: str


def report(kind: str, path: Path | None, line: int | None, message: str) -> None:
    location = ""
    if path is not None:
        location = f" {path.resolve().relative_to(ROOT).as_posix()}"
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


def parse_rules(path: Path, text: str) -> tuple[list[Rule], list[tuple[int, str]]]:
    clean = strip_comments(text)
    rules: list[Rule] = []
    empty_blocks: list[tuple[int, str]] = []

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
            prelude = clean[cursor:opening].strip()
            closing = matching_brace(clean, opening, end)
            if closing == -1:
                break
            body = clean[opening + 1 : closing]
            line = clean.count("\n", 0, cursor) + 1
            normalized_prelude = re.sub(r"\s+", " ", prelude)
            if not body.strip():
                empty_blocks.append((line, normalized_prelude or "bloque anónimo"))
            lower = normalized_prelude.lower()
            if lower.startswith(("@media", "@supports", "@container", "@layer", "@scope", "@document")):
                walk(opening + 1, closing, context + (normalized_prelude,))
            elif lower.startswith(("@keyframes", "@-webkit-keyframes")):
                pass
            elif lower.startswith("@"):
                rules.append(Rule(path, line, context, normalized_prelude, body))
            else:
                for selector in split_selectors(normalized_prelude):
                    rules.append(Rule(path, line, context, re.sub(r"\s+", " ", selector), body))
            cursor = closing + 1

    walk(0, len(clean), ())
    return rules, empty_blocks


def resolve_import(path: Path, specifier: str) -> Path | None:
    parsed = urlsplit(specifier)
    if parsed.scheme or specifier.startswith("//"):
        return None
    return (ROOT / parsed.path.lstrip("/") if parsed.path.startswith("/") else path.parent / parsed.path).resolve()


def imported_files(entry: Path) -> tuple[set[Path], list[tuple[Path, int, str]]]:
    visited: set[Path] = set()
    missing: list[tuple[Path, int, str]] = []

    def visit(path: Path) -> None:
        path = path.resolve()
        if path in visited or not path.exists():
            return
        visited.add(path)
        text = path.read_text(encoding="utf-8")
        for match in IMPORT_RE.finditer(strip_comments(text)):
            target = resolve_import(path, match.group(1))
            if target is None:
                continue
            if not target.exists():
                line = text.count("\n", 0, match.start()) + 1
                missing.append((path, line, match.group(1)))
            else:
                visit(target)

    visit(entry)
    return visited, missing


def selector_tokens(selector: str) -> tuple[set[str], set[str], set[str]]:
    classes = set(re.findall(r"(?<![\w-])\.([_a-zA-Z][\w-]*)", selector))
    ids = set(re.findall(r"(?<![\w-])#([_a-zA-Z][\w-]*)", selector))
    attrs = set(re.findall(r"\[\s*([\w-]+)", selector))
    return classes, ids, attrs


def token_is_used(kind: str, token: str, corpus: str) -> bool:
    if kind == "class":
        patterns = [
            rf'(?:class|className)\s*(?:=|:)\s*["\'`][^"\'`]*\b{re.escape(token)}\b',
            rf'["\']{re.escape(token)}["\']',
        ]
    elif kind == "id":
        patterns = [rf'id\s*=\s*["\']{re.escape(token)}["\']', rf'["\']#{re.escape(token)}["\']']
    else:
        patterns = [rf'\b{re.escape(token)}\b']
    return any(re.search(pattern, corpus) for pattern in patterns)


def declaration_names(body: str) -> set[str]:
    """Return declared property names, excluding values such as data URLs."""
    return {
        match.group(1).lower()
        for match in re.finditer(r"(?:^|;)\s*([a-zA-Z-][\w-]*)\s*:", body)
    }


def main() -> int:
    if not ENTRY.exists():
        report("ERROR", ENTRY, None, "Falta styles.css")
        return 1

    css_files = sorted(
        path.resolve()
        for path in ROOT.rglob("*.css")
        if not EXCLUDED_PARTS.intersection(path.relative_to(ROOT).parts)
    )
    imported, missing_imports = imported_files(ENTRY)
    errors = 0
    warnings = 0
    for path, line, specifier in missing_imports:
        errors += 1
        report("ERROR", path, line, f"@import inexistente: {specifier}")
    for path in css_files:
        if path not in imported:
            warnings += 1
            report("WARNING", path, None, "Hoja CSS no alcanzable desde styles.css")

    all_rules: list[Rule] = []
    for path in css_files:
        rules, empty_blocks = parse_rules(path, path.read_text(encoding="utf-8"))
        all_rules.extend(rules)
        for line, prelude in empty_blocks:
            warnings += 1
            report("WARNING", path, line, f"Bloque CSS vacío: {prelude}")

    selector_occurrences: dict[tuple[tuple[str, ...], str], list[Rule]] = defaultdict(list)
    variable_occurrences: dict[tuple[tuple[str, ...], str, str], list[Rule]] = defaultdict(list)
    for rule in all_rules:
        selector_occurrences[(rule.context, rule.selector)].append(rule)
        for variable in VARIABLE_RE.findall(rule.body):
            variable_occurrences[(rule.context, rule.selector, variable)].append(rule)

    for (context, selector), occurrences in selector_occurrences.items():
        if len(occurrences) > 1:
            properties: dict[str, list[Rule]] = defaultdict(list)
            for occurrence in occurrences:
                for property_name in declaration_names(occurrence.body):
                    properties[property_name].append(occurrence)
            overlapping = sorted(name for name, rules in properties.items() if len(rules) > 1)
            if overlapping:
                warnings += 1
                first = occurrences[0]
                context_label = " > ".join(context) or "raíz"
                places = ", ".join(f"{item.path.name}:{item.line}" for item in occurrences)
                listed = ", ".join(overlapping)
                report(
                    "WARNING",
                    first.path,
                    first.line,
                    f"Selector duplicado con propiedades solapadas en contexto {context_label}: "
                    f"{selector} [{listed}] ({places})",
                )
    for (_context, selector, variable), occurrences in variable_occurrences.items():
        if len(occurrences) > 1:
            warnings += 1
            first = occurrences[0]
            report("WARNING", first.path, first.line, f"Variable {variable} declarada varias veces para {selector}")

    token_path = (ROOT / "assets/css/tokens.css").resolve()
    allowed_hex = {
        value.lower()
        for value in HEX_RE.findall(token_path.read_text(encoding="utf-8") if token_path.exists() else "")
    }
    for path in css_files:
        if path == token_path:
            continue
        text = strip_comments(path.read_text(encoding="utf-8"))
        for match in HEX_RE.finditer(text):
            value = match.group(0).lower()
            line = text.count("\n", 0, match.start()) + 1
            errors += 1
            if value in allowed_hex:
                report("ERROR", path, line, f"Color hexadecimal fuera de tokens.css: {value}; use la variable correspondiente")
            else:
                report("ERROR", path, line, f"Color hexadecimal no permitido por los tokens: {value}")

    source_files = [
        path for pattern in ("*.html", "*.js")
        for path in ROOT.rglob(pattern)
        if not {".git", ".agents", ".codex", "tools"}.intersection(path.relative_to(ROOT).parts)
    ]
    corpus = "\n".join(path.read_text(encoding="utf-8", errors="replace") for path in source_files)
    checked_selectors: set[str] = set()
    for rule in all_rules:
        if rule.selector.startswith("@") or rule.selector in checked_selectors:
            continue
        checked_selectors.add(rule.selector)
        classes, ids, attrs = selector_tokens(rule.selector)
        missing_tokens = [
            *(f".{token}" for token in classes if not token_is_used("class", token, corpus)),
            *(f"#{token}" for token in ids if not token_is_used("id", token, corpus)),
            *(f"[{token}]" for token in attrs if not token_is_used("attr", token, corpus)),
        ]
        if missing_tokens:
            warnings += 1
            report("WARNING", rule.path, rule.line, f"Regla potencialmente sin uso ({', '.join(missing_tokens)}): {rule.selector}")

    print(f"PASS Auditoría CSS completada: {len(css_files)} archivos, {len(all_rules)} reglas")
    if warnings:
        print(f"WARNING Total de advertencias: {warnings}")
    if errors:
        print(f"ERROR Total de errores: {errors}")
        return 1
    print("PASS Sin errores bloqueantes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
