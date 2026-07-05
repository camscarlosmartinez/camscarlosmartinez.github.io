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
