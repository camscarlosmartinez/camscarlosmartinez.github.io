/** Prioritizes, but never hides, content for three Estado que Cumple audiences. */
import { safeStorageGet, safeStorageSet, splitTokens } from "./utilities.js";

const MODES = {
  citizen: "ciudadano",
  technical: "técnico",
  legal: "jurídico-institucional"
};

const ALIASES = {
  ciudadano: "citizen",
  tecnica: "technical",
  tecnico: "technical",
  técnico: "technical",
  juridico: "legal",
  jurídico: "legal",
  "juridico-institucional": "legal"
};

function validMode(value) {
  const candidate = ALIASES[value] || value;
  return Object.hasOwn(MODES, candidate) ? candidate : "citizen";
}

export function initViewModes() {
  document.querySelectorAll("[data-view-modes]").forEach((root) => {
    const buttons = [...root.querySelectorAll("[data-view-mode]")];
    const status = root.querySelector("[data-view-status]") || document.querySelector("[data-view-status]");
    const scope = root.closest("main") || document;
    const sections = [...scope.querySelectorAll("[data-mode-priority]")];
    if (!buttons.length) return;

    const apply = (requestedMode, focus = false) => {
      const mode = validMode(requestedMode);
      root.dataset.activeMode = mode;
      buttons.forEach((button) => {
        const active = validMode(button.dataset.viewMode) === mode;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
        button.tabIndex = active ? 0 : -1;
        if (active && focus) button.focus();
      });
      sections.forEach((section) => {
        const priority = splitTokens(section.dataset.modePriority).map(validMode).includes(mode);
        section.classList.toggle("is-priority", priority);
        section.setAttribute("data-mode-active", String(priority));
      });
      if (status) {
        status.textContent = `Está viendo: modo ${MODES[mode]}. Todo el contenido continúa disponible.`;
        status.setAttribute("aria-live", "polite");
      }
      safeStorageSet("cams:eqcViewMode", mode);
    };

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => apply(button.dataset.viewMode));
      button.addEventListener("keydown", (event) => {
        let nextIndex = index;
        if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % buttons.length;
        if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (index - 1 + buttons.length) % buttons.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = buttons.length - 1;
        if (nextIndex !== index) {
          event.preventDefault();
          apply(buttons[nextIndex].dataset.viewMode, true);
        }
      });
    });

    apply(validMode(safeStorageGet("cams:eqcViewMode", "citizen")));
  });
}
