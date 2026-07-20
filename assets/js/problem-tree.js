/** Filterable, local-only diagnostic route builder for the problem tree. */
import {
  buttonFeedback,
  copyText,
  fetchJson,
  makeElement,
  normalizeText,
  safeStorageGet,
  safeStorageSet,
  scrollToElement,
  setText
} from "./utilities.js";

const STORAGE_KEY = "cams:problemSelection";
const MAX_SELECTION = 5;
const TREE_LEVELS = [
  ["efecto", "Efectos"],
  ["problema", "Problema central"],
  ["causa", "Causas"]
];

const TIER_CLASSES = {
  efecto: "problem-tier--efecto",
  problema: "problem-tier--problema",
  causa: "problem-tier--causa"
};

const DIMENSION_LABELS = {
  normativa: ["normativa", "normativas"],
  fiscal: ["fiscal", "fiscales"],
  laboral: ["laboral", "laborales"],
  tecnologica: ["tecnológica", "tecnológicas"],
  territorial: ["territorial", "territoriales"],
  documental: ["documental", "documentales"],
  politica: ["política", "políticas"],
  evaluacion: ["de evaluación", "de evaluación"],
  coordinacion: ["de coordinación", "de coordinación"]
};

const LEVEL_LABELS = {
  causa: ["causa", "causas"],
  problema: ["problema", "problemas"],
  efecto: ["efecto", "efectos"]
};

function readSelection(validIds) {
  try {
    const parsed = JSON.parse(safeStorageGet(STORAGE_KEY, "[]"));
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => validIds.has(id)).slice(0, MAX_SELECTION));
  } catch {
    return new Set();
  }
}

function fillSelect(select, values, labelFor = (value) => value) {
  if (!select || select.options.length > 1) return;
  values.forEach((value) => {
    select.append(makeElement("option", { text: labelFor(value), attributes: { value } }));
  });
}

function ensureDetailFields(panel) {
  if (panel.querySelector("[data-problem-detail-title]")) return;
  const title = makeElement("h3", { attributes: { "data-problem-detail-title": "" } });
  const list = makeElement("dl", { className: "problem-detail-list" });
  const fields = [
    ["Tipo", "type"],
    ["Dimensión", "dimension"],
    ["Explicación", "explanation"],
    ["Evidencia o síntoma", "evidence"],
    ["Pregunta diagnóstica", "question"],
    ["Herramienta relacionada", "tool"],
    ["Posible respuesta institucional", "response"]
  ];
  fields.forEach(([label, key]) => {
    const wrapper = makeElement("div");
    wrapper.append(
      makeElement("dt", { text: label }),
      makeElement("dd", { attributes: { [`data-problem-detail-${key}`]: "" } })
    );
    list.append(wrapper);
  });
  panel.replaceChildren(title, list);
}

function describeSelection(selected, nodeById) {
  if (!selected.size) return "Su recorrido está vacío. Seleccione hasta cinco nodos.";
  const groups = new Map();
  selected.forEach((id) => {
    const node = nodeById.get(id);
    if (!node) return;
    const key = `${node.level}|${node.dimension}`;
    groups.set(key, (groups.get(key) || 0) + 1);
  });
  const clauses = [...groups.entries()].map(([key, count]) => {
    const [level, dimension] = key.split("|");
    const levelLabel = LEVEL_LABELS[level]?.[count === 1 ? 0 : 1] || level;
    const dimensionLabel = DIMENSION_LABELS[dimension]?.[count === 1 ? 0 : 1] || dimension;
    return `${count} ${levelLabel} ${dimensionLabel}`;
  });
  return `Su recorrido contiene: ${clauses.join(", ")}.`;
}

function createNodeButton(node) {
  return makeElement("button", {
    className: `problem-node problem-node--${node.level}`,
    text: node.title,
    attributes: {
      type: "button",
      "data-problem-node": node.id,
      "data-dimension": node.dimension,
      "data-level": node.level,
      "data-tool": node.tool,
      "aria-pressed": "false"
    }
  });
}

