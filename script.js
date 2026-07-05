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

function bindPanelSwitcher(rootSelector, triggerSelector, panelSelector, triggerKey, panelKey) {
  document.querySelectorAll(rootSelector).forEach((root) => {
    const triggers = [...root.querySelectorAll(triggerSelector)];
    const panels = [...root.querySelectorAll(panelSelector)];
    if (!triggers.length || !panels.length) return;

    const activate = (key) => {
      triggers.forEach((trigger) => {
        const active = trigger.dataset[triggerKey] === key;
        trigger.classList.toggle("is-active", active);
        trigger.setAttribute("aria-selected", String(active));
      });

      panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset[panelKey] === key);
      });
    };

    const initial =
      triggers.find((trigger) => trigger.classList.contains("is-active"))?.dataset[triggerKey] ||
      triggers[0].dataset[triggerKey];

    activate(initial);

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => activate(trigger.dataset[triggerKey]));
    });
  });
}

bindPanelSwitcher("[data-core-tabs]", "[data-core-tab]", "[data-core-panel]", "coreTab", "corePanel");
bindPanelSwitcher("[data-system-map]", "[data-system-node]", "[data-system-panel]", "systemNode", "systemPanel");
bindPanelSwitcher("[data-route-tabs]", "[data-route-tab]", "[data-route-panel]", "routeTab", "routePanel");
bindPanelSwitcher("[data-knowledge-tabs]", "[data-knowledge-tab]", "[data-knowledge-panel]", "knowledgeTab", "knowledgePanel");
bindPanelSwitcher("[data-stepper]", "[data-step-tab]", "[data-step-panel]", "stepTab", "stepPanel");

document.querySelectorAll("[data-problem-tree]").forEach((tree) => {
  const nodes = [...tree.querySelectorAll("[data-problem-title]")];
  const title = tree.querySelector("[data-problem-detail-title]");
  const text = tree.querySelector("[data-problem-detail-text]");
  if (!nodes.length || !title || !text) return;

  const activate = (node) => {
    nodes.forEach((item) => item.classList.toggle("is-active", item === node));
    title.textContent = node.dataset.problemTitle || node.textContent.trim();
    text.textContent = node.dataset.problemText || "";
  };

  nodes.forEach((node) => {
    node.addEventListener("click", () => activate(node));
  });

  activate(nodes.find((node) => node.classList.contains("is-active")) || nodes[0]);
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
