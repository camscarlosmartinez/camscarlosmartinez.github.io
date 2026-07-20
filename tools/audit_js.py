from __future__ import annotations

import re
from collections import Counter, defaultdict, deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
ENTRY = (ROOT / "script.js").resolve()
JS_ROOT = (ROOT / "assets/js").resolve()
EXCLUDED_PARTS = {".git", ".agents", ".codex", "tools"}
STATIC_IMPORT_RE = re.compile(
    r"\b(?:import|export)\s+(?:[^;\n]*?\s+from\s+)?[\"']([^\"']+)[\"']",
    re.MULTILINE,
)
DYNAMIC_IMPORT_RE = re.compile(r"\bimport\s*\(\s*[\"']([^\"']+)[\"']\s*\)")
INIT_FUNCTION_RE = re.compile(r"\b(?:export\s+)?(?:async\s+)?function\s+(init[A-Z][\w$]*)\s*\(")
INIT_VARIABLE_RE = re.compile(r"\b(?:export\s+)?const\s+(init[A-Z][\w$]*)\s*=")
SELECTOR_RE = re.compile(
    r"\b(?:querySelectorAll|querySelector|closest|matches)\s*\(\s*(?P<quote>[\"'`])(?P<selector>[^\r\n]*?)(?P=quote)\s*\)",
    re.MULTILINE,
)


