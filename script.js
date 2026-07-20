document.documentElement.classList.add("js-ready");

const camsState = {
  searchIndex: [],
  openCommandPalette: null,
  escapeHandlers: []
};

function normalizeId(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeSearch(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function registerEscapeHandler(handler) {
  if (typeof handler === "function") {
    camsState.escapeHandlers.push(handler);
  }
}

function initGlobalKeyboard() {
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      if (camsState.openCommandPalette) {
        event.preventDefault();
        camsState.openCommandPalette();
      }
      return;
    }

    if (event.key === "Escape") {
      camsState.escapeHandlers.forEach((handler) => handler(event));
    }
  });
}

function initMenu() {
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav");
  if (!menuButton || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  };

  menuButton.addEventListener("click", () => {
    setOpen(!nav.classList.contains("open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  registerEscapeHandler(() => {
    if (nav.classList.contains("open")) {
      setOpen(false);
      menuButton.focus();
    }
  });
}

function initDocumentFilter() {
  const search = document.querySelector("#docSearch");
  const filter = document.querySelector("#docFilter");
  const docs = [...document.querySelectorAll(".doc-item")];
  if (!search || !filter || !docs.length) return;

  const applyDocFilter = () => {
    const query = normalizeSearch(search.value.trim());
    const type = filter.value || "all";

    docs.forEach((item) => {
      const text = normalizeSearch(`${item.dataset.text || ""} ${item.innerText}`);
      const okText = !query || text.includes(query);
      const okType = type === "all" || item.dataset.type === type;
      item.classList.toggle("is-hidden", !(okText && okType));
    });
  };

  search.addEventListener("input", applyDocFilter);
  filter.addEventListener("change", applyDocFilter);
  applyDocFilter();
}

function bindPanelSwitcher(config) {
  const {
    rootSelector,
    triggerSelector,
    panelSelector,
    triggerKey,
    panelKey,
    tablistSelector,
    tablistLabel,
    orientation = "horizontal"
  } = config;

  document.querySelectorAll(rootSelector).forEach((root, rootIndex) => {
    const triggers = [...root.querySelectorAll(triggerSelector)];
    const panels = [...root.querySelectorAll(panelSelector)];
    if (!triggers.length || !panels.length) return;

    const tablist = root.querySelector(tablistSelector) || triggers[0].parentElement;
    tablist?.setAttribute("role", "tablist");
    tablist?.setAttribute("aria-label", tablistLabel);
    if (orientation === "vertical") {
      tablist?.setAttribute("aria-orientation", "vertical");
    }

    const namespace = normalizeId(root.id || root.getAttribute("aria-labelledby") || `${tablistLabel}-${rootIndex}`);

    triggers.forEach((trigger, index) => {
      const key = trigger.dataset[triggerKey];
      const panel = panels.find((item) => item.dataset[panelKey] === key);
      const triggerId = trigger.id || `${namespace}-${normalizeId(key)}-tab`;
      const panelId = panel?.id || `${namespace}-${normalizeId(key)}-panel`;

      trigger.id = triggerId;
      trigger.setAttribute("role", "tab");
      trigger.setAttribute("aria-controls", panelId);
      trigger.setAttribute("tabindex", index === 0 ? "0" : "-1");

      if (panel) {
        panel.id = panelId;
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", triggerId);
        panel.setAttribute("tabindex", "0");
      }
    });

    const activate = (key, shouldFocus = false) => {
      triggers.forEach((trigger) => {
        const active = trigger.dataset[triggerKey] === key;
        trigger.classList.toggle("is-active", active);
        trigger.setAttribute("aria-selected", String(active));
        trigger.setAttribute("tabindex", active ? "0" : "-1");
        if (shouldFocus && active) trigger.focus();
      });

      panels.forEach((panel) => {
        const active = panel.dataset[panelKey] === key;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    };

    const initial =
      triggers.find((trigger) => trigger.classList.contains("is-active"))?.dataset[triggerKey] ||
      triggers[0].dataset[triggerKey];

    activate(initial);

    triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => activate(trigger.dataset[triggerKey]));
      trigger.addEventListener("keydown", (event) => {
        const previousKeys = orientation === "vertical" ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft"];
        const nextKeys = orientation === "vertical" ? ["ArrowDown", "ArrowRight"] : ["ArrowRight"];
        let nextIndex = index;

        if (nextKeys.includes(event.key)) nextIndex = (index + 1) % triggers.length;
        if (previousKeys.includes(event.key)) nextIndex = (index - 1 + triggers.length) % triggers.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = triggers.length - 1;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate(trigger.dataset[triggerKey]);
          return;
        }

        if (nextIndex !== index) {
          event.preventDefault();
          activate(triggers[nextIndex].dataset[triggerKey], true);
        }
      });
    });
  });
}

