/** Global Ctrl/Cmd+K search built from the DOM and public JSON catalogues. */
import { ensureId, fetchJson, makeElement, normalizeText } from "./utilities.js";

const FILTERS = [
  ["all", "Todo"],
  ["proposals", "Propuestas"],
  ["documents", "Documentos"],
  ["tools", "Herramientas"],
  ["art", "Estado del arte"],
  ["participation", "Participación"]
];

const GLOBAL_ROUTES = [
  { title: "Inicio", group: "CAMS", category: "proposals", url: "/", keywords: "ecosistema portada proyectos" },
  { title: "Estado que Cumple", group: "Propuestas", category: "proposals", url: "/estado-que-cumple/", keywords: "capacidad pública raíces savia semillas" },
  { title: "Documentos", group: "Documentos", category: "documents", url: "/documentos/", keywords: "biblioteca versiones citación" },
  { title: "Observatorio", group: "Herramientas", category: "tools", url: "/observatorio/", keywords: "seguimiento indicadores fuentes" },
  { title: "Bitácora", group: "Propuestas", category: "proposals", url: "/bitacora/", keywords: "publicación editorial series" },
  { title: "Participar", group: "Participación", category: "participation", url: "/participar/", keywords: "comentar colaborar suscribirse compartir" },
  { title: "Archivo público", group: "Documentos", category: "documents", url: "/archivo/", keywords: "repositorios versiones trazabilidad preservación" },
  { title: "CAMS", group: "CAMS", category: "proposals", url: "/cams/", keywords: "Carlos Arturo Martínez Sánchez autor independencia" },
  { title: "Árbol del problema técnico", group: "Herramientas", category: "tools", url: "/estado-que-cumple/#arbol-problema", keywords: "causas efectos diagnóstico dimensión" },
  { title: "RAÍCES, SAVIA y SEMILLAS", group: "Herramientas", category: "tools", url: "/estado-que-cumple/#nucleo-metodologico", keywords: "revisión madurez piloto núcleo" },
  { title: "Estado del arte comparado", group: "Estado del arte", category: "art", url: "/estado-que-cumple/#estado-arte", keywords: "experiencias enfoques comparar" },
  { title: "Arquitectura institucional", group: "Herramientas", category: "tools", url: "/estado-que-cumple/#arquitectura", keywords: "sistema comisión secretaría ventanilla" },
  { title: "Simulador de ruta normativa", group: "Herramientas", category: "tools", url: "/estado-que-cumple/#simulador", keywords: "competencia reserva ley fiscal empleo territorio" },
  { title: "Constructor de expediente técnico", group: "Herramientas", category: "tools", url: "/estado-que-cumple/#expediente", keywords: "alternativas evidencia notas progreso indicadores" }
];

function categoryFor(group, explicit = "") {
  if (FILTERS.some(([value]) => value === explicit)) return explicit;
  const normalized = normalizeText(group);
  if (normalized.includes("particip")) return "participation";
  if (normalized.includes("document") || normalized.includes("archivo")) return "documents";
  if (normalized.includes("arte") || normalized.includes("investig")) return "art";
  if (normalized.includes("herramient") || normalized.includes("metod") || normalized.includes("simul") || normalized.includes("observatorio")) return "tools";
  return "proposals";
}

function createDialog() {
  const dialog = makeElement("dialog", {
    className: "command-palette",
    attributes: { "aria-labelledby": "command-title", "data-command-palette": "" }
  });
  dialog.id = "command-palette";

  dialog.append(makeElement("div", { attributes: { "data-command-content": "" } }));
  document.body.append(dialog);
  return dialog;
}

