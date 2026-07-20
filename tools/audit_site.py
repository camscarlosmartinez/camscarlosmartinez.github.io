from __future__ import annotations

import sys
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(
    path for path in ROOT.rglob("*.html") if ".git" not in path.parts and "tools" not in path.parts
)


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.tags: list[tuple[str, dict[str, str], int]] = []
        self.ids: list[tuple[str, int]] = []
        self.h1_count = 0
        self.has_skip_link = False
        self.has_main_contenido = False
        self.has_styles = False
        self.has_script = False
        self.images: list[tuple[dict[str, str], int]] = []
        self.links: list[tuple[str, int, str]] = []
        self.assets: list[tuple[str, int, str]] = []
        self.active_nav_links: list[tuple[dict[str, str], int]] = []
        self.forms: list[tuple[dict[str, str], int]] = []
        self._nav_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = {key.lower(): value or "" for key, value in attrs}
        line = self.getpos()[0]
        self.tags.append((tag, attrs_dict, line))

        if "id" in attrs_dict:
            self.ids.append((attrs_dict["id"], line))

        if tag == "h1":
            self.h1_count += 1

        if tag == "nav":
            self._nav_depth += 1

        if tag == "a":
            href = attrs_dict.get("href", "")
            classes = attrs_dict.get("class", "").split()
            if href:
                self.links.append((href, line, tag))
            if "skip-link" in classes and href == "#contenido":
                self.has_skip_link = True
            if self._nav_depth and "active" in classes:
                self.active_nav_links.append((attrs_dict, line))

        if tag == "main" and attrs_dict.get("id") == "contenido":
            self.has_main_contenido = True

        if tag == "img":
            self.images.append((attrs_dict, line))
            if attrs_dict.get("src"):
                self.assets.append((attrs_dict["src"], line, "img"))

        if tag == "link":
            href = attrs_dict.get("href", "")
            rel = attrs_dict.get("rel", "")
            if href:
                self.assets.append((href, line, "link"))
            if rel == "stylesheet" and href == "/styles.css":
                self.has_styles = True

        if tag == "script":
            src = attrs_dict.get("src", "")
            if src:
                self.assets.append((src, line, "script"))
            if src == "/script.js":
                self.has_script = True

        if tag == "form":
            self.forms.append((attrs_dict, line))

    def handle_endtag(self, tag: str) -> None:
        if tag == "nav" and self._nav_depth:
            self._nav_depth -= 1


def parse_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def report(kind: str, path: Path | None, line: int | None, message: str) -> None:
    location = ""
    if path is not None:
        rel = path.relative_to(ROOT).as_posix()
        location = f" {rel}"
        if line is not None:
            location += f":{line}"
    print(f"{kind}{location} - {message}")


def is_external(url: str) -> bool:
    parsed = urlsplit(url)
    return parsed.scheme in {"http", "https", "mailto", "tel"} or url.startswith("//")


def local_target(page: Path, url: str) -> tuple[Path | None, str]:
    parsed = urlsplit(url)
    path_text = parsed.path
    fragment = parsed.fragment

    if not path_text:
      return page, fragment

    if path_text.startswith("/"):
        target = ROOT / path_text.lstrip("/")
    else:
        target = (page.parent / path_text).resolve()

    if path_text.endswith("/"):
        target = target / "index.html"
    elif not target.suffix:
        directory_index = target / "index.html"
        target = directory_index if directory_index.exists() else target

    return target, fragment


def collect_ids_by_page(parsers: dict[Path, PageParser]) -> dict[Path, set[str]]:
    return {path: {id_value for id_value, _ in parser.ids} for path, parser in parsers.items()}


def audit_page(path: Path, parser: PageParser, ids_by_page: dict[Path, set[str]]) -> tuple[int, int]:
    errors = 0
    warnings = 0

    id_counts = Counter(id_value for id_value, _ in parser.ids)
    id_lines = defaultdict(list)
    for id_value, line in parser.ids:
        id_lines[id_value].append(line)

    for id_value, count in id_counts.items():
        if count > 1:
            errors += 1
            report("ERROR", path, id_lines[id_value][0], f"ID duplicado dentro de la página: {id_value}")

    for attrs, line in parser.images:
        if "alt" not in attrs:
            errors += 1
            report("ERROR", path, line, "Imagen sin atributo alt")

    if parser.h1_count != 1:
        errors += 1
        report("ERROR", path, None, f"La página debe tener exactamente un h1; tiene {parser.h1_count}")

    if not parser.has_skip_link:
        errors += 1
        report("ERROR", path, None, "Falta skip-link a #contenido")

    if not parser.has_main_contenido:
        errors += 1
        report("ERROR", path, None, 'Falta main id="contenido"')

    if not parser.has_styles:
        errors += 1
        report("ERROR", path, None, "No incluye /styles.css")

    if not parser.has_script:
        errors += 1
        report("ERROR", path, None, "No incluye /script.js")

    if not parser.active_nav_links:
        errors += 1
        report("ERROR", path, None, 'No hay enlace activo en navegación con aria-current="page"')

    for attrs, line in parser.active_nav_links:
        if attrs.get("aria-current") != "page":
            errors += 1
            report("ERROR", path, line, 'Enlace activo de navegación sin aria-current="page"')

    for href, line, _tag in parser.links:
        if href == "#":
            errors += 1
            report("ERROR", path, line, 'Enlace href="#" no permitido')
            continue
        if is_external(href):
            continue
        target, fragment = local_target(path, href)
        if target is None:
            continue
        if not target.exists():
            errors += 1
            report("ERROR", path, line, f"Enlace interno apunta a archivo inexistente: {href}")
            continue
        if fragment and target.suffix == ".html" and fragment not in ids_by_page.get(target.resolve(), set()):
            errors += 1
            report("ERROR", path, line, f"Fragmento interno inexistente: {href}")

    for src, line, tag in parser.assets:
        if is_external(src):
            continue
        target, _fragment = local_target(path, src)
        if target is not None and not target.exists():
            errors += 1
            report("ERROR", path, line, f"Referencia {tag} apunta a asset inexistente: {src}")

    for attrs, line in parser.forms:
        classes = attrs.get("class", "")
        has_local_handler = "data-decision-form" in attrs or "decision-form" in classes.split()
        action = attrs.get("action", "").strip()
        method = attrs.get("method", "").lower()
        if not action and method != "dialog" and not has_local_handler:
            warnings += 1
            report("WARNING", path, line, "Formulario sin action real; revisar que no aparente enviar datos")

    if errors == 0:
        report("PASS", path, None, "Estructura básica y enlaces locales sin errores")

    return errors, warnings


def main() -> int:
    if not HTML_FILES:
        report("ERROR", None, None, "No se encontraron archivos HTML")
        return 1

    parsers = {path.resolve(): parse_page(path) for path in HTML_FILES}
    ids_by_page = collect_ids_by_page(parsers)

    total_errors = 0
    total_warnings = 0
    for path, parser in parsers.items():
        errors, warnings = audit_page(path, parser, ids_by_page)
        total_errors += errors
        total_warnings += warnings

    print(f"PASS Auditoría completada: {len(HTML_FILES)} páginas revisadas")
    if total_warnings:
        print(f"WARNING Total de advertencias: {total_warnings}")
    if total_errors:
        print(f"ERROR Total de errores: {total_errors}")
        return 1
    print("PASS Sin errores bloqueantes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
