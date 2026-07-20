/** Interactive radial/linear model for the Estado que Cumple proposal core. */
import { fetchJson, setText } from "./utilities.js";

function asSentence(value) {
  return Array.isArray(value) ? value.join(", ") : String(value || "");
}

function bindKeyboard(buttons, activate) {
  buttons.forEach((button, index) => {
    button.addEventListener("keydown", (event) => {
      let next = index;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % buttons.length;
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      if (next !== index) {
        event.preventDefault();
        buttons[next].focus();
        activate(buttons[next]);
      }
    });
  });
}

export async function initProposalCore() {
  const data = await fetchJson("/assets/data/proposal-architecture.json");
  const nodes = data.nodes || [];
  if (!nodes.length) return;

  document.querySelectorAll("[data-proposal-core]").forEach((root) => {
    const buttons = [...root.querySelectorAll("[data-core-node]")];
    const detail = root.querySelector("[data-core-detail]");
    if (!buttons.length || !detail) return;

    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const activate = (button) => {
      const selected = nodeById.get(button.dataset.coreNode);
      if (!selected) return;
      const related = new Set(selected.related || []);
      buttons.forEach((item) => {
        const active = item === button;
        const connected = related.has(item.dataset.coreNode);
        item.classList.toggle("is-active", active);
        item.classList.toggle("is-related", connected);
        item.setAttribute("aria-pressed", String(active));
        item.tabIndex = active ? 0 : -1;
      });
      setText(detail, "[data-core-label]", selected.orbit === "primary" ? "Primera órbita" : "Segunda órbita");
      setText(detail, "[data-core-title]", selected.title);
      setText(detail, "[data-core-description]", selected.description);
      setText(detail, "[data-core-input]", asSentence(selected.enters));
      setText(detail, "[data-core-output]", asSentence(selected.produces));
      setText(detail, "[data-core-connect]", asSentence(selected.connects));
      detail.dataset.activeNode = selected.id;
    };

    buttons.forEach((button) => button.addEventListener("click", () => activate(button)));
    bindKeyboard(buttons, activate);
    activate(buttons.find((button) => button.classList.contains("is-active")) || buttons[0]);
  });
}