function initAccessibleTabs() {
  bindPanelSwitcher({
    rootSelector: "[data-core-tabs]",
    triggerSelector: "[data-core-tab]",
    panelSelector: "[data-core-panel]",
    triggerKey: "coreTab",
    panelKey: "corePanel",
    tablistSelector: ".core-tablist",
    tablistLabel: "Herramientas RAÍCES, SAVIA y SEMILLAS"
  });

  bindPanelSwitcher({
    rootSelector: "[data-system-map]",
    triggerSelector: "[data-system-node]",
    panelSelector: "[data-system-panel]",
    triggerKey: "systemNode",
    panelKey: "systemPanel",
    tablistSelector: ".system-nodes",
    tablistLabel: "Mapa de arquitectura institucional"
  });

  bindPanelSwitcher({
    rootSelector: "[data-route-tabs]",
    triggerSelector: "[data-route-tab]",
    panelSelector: "[data-route-panel]",
    triggerKey: "routeTab",
    panelKey: "routePanel",
    tablistSelector: ".route-tablist",
    tablistLabel: "Rutas de activación"
  });

  bindPanelSwitcher({
    rootSelector: "[data-knowledge-tabs]",
    triggerSelector: "[data-knowledge-tab]",
    panelSelector: "[data-knowledge-panel]",
    triggerKey: "knowledgeTab",
    panelKey: "knowledgePanel",
    tablistSelector: ".knowledge-tablist",
    tablistLabel: "Temas del estado del arte",
    orientation: "vertical"
  });

  bindPanelSwitcher({
    rootSelector: "[data-stepper]",
    triggerSelector: "[data-step-tab]",
    panelSelector: "[data-step-panel]",
    triggerKey: "stepTab",
    panelKey: "stepPanel",
    tablistSelector: ".step-list, .process-line",
    tablistLabel: "Pasos del proceso"
  });
}

