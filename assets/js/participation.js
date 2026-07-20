/** Compact participation access plus share/copy actions; no data is submitted. */
import { buttonFeedback, copyText, makeElement } from "./utilities.js";

function createFloatingParticipation() {
  if (document.querySelector("[data-floating-participation]")) return;

  const host = makeElement("aside", {
    className: "floating-participation",
    attributes: { "data-floating-participation": "", "aria-label": "Acceso rápido a participación" }
  });
  const panelId = "floating-participation-panel";
  const toggle = makeElement("button", {
    className: "button button--ring floating-participation__toggle",
    text: "Participar",
    attributes: {
      type: "button",
      "aria-expanded": "false",
      "aria-controls": panelId,
      "aria-label": "Abrir opciones de participación"
    }
  });
  const panel = makeElement("div", {
    className: "floating-participation__panel panel panel--paper",
    attributes: { id: panelId, hidden: "", role: "region", "aria-labelledby": `${panelId}-title` }
  });
  const head = makeElement("div", { className: "floating-participation__head" });
  head.append(
    makeElement("h2", { text: "Participar en CAMS", attributes: { id: `${panelId}-title` } }),
    makeElement("button", {
      className: "button button--icon",
      text: "×",
      attributes: { type: "button", "aria-label": "Cerrar opciones de participación", "data-floating-close": "" }
    })
  );
  const navigation = makeElement("nav", { attributes: { "aria-label": "Opciones de participación" } });
  [
    ["Comentar", "/participar/#comentarios"],
    ["Colaborar", "/participar/#colaboracion"],
    ["Suscribirse", "/participar/#suscripcion"],
    ["Compartir", "/participar/#compartir"]
  ].forEach(([label, href]) => navigation.append(makeElement("a", {
    className: "button button--secondary",
    text: label,
    attributes: { href }
  })));
  panel.append(
    head,
    makeElement("p", { text: "Elija una vía. La información personal no se solicita desde este panel." }),
    navigation
  );
  host.append(panel, toggle);
  const footer = document.querySelector("footer");
  if (footer) footer.before(host);
  else document.body.append(host);

  const closeButton = panel.querySelector("[data-floating-close]");
  const setOpen = (open, restoreFocus = false) => {
    panel.hidden = !open;
    host.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar opciones de participación" : "Abrir opciones de participación");
    if (open) requestAnimationFrame(() => closeButton?.focus());
    if (!open && restoreFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true", true));
  closeButton?.addEventListener("click", () => setOpen(false, true));
  panel.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
  });
  document.addEventListener("pointerdown", (event) => {
    if (toggle.getAttribute("aria-expanded") === "true" && !host.contains(event.target)) setOpen(false);
  });

  if (footer && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => host.classList.toggle("is-near-footer", entry.isIntersecting));
    observer.observe(footer);
  }
}

export function initParticipation() {
  createFloatingParticipation();
  document.querySelectorAll("[data-copy-link]").forEach((button) => {
    button.addEventListener("click", async () => {
      const copied = await copyText(window.location.href);
      const feedback = button.closest(".share-actions")?.querySelector("[data-copy-feedback]");
      if (feedback) feedback.textContent = copied ? "Enlace copiado." : "No se pudo copiar automáticamente.";
      buttonFeedback(button, copied ? "Enlace copiado" : "Copie la dirección del navegador");
    });
  });

  document.querySelectorAll("[data-share-site]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({ title: document.title, text: document.querySelector("meta[name='description']")?.content || "CAMS", url: window.location.href });
          buttonFeedback(button, "Compartido");
        } catch (error) {
          if (error?.name !== "AbortError") buttonFeedback(button, "No se pudo compartir");
        }
        return;
      }
      const copied = await copyText(window.location.href);
      buttonFeedback(button, copied ? "Enlace copiado" : "Use la dirección del navegador");
    });
  });
}
