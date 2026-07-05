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
    const text = (item.dataset.text + " " + item.innerText).toLowerCase();
    const okText = !q || text.includes(q);
    const okType = type === "all" || item.dataset.type === type;
    item.classList.toggle("is-hidden", !(okText && okType));
  });
}
search?.addEventListener("input", applyDocFilter);
filter?.addEventListener("change", applyDocFilter);

document.querySelectorAll(".civic-core").forEach((core) => {
  const button = core.querySelector(".civic-core-button");
  const components = core.querySelector(".core-components");
  if (!button || !components) return;

  button.addEventListener("click", () => {
    const open = !components.classList.contains("is-open");
    components.classList.toggle("is-open", open);
    components.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  });
});

const floatingButton = document.querySelector(".floating-ring");
const floatingPanel = document.querySelector("#floatingPanel");
const floatingClose = document.querySelector(".floating-close");

function setFloatingPanel(open) {
  if (!floatingButton || !floatingPanel) return;
  floatingPanel.hidden = !open;
  floatingPanel.classList.toggle("is-open", open);
  floatingButton.setAttribute("aria-expanded", String(open));
  if (open) {
    floatingPanel.querySelector("a,button")?.focus();
  } else {
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