function initProblemTree() {
  document.querySelectorAll("[data-problem-tree]").forEach((tree) => {
    const nodes = [...tree.querySelectorAll("[data-problem-title]")];
    const title = tree.querySelector("[data-problem-detail-title]");
    const text = tree.querySelector("[data-problem-detail-text]");
    const type = tree.querySelector("[data-problem-detail-type]");
    const relation = tree.querySelector("[data-problem-detail-relation]");
    const tool = tree.querySelector("[data-problem-detail-tool]");
    if (!nodes.length || !title || !text) return;

    const activate = (node) => {
      nodes.forEach((item) => {
        const active = item === node;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      title.textContent = node.dataset.problemTitle || node.textContent.trim();
      text.textContent = node.dataset.problemText || "";
      if (type) type.textContent = node.dataset.problemType || "Nodo";
      if (relation) relation.textContent = node.dataset.problemRelation || "Relación por documentar.";
      if (tool) tool.textContent = node.dataset.problemTool || "Expediente Técnico Integrado";
    };

    nodes.forEach((node) => {
      node.setAttribute("aria-pressed", "false");
      node.addEventListener("click", () => activate(node));
    });

    activate(nodes.find((node) => node.classList.contains("is-active")) || nodes[0]);
  });
}

function initChecklist() {
  document.querySelectorAll("[data-checklist]").forEach((checklist) => {
    const items = [...checklist.querySelectorAll("[data-check-item]")];
    const title = checklist.querySelector("[data-check-title]");
    const text = checklist.querySelector("[data-check-text]");
    const meta = checklist.querySelector("[data-check-meta]");
    if (!items.length || !title || !text) return;

    const activate = (item) => {
      items.forEach((button) => {
        const active = button === item;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      title.textContent = item.dataset.checkTitle || item.textContent.trim();
      text.textContent = item.dataset.checkText || "";
      if (meta) meta.textContent = item.dataset.checkMeta || "";
    };

    items.forEach((item) => {
      item.setAttribute("aria-pressed", "false");
      item.addEventListener("click", () => activate(item));
    });

    activate(items.find((item) => item.classList.contains("is-active")) || items[0]);
  });
}

function initFloatingPanel() {
  const floatingButton = document.querySelector(".floating-ring");
  const floatingPanel = document.querySelector("#floatingPanel");
  const floatingClose = document.querySelector(".floating-close");
  if (!floatingButton || !floatingPanel) return;

  const setFloatingPanel = (open, restoreFocus = true) => {
    floatingPanel.hidden = !open;
    floatingPanel.classList.toggle("is-open", open);
    floatingButton.setAttribute("aria-expanded", String(open));

    if (open) {
      floatingPanel.querySelector("a,button")?.focus();
    } else if (restoreFocus) {
      floatingButton.focus();
    }
  };

  floatingButton.addEventListener("click", () => {
    setFloatingPanel(floatingPanel.hidden);
  });

  floatingClose?.addEventListener("click", () => setFloatingPanel(false));

  registerEscapeHandler(() => {
    if (!floatingPanel.hidden) {
      setFloatingPanel(false);
    }
  });
}

function initReadingProgress() {
  if (!document.body) return;

  const bar = document.createElement("div");
  bar.className = "reading-progress";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = "<span></span>";
  document.body.prepend(bar);

  const fill = bar.querySelector("span");
  if (!fill) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    fill.style.transform = `scaleX(${ratio})`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function buildSearchUrl(element) {
  if (element.dataset.searchUrl) return element.dataset.searchUrl;
  if (element.id) return `${window.location.pathname}#${element.id}`;
  return window.location.pathname;
}

function initSearchIndex() {
  const globalPages = [
    { title: "Inicio CAMS", group: "Sitio", url: "/", keywords: "inicio portada CAMS Estado que Cumple" },
    { title: "Estado que Cumple", group: "Propuesta", url: "/estado-que-cumple/", keywords: "propuesta capacidad pública expediente tablero" },
    { title: "Documentos", group: "Archivo", url: "/documentos/", keywords: "PDF biblioteca publicaciones matrices" },
    { title: "Observatorio", group: "Observatorio", url: "/observatorio/", keywords: "seguimiento ciudadano tableros matrices" },
    { title: "Bitácora", group: "Bitácora", url: "/bitacora/", keywords: "notas análisis debate público" },
    { title: "Participar", group: "Comunidad", url: "/participar/", keywords: "comentarios suscripción voluntariado" },
    { title: "Archivo público y redes", group: "Comunidad", url: "/archivo/", keywords: "github instagram linkedin facebook repositorios" },
    { title: "Abrir PDF Estado que Cumple", group: "Documento", url: "/assets/documentos/estado-que-cumple-2026-2030.pdf", keywords: "pdf documento técnico político discusión pública" }
  ];

  const domItems = [...document.querySelectorAll("[data-search-title]")].map((element) => ({
    title: element.dataset.searchTitle,
    group: element.dataset.searchGroup || "Sitio",
    url: buildSearchUrl(element),
    keywords: `${element.dataset.searchKeywords || ""} ${element.textContent || ""}`
  }));

  const seen = new Set();
  camsState.searchIndex = [...globalPages, ...domItems]
    .filter((item) => item.title && item.url)
    .map((item) => ({
      ...item,
      haystack: normalizeSearch(`${item.title} ${item.group} ${item.keywords}`)
    }))
    .filter((item) => {
      const key = `${item.title}|${item.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function initCommandPalette() {
  const topbar = document.querySelector(".topbar");
  if (!topbar || !camsState.searchIndex.length) return;

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "command-trigger";
  trigger.setAttribute("aria-label", "Buscar en CAMS");
  trigger.innerHTML = '<span aria-hidden="true">⌕</span><kbd>Ctrl K</kbd>';
  topbar.insertBefore(trigger, topbar.querySelector(".menu-button"));

  const dialog = document.createElement("dialog");
  dialog.className = "command-palette";
  dialog.setAttribute("aria-label", "Buscador global CAMS");
  dialog.innerHTML = `
    <form method="dialog" class="command-shell">
      <div class="command-head">
        <label for="commandSearch">Buscar en la propuesta y el archivo</label>
        <button value="cancel" aria-label="Cerrar buscador">×</button>
      </div>
      <input id="commandSearch" type="search" autocomplete="off" placeholder="Escriba: árbol, expediente, riesgos, documentos..." />
      <div class="command-results" role="listbox"></div>
      <p class="command-help">Use flechas para navegar, Enter para abrir y Esc para cerrar.</p>
    </form>`;
  document.body.append(dialog);

  const input = dialog.querySelector("input");
  const results = dialog.querySelector(".command-results");
  let activeIndex = 0;
  let visibleItems = [];

  const render = () => {
    const query = normalizeSearch(input.value.trim());
    visibleItems = camsState.searchIndex
      .filter((item) => !query || item.haystack.includes(query))
      .slice(0, 10);

    activeIndex = Math.min(activeIndex, Math.max(0, visibleItems.length - 1));
    results.innerHTML = visibleItems.length
      ? visibleItems.map((item, index) => `
        <a role="option" aria-selected="${index === activeIndex}" class="${index === activeIndex ? "is-active" : ""}" href="${item.url}">
          <span>${item.group}</span><strong>${item.title}</strong>
        </a>`).join("")
      : '<p class="command-empty">No se encontraron resultados.</p>';
  };

  const open = () => {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    input.value = "";
    activeIndex = 0;
    render();
    requestAnimationFrame(() => input.focus());
  };

  trigger.addEventListener("click", open);
  camsState.openCommandPalette = open;

  input.addEventListener("input", () => {
    activeIndex = 0;
    render();
  });

  input.addEventListener("keydown", (event) => {
    if (!visibleItems.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % visibleItems.length;
      render();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
      render();
    }

    if (event.key === "Enter") {
      event.preventDefault();
      window.location.href = visibleItems[activeIndex].url;
    }
  });
}

function initSectionNavigator() {
  const proposalMain = document.querySelector(".proposal-hero-v2")?.closest("main");
  if (!proposalMain) return;

  const sections = [...proposalMain.querySelectorAll("section[id]")]
    .map((section) => ({
      id: section.id,
      label: section.dataset.searchTitle || section.querySelector(".overline")?.textContent?.trim() || section.querySelector("h2")?.textContent?.trim() || section.id
    }))
    .filter((item) => item.id && item.label)
    .slice(0, 16);
  if (sections.length < 3) return;

  const nav = document.createElement("nav");
  nav.className = "section-navigator";
  nav.setAttribute("aria-label", "Navegación de la propuesta");
  nav.innerHTML = `<div>${sections.map((item) => `<a href="#${item.id}" data-section-link="${item.id}">${item.label}</a>`).join("")}</div>`;
  document.body.append(nav);

  const links = [...nav.querySelectorAll("a")];
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.sectionLink === visible.target.id);
    });
  }, { rootMargin: "-28% 0px -62% 0px", threshold: [0.01, 0.15, 0.35] });

  sections.forEach((item) => {
    const target = document.getElementById(item.id);
    if (target) observer.observe(target);
  });

  const jump = proposalMain.querySelector("[data-section-jump]");
  jump?.addEventListener("change", () => {
    if (jump.value) {
      window.location.hash = jump.value;
      jump.value = "";
    }
  });
}

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function initViewMode() {
  const main = document.querySelector("main[data-view-mode]");
  const panel = document.querySelector("[data-view-mode-panel]");
  if (!main || !panel) return;

  const chapters = [
    { key: "problem", title: "El problema", summary: "Problema público, árbol técnico y tipología de formas institucionales prematuras." },
    { key: "logic", title: "La lógica de transformación", summary: "RAÍCES, SAVIA, SEMILLAS, teoría de cambio y aprendizajes para no copiar formas sin capacidad." },
    { key: "architecture", title: "La arquitectura institucional", summary: "Sistema, comisión, secretaría técnica, ventanilla y rutas de activación." },
    { key: "decision", title: "La decisión", summary: "Simulador, ruta integrada, expediente, metodologías e instrumentos competentes." },
    { key: "control", title: "Control y aprendizaje", summary: "Riesgos, indicadores, tablero público, evaluación y documento fuente." }
  ];

  const buttons = [...panel.querySelectorAll("[data-view-mode-option]")];
  const title = panel.querySelector("[data-guided-title]");
  const summary = panel.querySelector("[data-guided-summary]");
  const count = panel.querySelector("[data-guided-count]");
  const previous = panel.querySelector("[data-guided-prev]");
  const next = panel.querySelector("[data-guided-next]");
  const full = panel.querySelector("[data-guided-full]");
  const sections = [...main.querySelectorAll("[data-guided-chapter]")];
  if (!buttons.length || !sections.length) return;

  let mode = safeStorageGet("cams:viewMode") || main.dataset.viewMode || "full";
  let chapterIndex = Math.max(0, chapters.findIndex((item) => item.key === safeStorageGet("cams:guidedChapter")));

  const apply = () => {
    const chapter = chapters[chapterIndex];
    main.dataset.viewMode = mode;
    document.body.classList.toggle("is-guided-mode", mode === "guided");

    buttons.forEach((button) => {
      const active = button.dataset.viewModeOption === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    sections.forEach((section) => {
      section.classList.toggle("is-guided-active", mode === "guided" && section.dataset.guidedChapter === chapter.key);
    });

    if (mode === "guided") {
      if (title) title.textContent = chapter.title;
      if (summary) summary.textContent = chapter.summary;
      if (count) count.textContent = `Capítulo ${chapterIndex + 1} de ${chapters.length}`;
      if (previous) previous.disabled = chapterIndex === 0;
      if (next) next.disabled = chapterIndex === chapters.length - 1;
    } else {
      if (title) title.textContent = "Documento técnico completo";
      if (summary) summary.textContent = "Todas las secciones están visibles junto con el índice técnico.";
      if (count) count.textContent = "Modo completo";
    }

    safeStorageSet("cams:viewMode", mode);
    safeStorageSet("cams:guidedChapter", chapter.key);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      mode = button.dataset.viewModeOption || "full";
      apply();
    });
  });

  previous?.addEventListener("click", () => {
    chapterIndex = Math.max(0, chapterIndex - 1);
    apply();
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  next?.addEventListener("click", () => {
    chapterIndex = Math.min(chapters.length - 1, chapterIndex + 1);
    apply();
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  full?.addEventListener("click", () => {
    mode = "full";
    apply();
  });

  apply();
}

function buildDecisionRecommendation(values) {
  const sequence = ["Delimitar el problema público y la finalidad constitucional."];
  const badges = ["RAÍCES"];
  let title = "Revisión institucional antes de decidir";
  let diagnosis = "Revisar la forma institucional existente antes de crear una solución permanente.";
  let tools = ["RAÍCES", "SAVIA"];
  let actor = "Debe definirse según competencia y alcance.";
  let instrument = "Por clasificar mediante expediente técnico.";
  const conditions = ["evidencia verificable", "fuente fiscal", "soporte laboral", "datos útiles", "ruta jurídica"];
  const warnings = ["No presentar la salida como decisión categórica.", "No reemplaza conceptos jurídicos, fiscales, laborales ni administrativos."];
  let next = "Completar inventario RAÍCES y matriz SAVIA.";

  if (values.existing === "yes") {
    sequence.push("Aplicar RAÍCES para comparar función existente, duplicidades y alternativas de fortalecimiento, integración o traslado.");
    diagnosis = "Corregir o fortalecer lo existente antes de crear una nueva forma.";
  } else if (values.existing === "no") {
    sequence.push("Documentar por qué no existe una forma equivalente y comparar coordinación, piloto, unidad interna o nueva figura.");
    diagnosis = "Explorar alternativas institucionales sin asumir creación orgánica inmediata.";
  } else {
    sequence.push("Completar inventario RAÍCES antes de definir una solución.");
  }

  sequence.push("Aplicar SAVIA para revisar finalidad, evidencia, financiación, talento, datos, territorio, archivo, riesgos y control.");
  badges.push("SAVIA");

  if (values.maturity === "low" || values.evidence === "low" || values.territory === "low" || values.urgency === "pilot") {
    sequence.push("Diseñar un piloto SEMILLAS con línea base, responsables, plazos, indicadores y decisión final de cierre, ajuste, absorción o escalamiento.");
    badges.push("SEMILLAS");
    tools.push("SEMILLAS");
    title = "Madurar capacidad antes de volver permanente la solución";
    conditions.push("línea base", "alcance piloto", "criterios de evaluación");
    next = "Diseñar piloto SEMILLAS proporcional antes de escalar.";
  } else {
    sequence.push("Preparar directamente el Expediente Técnico Integrado, manteniendo evaluación posterior.");
  }

  sequence.push("Consolidar el Expediente Técnico Integrado con alternativas, impactos, participación, cronograma e indicadores.");
  badges.push("EXPEDIENTE");
  tools.push("Expediente Técnico Integrado");

  if (values.legal === "yes" || values.actor === "legislative") {
    sequence.push("Preclasificar reserva de ley y preparar proyecto de ley, debate legislativo y control político cuando corresponda.");
    badges.push("CONGRESO / LEY");
    actor = "Congreso y autoridades que emitan concepto técnico según materia.";
    instrument = "Proyecto de ley, control político, audiencia o mandato en PND si procede.";
  } else if (values.actor === "executive") {
    sequence.push("Clasificar entre directiva, decreto, CONPES, PND, MIPG/FURAG, resolución o guía técnica según competencia y alcance.");
    badges.push("EJECUTIVO");
    actor = "Gobierno nacional, sector competente, DAFP, DNP u otra entidad según el caso.";
    instrument = "Directiva, decreto, CONPES, PND, guía técnica o archivo motivado.";
  } else if (values.actor === "territorial") {
    sequence.push("Adaptar a competencias territoriales: plan de desarrollo, acuerdo, decreto local, piloto o instrumento sectorial competente.");
    badges.push("TERRITORIO");
    actor = "Entidad territorial y sector competente.";
    instrument = "Plan territorial, acuerdo, decreto local, piloto o instrumento sectorial.";
  } else {
    sequence.push("Convertir el hallazgo en documento técnico, solicitud ciudadana, observatorio, audiencia, derecho de petición o incidencia ante la autoridad competente.");
    badges.push("INCIDENCIA");
    actor = "Ciudadanía, academia, organizaciones y autoridad destinataria competente.";
    instrument = "Documento técnico, derecho de petición, audiencia, matriz ciudadana u observatorio.";
  }

  sequence.push("Publicar decisión motivada, ejecutar, medir resultados verificables y evaluar para ajustar, escalar o archivar.");

  return {
    title,
    summary: "Ruta preliminar y condicionada: requiere competencia clara, evidencia suficiente y estudios aplicables.",
    diagnosis,
    tools: [...new Set(tools)].join(", "),
    actor,
    instrument,
    conditions: [...new Set(conditions)].join(", "),
    warnings: warnings.join(" "),
    next,
    sequence,
    badges: [...new Set(badges)]
  };
}

function initDecisionLab() {
  document.querySelectorAll("[data-decision-lab]").forEach((lab) => {
    const form = lab.querySelector("[data-decision-form]");
    const title = lab.querySelector("[data-decision-title]");
    const summary = lab.querySelector("[data-decision-summary]");
    const sequence = lab.querySelector("[data-decision-sequence]");
    const badges = lab.querySelector("[data-decision-badges]");
    const copy = lab.querySelector("[data-decision-copy]");
    const reset = lab.querySelector("[data-decision-reset]");
    const diagnosis = lab.querySelector("[data-decision-diagnosis]");
    const tools = lab.querySelector("[data-decision-tools]");
    const actor = lab.querySelector("[data-decision-actor]");
    const instrument = lab.querySelector("[data-decision-instrument]");
    const conditions = lab.querySelector("[data-decision-conditions]");
    const warnings = lab.querySelector("[data-decision-warnings]");
    const next = lab.querySelector("[data-decision-next]");
    if (!form || !title || !summary || !sequence || !badges || !copy) return;

    let currentText = "";
    const defaultState = {
      title: "Complete las preguntas para generar una ruta preliminar.",
      summary: "El resultado combinará revisión RAÍCES, análisis SAVIA, posible piloto SEMILLAS, expediente técnico e instrumento competente.",
      diagnosis: "Delimitación inicial del problema y revisión de formas existentes.",
      tools: "RAÍCES y SAVIA.",
      actor: "Debe definirse según competencia y alcance.",
      instrument: "Por clasificar mediante expediente.",
      conditions: "Evidencia, datos, fuente fiscal, soporte laboral y ruta jurídica.",
      warnings: "No constituye concepto jurídico ni decisión administrativa.",
      next: "Completar inventario y matriz de madurez.",
      sequence: ["Delimitar el problema público.", "Revisar qué existe.", "Evaluar madurez y viabilidad."],
      badges: []
    };

    const render = (result) => {
      title.textContent = result.title;
      summary.textContent = result.summary;
      sequence.innerHTML = result.sequence.map((item) => `<li>${item}</li>`).join("");
      badges.innerHTML = result.badges.map((item) => `<span>${item}</span>`).join("");
      if (diagnosis) diagnosis.textContent = result.diagnosis;
      if (tools) tools.textContent = result.tools;
      if (actor) actor.textContent = result.actor;
      if (instrument) instrument.textContent = result.instrument;
      if (conditions) conditions.textContent = result.conditions;
      if (warnings) warnings.textContent = result.warnings;
      if (next) next.textContent = result.next;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = buildDecisionRecommendation(Object.fromEntries(new FormData(form).entries()));
      render(result);
      currentText = [
        result.title,
        result.summary,
        `Diagnóstico recomendado: ${result.diagnosis}`,
        `Herramientas sugeridas: ${result.tools}`,
        `Actor competente: ${result.actor}`,
        `Instrumento posible: ${result.instrument}`,
        `Condiciones pendientes: ${result.conditions}`,
        `Advertencias: ${result.warnings}`,
        `Siguiente paso: ${result.next}`,
        "",
        ...result.sequence.map((item, index) => `${index + 1}. ${item}`)
      ].join("\n");
      copy.disabled = false;
      lab.querySelector(".decision-output")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    copy.addEventListener("click", async () => {
      if (!currentText) return;
      try {
        await navigator.clipboard.writeText(currentText);
        const original = copy.textContent;
        copy.textContent = "Resultado copiado";
        setTimeout(() => { copy.textContent = original; }, 1800);
      } catch {
        copy.textContent = "No se pudo copiar";
      }
    });

    reset?.addEventListener("click", () => {
      form.reset();
      currentText = "";
      copy.disabled = true;
      render(defaultState);
    });
  });
}

function initCamsSite() {
  initGlobalKeyboard();
  initSearchIndex();
  initMenu();
  initDocumentFilter();
  initAccessibleTabs();
  initProblemTree();
  initChecklist();
  initFloatingPanel();
  initReadingProgress();
  initCommandPalette();
  initSectionNavigator();
  initDecisionLab();
  initViewMode();
}

initCamsSite();