export async function initProblemTree() {
  const data = await fetchJson("/assets/data/problem-tree.json");
  const nodes = data.nodes || [];
  if (!nodes.length) return;
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  document.querySelectorAll("[data-problem-tree]").forEach((root) => {
    const nodeHost = root.querySelector("[data-problem-nodes]");
    const detail = root.querySelector("[data-problem-detail]");
    const summary = root.querySelector("[data-problem-summary]");
    const dimensionFilter = root.querySelector("[data-problem-dimension]");
    const levelFilter = root.querySelector("[data-problem-level]");
    const toolFilter = root.querySelector("[data-problem-tool]");
    const buildButton = root.querySelector("[data-problem-build]");
    const clearButton = root.querySelector("[data-problem-clear]");
    const copyButton = root.querySelector("[data-problem-copy]");
    if (!nodeHost || !detail || !summary) return;

    ensureDetailFields(detail);
    fillSelect(dimensionFilter, [...new Set(nodes.map((node) => node.dimension))], (value) => DIMENSION_LABELS[value]?.[0] || value);
    fillSelect(levelFilter, [...new Set(nodes.map((node) => node.level))], (value) => LEVEL_LABELS[value]?.[0] || value);
    fillSelect(toolFilter, [...new Set(nodes.map((node) => node.tool))]);

    const selected = readSelection(new Set(nodeById.keys()));
    const fragment = document.createDocumentFragment();
    const tierByLevel = new Map();
    const connectors = [];
    TREE_LEVELS.forEach(([level, label], index) => {
      const tier = makeElement("section", { className: `problem-tier ${TIER_CLASSES[level] || ""}`.trim() });
      const headingId = `problem-tier-${level}`;
      const heading = makeElement("h3", {
        className: "problem-tier__label",
        text: label,
        attributes: { id: headingId }
      });
      const nodeList = makeElement("div", {
        className: "problem-tier__nodes",
        attributes: { role: "group", "aria-labelledby": headingId }
      });
      nodes.filter((node) => node.level === level).forEach((node) => nodeList.append(createNodeButton(node)));
      tier.append(heading, nodeList);
      tierByLevel.set(level, tier);
      fragment.append(tier);
      if (index < TREE_LEVELS.length - 1) {
        const connector = makeElement("div", {
          className: "problem-tree-connector",
          text: "↑",
          attributes: {
            "aria-hidden": "true",
            "data-tree-from": level,
            "data-tree-to": TREE_LEVELS[index + 1][0]
          }
        });
        connectors.push(connector);
        fragment.append(connector);
      }
    });
    nodeHost.replaceChildren(fragment);
    const buttons = [...nodeHost.querySelectorAll("[data-problem-node]")];

    const renderSummary = (notice = "") => {
      summary.textContent = notice || describeSelection(selected, nodeById);
      summary.setAttribute("aria-live", "polite");
      if (copyButton) {
        copyButton.disabled = selected.size === 0;
        copyButton.classList.toggle("button--disabled", copyButton.disabled);
      }
      if (clearButton) {
        clearButton.disabled = selected.size === 0;
        clearButton.classList.toggle("button--disabled", clearButton.disabled);
      }
    };

    const showDetail = (node) => {
      setText(detail, "[data-problem-detail-title]", node.title);
      const dimensionLabel = DIMENSION_LABELS[node.dimension]?.[0] || node.dimension;
      setText(detail, "[data-problem-detail-type]", `${node.type} · ${dimensionLabel}`);
      setText(detail, "[data-problem-detail-explanation]", node.explanation);
      setText(detail, "[data-problem-detail-evidence]", node.evidence);
      setText(detail, "[data-problem-detail-question]", node.question);
      setText(detail, "[data-problem-detail-tool]", node.tool);
      setText(detail, "[data-problem-detail-response]", node.response);
      detail.dataset.activeProblem = node.id;
    };

    const syncButtons = () => {
      buttons.forEach((button) => {
        const active = selected.has(button.dataset.problemNode);
        button.classList.toggle("is-selected", active);
        button.setAttribute("aria-pressed", String(active));
      });
      safeStorageSet(STORAGE_KEY, JSON.stringify([...selected]));
      renderSummary();
    };

    const toggle = (button) => {
      const id = button.dataset.problemNode;
      const node = nodeById.get(id);
      if (!node) return;
      showDetail(node);
      if (selected.has(id)) selected.delete(id);
      else if (selected.size < MAX_SELECTION) selected.add(id);
      else {
        renderSummary(`Puede seleccionar máximo ${MAX_SELECTION} nodos. Quite uno antes de añadir otro.`);
        return;
      }
      syncButtons();
    };

    const applyFilters = () => {
      const dimension = normalizeText(dimensionFilter?.value || "all");
      const level = normalizeText(levelFilter?.value || "all");
      const tool = normalizeText(toolFilter?.value || "all");
      buttons.forEach((button) => {
        const node = nodeById.get(button.dataset.problemNode);
        const visible = (!dimension || dimension === "all" || normalizeText(node.dimension) === dimension)
          && (!level || level === "all" || normalizeText(node.level) === level)
          && (!tool || tool === "all" || normalizeText(node.tool) === tool);
        button.hidden = !visible;
      });
      tierByLevel.forEach((tier) => {
        tier.hidden = ![...tier.querySelectorAll("[data-problem-node]")].some((button) => !button.hidden);
      });
      connectors.forEach((connector) => {
        connector.hidden = tierByLevel.get(connector.dataset.treeFrom)?.hidden
          || tierByLevel.get(connector.dataset.treeTo)?.hidden;
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => toggle(button));
      button.addEventListener("focus", () => {
        const node = nodeById.get(button.dataset.problemNode);
        if (node) showDetail(node);
      });
    });
    [dimensionFilter, levelFilter, toolFilter].forEach((control) => control?.addEventListener("change", applyFilters));

    buildButton?.addEventListener("click", () => {
      renderSummary();
      scrollToElement(summary, "center");
    });
    clearButton?.addEventListener("click", () => {
      selected.clear();
      syncButtons();
      buttonFeedback(clearButton, "Selección limpiada");
    });
    copyButton?.addEventListener("click", async () => {
      const copied = await copyText(describeSelection(selected, nodeById));
      buttonFeedback(copyButton, copied ? "Resumen copiado" : "No se pudo copiar");
    });

    syncButtons();
    applyFilters();
    showDetail(nodeById.get([...selected][0]) || nodes.find((node) => node.level === "problema") || nodes[0]);
  });
}
