document.documentElement.classList.add("js-ready");

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const search = document.querySelector("#docSearch");
const filter = document.querySelector("#docFilter");
const docs = [...document.querySelectorAll(".doc-item")];

function applyDocFilter() {
  const q = (search?.value || "").toLowerCase().trim();
  const type = filter?.value || "all";
  docs.forEach((item) => {
    const text = `${item.dataset.text || ""} ${item.innerText}`.toLowerCase();
    const okText = !q || text.includes(q);
    const okType = type === "all" || item.dataset.type === type;
    item.classList.toggle("is-hidden", !(okText && okType));
  });
}

search?.addEventListener("input", applyDocFilter);
filter?.addEventListener("change", applyDocFilter);

function normalizeId(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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

document.querySelectorAll("[data-problem-tree]").forEach((tree) => {
  const nodes = [...tree.querySelectorAll("[data-problem-title]")];
  const title = tree.querySelector("[data-problem-detail-title]");
  const text = tree.querySelector("[data-problem-detail-text]");
  if (!nodes.length || !title || !text) return;

  const activate = (node) => {
    nodes.forEach((item) => {
      const active = item === node;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    title.textContent = node.dataset.problemTitle || node.textContent.trim();
    text.textContent = node.dataset.problemText || "";
  };

  nodes.forEach((node) => {
    node.setAttribute("aria-pressed", "false");
    node.addEventListener("click", () => activate(node));
  });

  activate(nodes.find((node) => node.classList.contains("is-active")) || nodes[0]);
});

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

const floatingButton = document.querySelector(".floating-ring");
const floatingPanel = document.querySelector("#floatingPanel");
const floatingClose = document.querySelector(".floating-close");

function setFloatingPanel(open, restoreFocus = true) {
  if (!floatingButton || !floatingPanel) return;
  floatingPanel.hidden = !open;
  floatingPanel.classList.toggle("is-open", open);
  floatingButton.setAttribute("aria-expanded", String(open));
  if (open) {
    floatingPanel.querySelector("a,button")?.focus();
  } else if (restoreFocus) {
    floatingButton.focus();
  }
}

floatingButton?.addEventListener("click", () => {
  setFloatingPanel(floatingPanel?.hidden ?? true);
});

floatingClose?.addEventListener("click", () => setFloatingPanel(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && floatingPanel && !floatingPanel.hidden) {
    setFloatingPanel(false);
  }
});


// -----------------------------------------------------------------------------
// CAMS v4: progreso de lectura, buscador global, navegación contextual y simulador
// -----------------------------------------------------------------------------

function createReadingProgress() {
  const bar = document.createElement("div");
  bar.className = "reading-progress";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = "<span></span>";
  document.body.prepend(bar);
  const fill = bar.querySelector("span");

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    fill.style.transform = `scaleX(${ratio})`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

const COMMAND_ITEMS = [
  { title: "Inicio CAMS", group: "Sitio", url: "/", keywords: "inicio portada cams" },
  { title: "Estado que Cumple", group: "Propuesta", url: "/estado-que-cumple/", keywords: "propuesta capacidad estatal" },
  { title: "Árbol del problema técnico", group: "Propuesta", url: "/estado-que-cumple/#arbol-problema", keywords: "causas efectos estado de papel" },
  { title: "RAÍCES, SAVIA y SEMILLAS", group: "Propuesta", url: "/estado-que-cumple/#nucleo-metodologico", keywords: "herramientas madurez piloto" },
  { title: "Teoría de cambio", group: "Propuesta", url: "/estado-que-cumple/#teoria-cambio", keywords: "flujo resultados evaluación" },
  { title: "Estado del arte", group: "Investigación", url: "/estado-que-cumple/#estado-arte", keywords: "capacidad estatal aprendizaje comparado" },
  { title: "Arquitectura institucional", group: "Propuesta", url: "/estado-que-cumple/#arquitectura", keywords: "sistema comisión secretaría ventanilla" },
  { title: "Rutas de activación", group: "Propuesta", url: "/estado-que-cumple/#rutas-activacion", keywords: "ejecutivo legislativo sociedad territorio" },
  { title: "Laboratorio de decisión", group: "Herramienta", url: "/estado-que-cumple/#simulador", keywords: "simulador ruta decisión instrumento" },
  { title: "Expediente Técnico Integrado", group: "Propuesta", url: "/estado-que-cumple/#expediente", keywords: "diagnóstico fiscal laboral datos indicadores" },
  { title: "Riesgos y blindajes", group: "Propuesta", url: "/estado-que-cumple/#riesgos", keywords: "captura burocratización opacidad" },
  { title: "Indicadores y tablero público", group: "Propuesta", url: "/estado-que-cumple/#tablero", keywords: "seguimiento proceso resultado aprendizaje memoria" },
  { title: "Documentos", group: "Archivo", url: "/documentos/", keywords: "pdf documentos matrices" },
  { title: "Observatorio", group: "Archivo", url: "/observatorio/", keywords: "tableros seguimiento" },
  { title: "Bitácora", group: "Archivo", url: "/bitacora/", keywords: "notas análisis" },
  { title: "Participar", group: "Comunidad", url: "/participar/", keywords: "comentarios voluntariado suscripción" },
  { title: "Archivo público y redes", group: "Comunidad", url: "/archivo/", keywords: "github instagram linkedin facebook" },
  { title: "Abrir PDF Estado que Cumple", group: "Documento", url: "/assets/documentos/estado-que-cumple-2026-2030.pdf", keywords: "pdf documento completo" }
];

function createCommandPalette() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

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
      <p class="command-help">↑ ↓ para navegar · Enter para abrir · Esc para cerrar</p>
    </form>`;
  document.body.append(dialog);

  const input = dialog.querySelector("input");
  const results = dialog.querySelector(".command-results");
  let activeIndex = 0;
  let visibleItems = [...COMMAND_ITEMS];

  const render = () => {
    const query = input.value.trim().toLowerCase();
    visibleItems = COMMAND_ITEMS.filter((item) =>
      `${item.title} ${item.group} ${item.keywords}`.toLowerCase().includes(query)
    ).slice(0, 10);
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
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }
  });

  input.addEventListener("input", render);
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

function createSectionNavigator() {
  const proposalMain = document.querySelector(".proposal-hero-v2")?.closest("main");
  if (!proposalMain) return;

  const sections = [...proposalMain.querySelectorAll("section[id]")]
    .map((section) => ({
      id: section.id,
      label: section.querySelector(".overline")?.textContent?.trim() || section.querySelector("h2")?.textContent?.trim() || section.id
    }))
    .filter((item) => item.id && item.label)
    .slice(0, 16);
  if (sections.length < 3) return;

  const nav = document.createElement("nav");
  nav.className = "section-navigator";
  nav.setAttribute("aria-label", "Navegación de la propuesta");
  nav.innerHTML = `
    <button type="button" aria-expanded="false">Índice técnico <span>⌄</span></button>
    <div>${sections.map((item) => `<a href="#${item.id}" data-section-link="${item.id}">${item.label}</a>`).join("")}</div>`;
  document.body.append(nav);

  const toggle = nav.querySelector("button");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  const links = [...nav.querySelectorAll("a")];
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle("is-active", link.dataset.sectionLink === visible.target.id));
  }, { rootMargin: "-28% 0px -62% 0px", threshold: [0.01, 0.15, 0.35] });
  sections.forEach((item) => observer.observe(document.getElementById(item.id)));
}

function buildDecisionRecommendation(values) {
  const sequence = ["Delimitar el problema público y la finalidad constitucional."];
  const badges = ["RAÍCES"];
  let title = "Revisión institucional antes de decidir";
  const notes = [];

  if (values.existing === "yes") {
    sequence.push("Aplicar RAÍCES para comparar la función existente, duplicidades y alternativas de fortalecimiento, integración o traslado.");
    notes.push("Priorizar alternativas sobre creación orgánica nueva.");
  } else if (values.existing === "no") {
    sequence.push("Documentar por qué no existe una forma equivalente y comparar unidad interna, coordinación, piloto o nueva figura.");
  } else {
    sequence.push("Completar inventario RAÍCES antes de definir una solución.");
  }

  sequence.push("Aplicar SAVIA: finalidad, evidencia, financiación, talento, datos, territorio, archivo, riesgos y ruta jurídica.");
  badges.push("SAVIA");

  if (values.maturity === "low" || values.evidence === "low" || values.territory === "low" || values.urgency === "pilot") {
    sequence.push("Diseñar un piloto SEMILLAS con línea base, responsables, plazos, indicadores y decisión final de cierre, ajuste, absorción o escalamiento.");
    badges.push("SEMILLAS");
    title = "Madurar capacidad antes de volver permanente la solución";
  } else {
    sequence.push("Preparar directamente el Expediente Técnico Integrado, manteniendo evaluación posterior.");
  }

  sequence.push("Consolidar el Expediente Técnico Integrado con alternativas, impactos, participación, cronograma e indicadores.");
  badges.push("EXPEDIENTE");

  if (values.legal === "yes" || values.actor === "legislative") {
    sequence.push("Preclasificar reserva de ley y preparar proyecto de ley, debate legislativo y control político cuando corresponda.");
    badges.push("CONGRESO / LEY");
  } else if (values.actor === "executive") {
    sequence.push("Clasificar entre directiva, decreto, CONPES, PND, MIPG/FURAG, resolución o guía técnica según competencia y alcance.");
    badges.push("EJECUTIVO");
  } else if (values.actor === "territorial") {
    sequence.push("Adaptar a competencias territoriales: plan de desarrollo, acuerdo, decreto local, piloto o instrumento sectorial competente.");
    badges.push("TERRITORIO");
  } else {
    sequence.push("Convertir el hallazgo en documento técnico, solicitud ciudadana, observatorio, audiencia, derecho de petición o incidencia ante la autoridad competente.");
    badges.push("INCIDENCIA");
  }

  sequence.push("Publicar decisión motivada, ejecutar, medir resultados verificables y evaluar para ajustar, escalar o archivar.");
  notes.push("La ruta definitiva depende de competencia, reserva de ley y estudios técnicos aplicables.");

  return {
    title,
    summary: notes.join(" "),
    sequence,
    badges: [...new Set(badges)]
  };
}

function bindDecisionLab() {
  document.querySelectorAll("[data-decision-lab]").forEach((lab) => {
    const form = lab.querySelector("[data-decision-form]");
    const title = lab.querySelector("[data-decision-title]");
    const summary = lab.querySelector("[data-decision-summary]");
    const sequence = lab.querySelector("[data-decision-sequence]");
    const badges = lab.querySelector("[data-decision-badges]");
    const copy = lab.querySelector("[data-decision-copy]");
    if (!form || !title || !summary || !sequence || !badges || !copy) return;

    let currentText = "";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form).entries());
      const result = buildDecisionRecommendation(values);
      title.textContent = result.title;
      summary.textContent = result.summary;
      sequence.innerHTML = result.sequence.map((item) => `<li>${item}</li>`).join("");
      badges.innerHTML = result.badges.map((item) => `<span>${item}</span>`).join("");
      currentText = `${result.title}\n\n${result.sequence.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\nAdvertencia: herramienta pedagógica, no concepto jurídico.`;
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
  });
}

createReadingProgress();
createCommandPalette();
createSectionNavigator();
bindDecisionLab();