class HtmlTokens(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.classes: set[str] = set()
        self.ids: set[str] = set()
        self.attributes: set[str] = set()

    def handle_starttag(self, _tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            name = name.lower()
            self.attributes.add(name)
            if name == "id" and value:
                self.ids.add(value)
            elif name == "class" and value:
                self.classes.update(value.split())


def report(kind: str, path: Path | None, line: int | None, message: str) -> None:
    location = ""
    if path is not None:
        location = f" {path.resolve().relative_to(ROOT).as_posix()}"
        if line is not None:
            location += f":{line}"
    print(f"{kind}{location} - {message}")


def strip_comments(text: str) -> str:
    pattern = re.compile(r"//[^\n]*|/\*.*?\*/", re.DOTALL)
    return pattern.sub(lambda match: "\n" * match.group(0).count("\n"), text)


def resolve_import(source: Path, specifier: str) -> Path | None:
    parsed = urlsplit(specifier)
    if parsed.scheme or specifier.startswith("//"):
        return None
    target = ROOT / parsed.path.lstrip("/") if parsed.path.startswith("/") else source.parent / parsed.path
    if not target.suffix:
        target = target.with_suffix(".js")
    return target.resolve()


def imports_for(path: Path) -> list[tuple[str, int]]:
    text = strip_comments(path.read_text(encoding="utf-8"))
    matches = [*STATIC_IMPORT_RE.finditer(text), *DYNAMIC_IMPORT_RE.finditer(text)]
    matches.sort(key=lambda match: match.start())
    return [(match.group(1), text.count("\n", 0, match.start()) + 1) for match in matches]


def collect_html_tokens() -> HtmlTokens:
    tokens = HtmlTokens()
    for path in ROOT.rglob("*.html"):
        if EXCLUDED_PARTS.intersection(path.relative_to(ROOT).parts):
            continue
        tokens.feed(path.read_text(encoding="utf-8"))
    tokens.close()
    return tokens


def collect_created_tokens(js_files: list[Path]) -> tuple[set[str], set[str], set[str]]:
    classes: set[str] = set()
    ids: set[str] = set()
    attributes: set[str] = set()
    for path in js_files:
        text = strip_comments(path.read_text(encoding="utf-8"))
        for match in re.finditer(r"\bclassName\s*(?:=|:)\s*[\"']([^\"']+)[\"']", text):
            classes.update(match.group(1).split())
        for match in re.finditer(r"\.classList\.(?:add|remove|toggle)\(\s*[\"']([^\"']+)[\"']", text):
            classes.add(match.group(1))
        for match in re.finditer(r"\.id\s*=\s*[\"']([^\"']+)[\"']", text):
            ids.add(match.group(1))
        for match in re.finditer(r"[\"']id[\"']?\s*:\s*[\"']([^\"']+)[\"']", text):
            ids.add(match.group(1))
        for match in re.finditer(r"[\"'](data-[\w-]+)[\"']\s*:", text):
            attributes.add(match.group(1))
        for match in re.finditer(r"\.setAttribute\(\s*[\"'](data-[\w-]+)[\"']", text):
            attributes.add(match.group(1))
    return classes, ids, attributes


def selector_missing_tokens(
    selector: str,
    html: HtmlTokens,
    created_classes: set[str],
    created_ids: set[str],
    created_attrs: set[str],
) -> list[str]:
    if "${" in selector:
        return []
    classes = set(re.findall(r"(?<![\w-])\.([_a-zA-Z][\w-]*)", selector))
    ids = set(re.findall(r"(?<![\w-])#([_a-zA-Z][\w-]*)", selector))
    attrs = set(re.findall(r"\[\s*(data-[\w-]+)", selector))
    return [
        *(f".{name}" for name in classes if name not in html.classes and name not in created_classes),
        *(f"#{name}" for name in ids if name not in html.ids and name not in created_ids),
        *(f"[{name}]" for name in attrs if name not in html.attributes and name not in created_attrs),
    ]


def main() -> int:
    if not ENTRY.exists():
        report("ERROR", ENTRY, None, "Falta el inicializador script.js")
        return 1
    js_files = sorted(
        path.resolve()
        for path in ROOT.rglob("*.js")
        if not EXCLUDED_PARTS.intersection(path.relative_to(ROOT).parts)
    )
    js_set = set(js_files)
    graph: dict[Path, set[Path]] = defaultdict(set)
    errors = 0
    warnings = 0

    for path in js_files:
        for specifier, line in imports_for(path):
            target = resolve_import(path, specifier)
            if target is None:
                continue
            graph[path].add(target)
            if not target.exists():
                errors += 1
                report("ERROR", path, line, f"Import inexistente: {specifier}")

    reachable: set[Path] = set()
    queue: deque[Path] = deque([ENTRY])
    while queue:
        path = queue.popleft()
        if path in reachable or path not in js_set:
            continue
        reachable.add(path)
        queue.extend(graph.get(path, set()))
    for path in js_files:
        if path != ENTRY and path not in reachable:
            warnings += 1
            report("WARNING", path, None, "Archivo JavaScript no importado desde script.js")

    initializer_locations: dict[str, list[tuple[Path, int]]] = defaultdict(list)
    for path in js_files:
        text = strip_comments(path.read_text(encoding="utf-8"))
        for regex in (INIT_FUNCTION_RE, INIT_VARIABLE_RE):
            for match in regex.finditer(text):
                initializer_locations[match.group(1)].append((path, text.count("\n", 0, match.start()) + 1))
    for name, locations in initializer_locations.items():
        if len(locations) > 1:
            warnings += 1
            path, line = locations[0]
            places = ", ".join(f"{item.relative_to(ROOT).as_posix()}:{item_line}" for item, item_line in locations)
            report("WARNING", path, line, f"Inicializador duplicado {name}: {places}")

    html_tokens = collect_html_tokens()
    created_classes, created_ids, created_attrs = collect_created_tokens(js_files)
    seen_selector_warnings: set[tuple[Path, str]] = set()
    selector_count = 0
    for path in js_files:
        text = strip_comments(path.read_text(encoding="utf-8"))
        for match in SELECTOR_RE.finditer(text):
            selector = match.group("selector")
            selector_count += 1
            missing = selector_missing_tokens(selector, html_tokens, created_classes, created_ids, created_attrs)
            key = (path, selector)
            if missing and key not in seen_selector_warnings:
                seen_selector_warnings.add(key)
                warnings += 1
                line = text.count("\n", 0, match.start()) + 1
                report("WARNING", path, line, f"Selector posiblemente inexistente ({', '.join(missing)}): {selector}")

    imported_count = sum(len(targets) for targets in graph.values())
    print(f"PASS Auditoría JS completada: {len(js_files)} archivos, {imported_count} imports, {selector_count} selectores literales")
    if warnings:
        print(f"WARNING Total de advertencias: {warnings}")
    if errors:
        print(f"ERROR Total de errores: {errors}")
        return 1
    print("PASS Sin errores bloqueantes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