function ensurePaletteUi(dialog) {
  if (dialog.querySelector("[data-command-input]")) {
    dialog.querySelector(".command-palette__header")?.classList.add("command-head");
    dialog.querySelector("[data-command-filters]")?.classList.add("command-filters");
    dialog.querySelector("[data-command-results]")?.classList.add("command-results");
    return;
  }
  const content = dialog.querySelector("[data-command-content]") || dialog;

  const shell = makeElement("form", { className: "command-shell" });
  shell.method = "dialog";
  shell.addEventListener("submit", (event) => event.preventDefault());

  const head = makeElement("div", { className: "command-head" });
  const title = makeElement("h2", { text: "Buscar en CAMS", attributes: { id: "command-title" } });
  const close = makeElement("button", {
    text: "×",
    attributes: { type: "button", "aria-label": "Cerrar buscador", "data-command-close": "" }
  });
  head.append(title, close);

  const label = makeElement("label", {
    text: "Páginas, documentos, herramientas y experiencias",
    attributes: { for: "command-search", class: "visually-hidden" }
  });

  const input = makeElement("input", {
    attributes: {
      id: "command-search",
      type: "search",
      autocomplete: "off",
      placeholder: "Busque herramientas, documentos o conceptos…",
      "data-command-input": "",
      role: "combobox",
      "aria-autocomplete": "list",
      "aria-expanded": "false"
    }
  });
  const filters = makeElement("div", {
    className: "command-filters",
    attributes: { "data-command-filters": "", role: "group", "aria-label": "Filtrar resultados" }
  });
  const results = makeElement("div", {
    className: "command-results",
    attributes: { id: "command-results", "data-command-results": "", role: "listbox" }
  });
  const status = makeElement("p", {
    className: "command-help",
    attributes: { "data-command-status": "", "aria-live": "polite" }
  });
  input.setAttribute("aria-controls", results.id);
  shell.append(head, label, input, filters, results, status);
  content.replaceChildren(shell);
}

function collectDomItems(root = document, pathname = location.pathname) {
  return [...root.querySelectorAll("[data-search-title]")].map((element) => ({
    title: element.dataset.searchTitle,
    group: element.dataset.searchGroup || "CAMS",
    category: categoryFor(element.dataset.searchGroup, element.dataset.searchCategory),
    url: element.dataset.searchUrl || (element.id ? `${pathname}#${element.id}` : pathname),
    keywords: `${element.dataset.searchKeywords || ""} ${element.textContent || ""}`
  }));
}

/** Build the section index from the HTML attributes on every public page, on demand. */
async function loadRemoteSectionItems() {
  const currentPath = location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
  const pagePaths = [...new Set(GLOBAL_ROUTES.map(({ url }) => new URL(url, location.origin).pathname))]
    .filter((path) => path.endsWith("/") && path !== currentPath);
  const pages = await Promise.allSettled(pagePaths.map(async (path) => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`No fue posible indexar ${path}`);
    const html = await response.text();
    const remoteDocument = new DOMParser().parseFromString(html, "text/html");
    return collectDomItems(remoteDocument, path);
  }));
  return pages.flatMap((page) => page.status === "fulfilled" ? page.value : []);
}

