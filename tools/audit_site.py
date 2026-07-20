from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
EXCLUDED_PARTS = {".git", ".agents", ".codex", "tools"}
HTML_FILES = sorted(
    path.resolve()
    for path in ROOT.rglob("*.html")
    if not EXCLUDED_PARTS.intersection(path.relative_to(ROOT).parts)
)
DOCUMENT_SUFFIXES = {".pdf", ".doc", ".docx", ".odt", ".csv", ".xlsx", ".zip"}
ASSET_LINK_RELS = {"stylesheet", "icon", "manifest", "preload", "modulepreload", "apple-touch-icon"}
LABELABLE_TAGS = {"input", "select", "textarea", "meter", "output", "progress"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[tuple[str, int, str]] = []
        self.h1_count = 0
        self.has_skip_link = False
        self.has_main_contenido = False
        self.images: list[tuple[dict[str, str], int]] = []
        self.anchors: list[tuple[dict[str, str], int]] = []
        self.assets: list[tuple[str, int, str]] = []
        self.stylesheets: list[tuple[dict[str, str], int]] = []
        self.scripts: list[tuple[dict[str, str], int]] = []
        self.primary_current_links: list[tuple[dict[str, str], int]] = []
        self.aria_controls: list[tuple[str, int]] = []
        self.labels: list[dict[str, object]] = []
        self.controls: dict[str, tuple[str, int]] = {}
        self.forms: list[tuple[dict[str, str], int]] = []
        self._nav_stack: list[bool] = []
        self._label_stack: list[int] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = {key.lower(): value if value is not None else "" for key, value in attrs}
        tag = tag.lower()
        line = self.getpos()[0]

        if "id" in attrs_dict:
            self.ids.append((attrs_dict["id"], line, tag))
        if tag == "h1":
            self.h1_count += 1
        if tag == "main" and attrs_dict.get("id") == "contenido":
            self.has_main_contenido = True

        if tag == "nav":
            label = attrs_dict.get("aria-label", "").lower()
            self._nav_stack.append("data-site-nav" in attrs_dict or "navegación principal" in label or "navegacion principal" in label)

        if tag == "a":
            self.anchors.append((attrs_dict, line))
            classes = attrs_dict.get("class", "").split()
            if "skip-link" in classes and attrs_dict.get("href") == "#contenido":
                self.has_skip_link = True
            if any(self._nav_stack) and attrs_dict.get("aria-current") == "page":
                self.primary_current_links.append((attrs_dict, line))

        if tag == "button" and attrs_dict.get("aria-controls"):
            self.aria_controls.append((attrs_dict["aria-controls"], line))

        if tag == "img":
            self.images.append((attrs_dict, line))
            self._append_asset(attrs_dict.get("src", ""), line, "img")
            self._append_srcset(attrs_dict.get("srcset", ""), line, "img srcset")
        elif tag == "source":
            self._append_asset(attrs_dict.get("src", ""), line, "source")
            self._append_srcset(attrs_dict.get("srcset", ""), line, "source srcset")
        elif tag in {"audio", "video", "iframe", "embed"}:
            self._append_asset(attrs_dict.get("src", ""), line, tag)
            if tag == "video":
                self._append_asset(attrs_dict.get("poster", ""), line, "video poster")
        elif tag == "object":
            self._append_asset(attrs_dict.get("data", ""), line, "object")
        elif tag == "link":
            rel_tokens = set(attrs_dict.get("rel", "").lower().split())
            if "stylesheet" in rel_tokens:
                self.stylesheets.append((attrs_dict, line))
            if rel_tokens.intersection(ASSET_LINK_RELS):
                self._append_asset(attrs_dict.get("href", ""), line, "link")
        elif tag == "script":
            if attrs_dict.get("src"):
                self.scripts.append((attrs_dict, line))
                self._append_asset(attrs_dict["src"], line, "script")

        if tag == "label":
            self.labels.append({"attrs": attrs_dict, "line": line, "nested": False})
            self._label_stack.append(len(self.labels) - 1)
        if tag in LABELABLE_TAGS:
            control_id = attrs_dict.get("id")
            if control_id:
                self.controls[control_id] = (tag, line)
            for label_index in self._label_stack:
                self.labels[label_index]["nested"] = True
        if tag == "form":
            self.forms.append((attrs_dict, line))

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "nav" and self._nav_stack:
            self._nav_stack.pop()
        if tag == "label" and self._label_stack:
            self._label_stack.pop()

    def _append_asset(self, value: str, line: int, kind: str) -> None:
        if value:
            self.assets.append((value, line, kind))

    def _append_srcset(self, value: str, line: int, kind: str) -> None:
        for candidate in value.split(","):
            url = candidate.strip().split()[0] if candidate.strip() else ""
            self._append_asset(url, line, kind)


def parse_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()
    return parser


def report(kind: str, path: Path | None, line: int | None, message: str) -> None:
    location = ""
    if path is not None:
        try:
            rel = path.resolve().relative_to(ROOT).as_posix()
        except ValueError:
            rel = str(path)
        location = f" {rel}"
        if line is not None:
            location += f":{line}"
    print(f"{kind}{location} - {message}")


def is_external(url: str) -> bool:
    parsed = urlsplit(url)
    return bool(parsed.scheme and parsed.scheme != "file") or url.startswith("//")


def within_root(path: Path) -> bool:
    try:
        path.resolve().relative_to(ROOT)
        return True
    except ValueError:
        return False


def local_target(page: Path, url: str) -> tuple[Path | None, str]:
    parsed = urlsplit(url)
    path_text = unquote(parsed.path)
    fragment = unquote(parsed.fragment)
    if not path_text:
        return page.resolve(), fragment
    target = ROOT / path_text.lstrip("/") if path_text.startswith("/") else page.parent / path_text
    target = target.resolve()
    if path_text.endswith("/") or target.is_dir():
        target = target / "index.html"
    elif not target.suffix:
        candidate = target / "index.html"
        if candidate.exists():
            target = candidate
    return target.resolve(), fragment


def route_for_page(path: Path) -> str:
    relative = path.relative_to(ROOT)
    if relative.as_posix() == "index.html":
        return "/"
    if relative.name == "index.html":
        return f"/{relative.parent.as_posix().strip('/')}/"
    return f"/{relative.as_posix()}"


def normalized_route(url: str) -> str:
    path = unquote(urlsplit(url).path) or "/"
    if path.endswith("index.html"):
        path = path[: -len("index.html")]
    if path != "/" and not Path(path).suffix and not path.endswith("/"):
        path += "/"
    return path


def audit_page(path: Path, parser: PageParser, ids_by_page: dict[Path, set[str]]) -> tuple[int, int]:
    errors = 0
    warnings = 0
    ids = {value for value, _line, _tag in parser.ids if value}
    counts = Counter(value for value, _line, _tag in parser.ids)
    id_lines: dict[str, list[int]] = defaultdict(list)
    for value, line, _tag in parser.ids:
        id_lines[value].append(line)

    for value, count in counts.items():
        if not value:
            errors += 1
            report("ERROR", path, id_lines[value][0], "ID vacío")
        elif count > 1:
            errors += 1
            report("ERROR", path, id_lines[value][0], f"ID duplicado dentro de la página: {value}")

    if parser.h1_count != 1:
        errors += 1
        report("ERROR", path, None, f"La página debe tener exactamente un h1; tiene {parser.h1_count}")
    if not parser.has_skip_link:
        errors += 1
        report("ERROR", path, None, "Falta skip-link a #contenido")
    if not parser.has_main_contenido:
        errors += 1
        report("ERROR", path, None, 'Falta main id="contenido"')
    if not parser.stylesheets:
        errors += 1
        report("ERROR", path, None, "No carga una hoja de estilos")
    if not parser.scripts:
        errors += 1
        report("ERROR", path, None, "No carga JavaScript externo")

    main_scripts = []
    for attrs, line in parser.scripts:
        target, _fragment = local_target(path, attrs.get("src", ""))
        if target == (ROOT / "script.js").resolve():
            main_scripts.append((attrs, line))
    if not main_scripts:
        errors += 1
        report("ERROR", path, None, "No carga el inicializador /script.js")
    for attrs, line in main_scripts:
        if attrs.get("type", "").lower() != "module":
            errors += 1
            report("ERROR", path, line, '/script.js debe cargarse con type="module"')

    if not parser.primary_current_links:
        errors += 1
        report("ERROR", path, None, 'La navegación principal no identifica la página con aria-current="page"')
    else:
        expected_route = route_for_page(path)
        matching = [attrs for attrs, _line in parser.primary_current_links if normalized_route(attrs.get("href", "")) == expected_route]
        if not matching:
            errors += 1
            report("ERROR", path, None, f"aria-current de la navegación no corresponde a {expected_route}")

    for attrs, line in parser.images:
        if "alt" not in attrs:
            errors += 1
            report("ERROR", path, line, "Imagen sin atributo alt")

    for attrs, line in parser.anchors:
        if "href" not in attrs or not attrs.get("href", "").strip():
            errors += 1
            report("ERROR", path, line, "Enlace sin href útil")
            continue
        href = attrs["href"].strip()
        if href == "#":
            errors += 1
            report("ERROR", path, line, 'Enlace href="#" no permitido')
            continue
        if href.lower().startswith("javascript:"):
            errors += 1
            report("ERROR", path, line, "Enlace javascript: no permitido")
            continue
        if is_external(href):
            continue
        target, fragment = local_target(path, href)
        if target is None or not within_root(target):
            errors += 1
            report("ERROR", path, line, f"Enlace sale de la raíz pública: {href}")
        elif not target.exists():
            errors += 1
            report("ERROR", path, line, f"Enlace interno apunta a archivo inexistente: {href}")
        elif fragment and target.suffix.lower() == ".html" and fragment not in ids_by_page.get(target, set()):
            errors += 1
            report("ERROR", path, line, f"Fragmento interno inexistente: {href}")

    for src, line, kind in parser.assets:
        if is_external(src) or src.startswith("data:"):
            continue
        target, _fragment = local_target(path, src)
        if target is None or not within_root(target) or not target.exists():
            errors += 1
            report("ERROR", path, line, f"Referencia {kind} apunta a asset inexistente: {src}")

    for controlled_ids, line in parser.aria_controls:
        for controlled_id in controlled_ids.split():
            if controlled_id not in ids:
                errors += 1
                report("ERROR", path, line, f'aria-controls apunta a ID inexistente: "{controlled_id}"')

    for label in parser.labels:
        attrs = label["attrs"]
        line = int(label["line"])
        target_id = attrs.get("for", "")
        if target_id:
            if target_id not in parser.controls:
                errors += 1
                report("ERROR", path, line, f'Label for="{target_id}" sin control asociado')
        elif not label["nested"]:
            errors += 1
            report("ERROR", path, line, "Label sin for ni control anidado")

    for attrs, line in parser.forms:
        action = attrs.get("action", "").strip()
        method = attrs.get("method", "").lower()
        has_local_hook = any(name.startswith("data-") for name in attrs) or attrs.get("role") == "search"
        if not action and method != "dialog" and not has_local_hook:
            warnings += 1
            report("WARNING", path, line, "Formulario sin action ni hook local explícito")

    if errors == 0:
        report("PASS", path, None, "Estructura, accesibilidad básica y rutas locales comprobadas")
    return errors, warnings


def audit_json() -> tuple[int, int, dict[Path, object]]:
    errors = 0
    parsed_files: dict[Path, object] = {}
    json_files = sorted(
        path for path in ROOT.rglob("*.json")
        if not {".git", ".agents", ".codex"}.intersection(path.relative_to(ROOT).parts)
    )
    for path in json_files:
        try:
            parsed_files[path.resolve()] = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError) as error:
            errors += 1
            report("ERROR", path, getattr(error, "lineno", None), f"JSON inválido: {error}")
    if errors == 0:
        report("PASS", None, None, f"JSON válido: {len(json_files)} archivos")
    return errors, 0, parsed_files


