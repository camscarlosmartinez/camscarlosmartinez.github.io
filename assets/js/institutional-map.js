/** Keyboard-operable institutional architecture map and explanatory panel. */
import { fetchJson, setText } from "./utilities.js";

export async function initInstitutionalMap() {
  const data = await fetchJson("/assets/data/proposal-architecture.json");
  const institutions = data.institutions || [];
  const byId = new Map(institutions.map((item) => [item.id, item]));

  document.querySelectorAll("[data-institutional-map]").forEach((root) => {
    const buttons = [...root.querySelectorAll("[data-institution-node]")];
    const detail = root.querySelector("[data-institution-detail]");
    if (!buttons.length || !detail) return;

    const activate = (button, focus = false) => {
      const record = byId.get(button.dataset.institutionNode);
      if (!record) return;
      const related = new Set(record.connections || []);
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.classList.toggle("is-related", related.has(item.dataset.institutionNode));
        item.setAttribute("aria-pressed", String(active));
        item.tabIndex = active ? 0 : -1;
        if (active && focus) item.focus();
      });
      const layer = button.closest(".institution-layer")?.querySelector("h3")?.textContent?.trim() || "Arquitectura institucional";
      setText(detail, "[data-institution-layer]", layer);
      setText(detail, "[data-institution-title]", record.title);
      setText(detail, "[data-institution-description]", record.function);
      setText(detail, "[data-institution-input]", record.input);
      setText(detail, "[data-institution-output]", record.output);
      detail.dataset.activeInstitution = record.id;
    };

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => activate(button));
      button.addEventListener("keydown", (event) => {
        let next = index;
        if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % buttons.length;
        if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = buttons.length - 1;
        if (next !== index) {
          event.preventDefault();
          activate(buttons[next], true);
        }
      });
    });
    activate(buttons.find((button) => button.classList.contains("is-active")) || buttons[0]);
  });
}