function deduplicate(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item.title || !item.url) return false;
    const key = `${normalizeText(item.title)}|${item.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((item) => ({
    ...item,
    category: categoryFor(item.group, item.category),
    haystack: normalizeText(`${item.title} ${item.group} ${item.keywords || ""}`)
  }));
}

async function loadCatalogueItems() {
  const [documentsResult, artResult] = await Promise.allSettled([
    fetchJson("/assets/data/documents.json"),
    fetchJson("/assets/data/state-of-art.json")
  ]);
  const items = [];

  if (documentsResult.status === "fulfilled") {
    for (const documentItem of documentsResult.value.documents || []) {
      items.push({
        title: documentItem.title,
        group: "Documentos",
        category: "documents",
        url: documentItem.download || "/documentos/",
        keywords: `${documentItem.type || ""} ${documentItem.status || ""} ${(documentItem.keywords || []).join(" ")}`
      });
    }
  }

  if (artResult.status === "fulfilled") {
    for (const record of artResult.value.records || []) {
      items.push({
        title: record.experience,
        group: "Estado del arte",
        category: "art",
        url: "/estado-que-cumple/#estado-arte",
        keywords: `${(record.approaches || []).join(" ")} ${record.learning || ""} ${record.tool || ""}`
      });
    }
  }
  return items;
}

export async function initCommandPalette() {
  const trigger = document.querySelector("[data-command-trigger]");
  if (!trigger) return;

  const dialog = document.querySelector("#command-palette") || createDialog();
  ensurePaletteUi(dialog);
  const input = dialog.querySelector("[data-command-input]");
  const results = dialog.querySelector("[data-command-results]");
  const filters = dialog.querySelector("[data-command-filters]");
  let status = dialog.querySelector("[data-command-status]");
  const closeButton = dialog.querySelector("[data-command-close]");
  if (!input || !results || !filters) return;
  if (!status) {
    status = makeElement("p", {
      className: "command-help",
      attributes: { "data-command-status": "", "aria-live": "polite" }
    });
    dialog.append(status);
  }

  trigger.setAttribute("aria-controls", ensureId(dialog, "command-palette"));
  trigger.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-controls", ensureId(results, "command-results"));
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  results.setAttribute("role", "listbox");

  let index = deduplicate([...GLOBAL_ROUTES, ...collectDomItems()]);
  let visibleItems = [];
  let activeIndex = -1;
  let activeFilter = "all";
  let returnFocus = trigger;
  let remoteIndexPromise = null;

  const ensureRemoteIndex = () => {
    if (!remoteIndexPromise) {
      remoteIndexPromise = loadRemoteSectionItems().then((items) => {
        index = deduplicate([...index, ...items]);
        if (dialog.hasAttribute("open")) render();
      });
    }
    return remoteIndexPromise;
  };

  const setActive = (nextIndex) => {
    if (!visibleItems.length) {
      activeIndex = -1;
      input.removeAttribute("aria-activedescendant");
      return;
    }
    activeIndex = (nextIndex + visibleItems.length) % visibleItems.length;
    [...results.querySelectorAll("[role='option']")].forEach((option, optionIndex) => {
      const active = optionIndex === activeIndex;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-selected", String(active));
      if (active) {
        input.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView({ block: "nearest" });
      }
    });
  };

  const render = () => {
    const queryTerms = normalizeText(input.value).split(/\s+/).filter(Boolean);
    visibleItems = index.filter((item) => {
      const categoryMatches = activeFilter === "all" || item.category === activeFilter;
      return categoryMatches && queryTerms.every((term) => item.haystack.includes(term));
    }).slice(0, 20);

    const fragment = document.createDocumentFragment();
    visibleItems.forEach((item, itemIndex) => {
      const link = makeElement("a", {
        className: "command-result",
        attributes: {
          id: `command-option-${itemIndex}`,
          href: item.url,
          role: "option",
          "aria-selected": "false"
        }
      });
      const group = makeElement("span", { text: item.group });
      const title = makeElement("strong", { text: item.title });
      link.append(group, title);
      link.addEventListener("pointermove", () => setActive(itemIndex));
      fragment.append(link);
    });
    if (!visibleItems.length) {
      fragment.append(makeElement("p", { className: "command-empty", text: "No se encontraron resultados." }));
    }
    results.replaceChildren(fragment);
    activeIndex = visibleItems.length ? 0 : -1;
    setActive(activeIndex);
    if (status) status.textContent = `${visibleItems.length} resultado${visibleItems.length === 1 ? "" : "s"}. Use flechas y Enter para abrir.`;
  };

  filters.replaceChildren();
  FILTERS.forEach(([value, label]) => {
    const button = makeElement("button", {
      text: label,
      attributes: { type: "button", "data-command-filter": value, "aria-pressed": String(value === "all") }
    });
    button.addEventListener("click", () => {
      activeFilter = value;
      filters.querySelectorAll("[data-command-filter]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      render();
      input.focus();
    });
    filters.append(button);
  });

  const open = () => {
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    trigger.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-expanded", "true");
    input.value = "";
    activeFilter = "all";
    filters.querySelectorAll("[data-command-filter]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.commandFilter === "all"));
    });
    render();
    void ensureRemoteIndex();
    requestAnimationFrame(() => input.focus());
  };

  const close = () => {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    trigger.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-expanded", "false");
    returnFocus?.focus();
  };

  trigger.addEventListener("click", open);
  closeButton?.addEventListener("click", close);
  input.addEventListener("input", render);
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(activeIndex - 1);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      location.assign(visibleItems[activeIndex].url);
    }
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase("es") === "k") {
      event.preventDefault();
      open();
    } else if (event.key === "Escape" && dialog.hasAttribute("open")) {
      event.preventDefault();
      close();
    }
  });

  render();
  const catalogueItems = await loadCatalogueItems();
  index = deduplicate([...index, ...catalogueItems]);
  if (dialog.hasAttribute("open")) render();
}