def audit_document_catalogue(parsed_files: dict[Path, object]) -> tuple[int, int]:
    errors = 0
    warnings = 0
    path = (ROOT / "assets/data/documents.json").resolve()
    data = parsed_files.get(path)
    if not isinstance(data, dict):
        errors += 1
        report("ERROR", path, None, "Falta catálogo documents.json válido")
        return errors, warnings
    documents = data.get("documents")
    if not isinstance(documents, list):
        errors += 1
        report("ERROR", path, None, 'documents.json debe contener una lista "documents"')
        return errors, warnings
    for index, item in enumerate(documents, start=1):
        if not isinstance(item, dict):
            errors += 1
            report("ERROR", path, None, f"Registro documental {index} no es un objeto")
            continue
        download = item.get("download")
        if download and not is_external(str(download)):
            target, _fragment = local_target(ROOT / "index.html", str(download))
            if target is None or not within_root(target) or not target.exists():
                errors += 1
                report("ERROR", path, None, f"Documento enlazado inexistente: {download}")
        if item.get("status") == "published" and not download:
            warnings += 1
            report("WARNING", path, None, f"Documento publicado sin descarga: {item.get('title', index)}")
    return errors, warnings


def audit_sitemap(html_routes: set[str]) -> tuple[int, int]:
    errors = 0
    warnings = 0
    sitemap = ROOT / "sitemap.xml"
    if not sitemap.exists():
        report("ERROR", sitemap, None, "Falta sitemap.xml")
        return 1, 0
    try:
        tree = ET.parse(sitemap)
    except (ET.ParseError, OSError) as error:
        report("ERROR", sitemap, getattr(error, "position", (None,))[0], f"Sitemap inválido: {error}")
        return 1, 0
    locations = [
        element.text or ""
        for element in tree.iter()
        if element.tag.rsplit("}", 1)[-1] == "loc"
    ]
    sitemap_routes = {
        normalized_route(location)
        for location in locations
        if not Path(urlsplit(location).path).suffix or urlsplit(location).path.endswith(".html")
    }
    for route in sorted(html_routes - sitemap_routes):
        errors += 1
        report("ERROR", sitemap, None, f"Ruta HTML ausente del sitemap: {route}")
    for route in sorted(sitemap_routes - html_routes):
        warnings += 1
        report("WARNING", sitemap, None, f"Ruta del sitemap sin página HTML local: {route}")
    if errors == 0:
        report("PASS", sitemap, None, f"Sitemap cubre {len(html_routes)} rutas HTML")
    return errors, warnings


def main() -> int:
    if not HTML_FILES:
        report("ERROR", None, None, "No se encontraron archivos HTML")
        return 1
    try:
        parsers = {path: parse_page(path) for path in HTML_FILES}
    except (OSError, UnicodeError) as error:
        report("ERROR", None, None, f"No se pudo leer el HTML: {error}")
        return 1
    ids_by_page = {path: {value for value, _line, _tag in parser.ids} for path, parser in parsers.items()}

    total_errors = 0
    total_warnings = 0
    for path, parser in parsers.items():
        errors, warnings = audit_page(path, parser, ids_by_page)
        total_errors += errors
        total_warnings += warnings

    json_errors, json_warnings, parsed_files = audit_json()
    total_errors += json_errors
    total_warnings += json_warnings
    document_errors, document_warnings = audit_document_catalogue(parsed_files)
    total_errors += document_errors
    total_warnings += document_warnings
    sitemap_errors, sitemap_warnings = audit_sitemap({route_for_page(path) for path in HTML_FILES})
    total_errors += sitemap_errors
    total_warnings += sitemap_warnings

    print(f"PASS Auditoría de sitio completada: {len(HTML_FILES)} páginas revisadas")
    if total_warnings:
        print(f"WARNING Total de advertencias: {total_warnings}")
    if total_errors:
        print(f"ERROR Total de errores: {total_errors}")
        return 1
    print("PASS Sin errores bloqueantes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
