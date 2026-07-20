/** Filtered state-of-the-art explorer with a two-experience comparison matrix. */
import { fetchJson, makeElement, normalizeText } from "./utilities.js";

const COMPARISON_ROWS = [
  ["Fortaleza", "strength"],
  ["Riesgo", "risk"],
  ["Capacidad necesaria", "requiredCapacity"],
  ["Adaptación para Colombia", "adaptation"]
];

function makeDefinition(label, value) {
  const wrapper = makeElement("div");
  wrapper.append(makeElement("dt", { text: label }), makeElement("dd", { text: value }));
  return wrapper;
}

function createCard(record, selected, toggle) {
  const article = makeElement("article", { className: "card card--evidence art-card" });
  const heading = makeElement("div");
  heading.append(
    makeElement("p", { className: "eyebrow", text: (record.approaches || []).join(" · ") }),
    makeElement("h3", { text: record.experience })
  );
  const button = makeElement("button", {
    className: "button button--secondary",
    text: selected ? "Quitar de comparación" : "Comparar esta experiencia",
    attributes: {
      type: "button",
      "data-art-select": record.id,
      "aria-pressed": String(selected)
    }
  });
  button.addEventListener("click", () => toggle(record.id));
  const header = makeElement("header");
  header.append(heading, button);
  const details = makeElement("dl", { className: "meta-list" });
  details.append(
    makeDefinition("Aprendizaje", record.learning),
    makeDefinition("Riesgo", record.risk),
    makeDefinition("Qué no debe copiarse", record.notCopy),
    makeDefinition("Traducción a Estado que Cumple", record.translation),
    makeDefinition("Herramienta relacionada", record.tool)
  );
  article.append(header, details);
  return article;
}

function renderMatrix(host, records) {
  host.replaceChildren();
  if (records.length !== 2) {
    host.append(makeElement("p", { text: "La matriz aparecerá cuando seleccione exactamente dos experiencias." }));
    return;
  }
  const tableRegion = makeElement("div", {
    className: "comparison-table-region",
    attributes: { role: "region", tabindex: "0", "aria-label": "Matriz comparativa de dos experiencias" }
  });
  const table = makeElement("table", { className: "data-table comparison-table" });
  const caption = makeElement("caption", { text: `Comparación: ${records[0].experience} y ${records[1].experience}` });
  const head = makeElement("thead");
  const headRow = makeElement("tr");
  headRow.append(
    makeElement("th", { text: "Criterio", attributes: { scope: "col" } }),
    makeElement("th", { text: records[0].experience, attributes: { scope: "col" } }),
    makeElement("th", { text: records[1].experience, attributes: { scope: "col" } })
  );
  head.append(headRow);
  const body = makeElement("tbody");
  COMPARISON_ROWS.forEach(([label, key]) => {
    const row = makeElement("tr");
    row.append(
      makeElement("th", { text: label, attributes: { scope: "row" } }),
      makeElement("td", { text: records[0].comparison?.[key] || "Por documentar" }),
      makeElement("td", { text: records[1].comparison?.[key] || "Por documentar" })
    );
    body.append(row);
  });
  table.append(caption, head, body);
  tableRegion.append(table);

  const cards = makeElement("div", { className: "comparison-cards" });
  records.forEach((record, index) => {
    const article = makeElement("article", { className: "comparison-experience" });
    article.append(
      makeElement("p", { className: "eyebrow", text: `Experiencia ${index === 0 ? "A" : "B"}` }),
      makeElement("h4", { text: record.experience })
    );
    const definitions = makeElement("dl", { className: "meta-list" });
    COMPARISON_ROWS.forEach(([label, key]) => {
      definitions.append(makeDefinition(label, record.comparison?.[key] || "Por documentar"));
    });
    article.append(definitions);
    cards.append(article);
  });
  const synthesis = makeElement("article", { className: "comparison-synthesis" });
  synthesis.append(
    makeElement("p", { className: "eyebrow", text: "Síntesis" }),
    makeElement("h4", { text: "Adaptar capacidades, no copiar formas" }),
    makeElement("p", { text: "Contraste las fortalezas y riesgos de ambas experiencias con las competencias, capacidades territoriales y controles que Colombia puede sostener." })
  );
  const adaptations = makeElement("ul");
  records.forEach((record) => adaptations.append(
    makeElement("li", { text: `${record.experience}: ${record.comparison?.adaptation || "adaptación por documentar"}` })
  ));
  synthesis.append(adaptations);
  cards.append(synthesis);
  host.append(tableRegion, cards);
}

export async function initStateOfArt() {
  const data = await fetchJson("/assets/data/state-of-art.json");
  const records = data.records || [];
  if (!records.length) return;
  const byId = new Map(records.map((record) => [record.id, record]));

  document.querySelectorAll("[data-state-of-art]").forEach((root) => {
    const approachFilter = root.querySelector("[data-art-approach]");
    const experienceFilter = root.querySelector("[data-art-experience]");
    const results = root.querySelector("[data-art-results]");
    const compareStatus = root.querySelector("[data-art-compare]");
    const matrix = root.querySelector("[data-art-matrix]");
    if (!results || !matrix) return;
    const selected = new Set();

    const updateStatus = (notice = "") => {
      if (!compareStatus) return;
      compareStatus.textContent = notice || (selected.size === 2
        ? "Comparación lista. Revise la matriz."
        : `Seleccione ${2 - selected.size} experiencia${selected.size === 1 ? "" : "s"} más para comparar.`);
      compareStatus.setAttribute("aria-live", "polite");
    };

    const render = () => {
      const approach = normalizeText(approachFilter?.value || "all");
      const experience = normalizeText(experienceFilter?.value || "all");
      const filtered = records.filter((record) => {
        const approachMatches = approach === "all" || (record.approaches || []).some((item) => normalizeText(item) === approach);
        const experienceMatches = experience === "all" || normalizeText(record.experience) === experience;
        return approachMatches && experienceMatches;
      });
      const fragment = document.createDocumentFragment();
      filtered.forEach((record) => fragment.append(createCard(record, selected.has(record.id), toggle)));
      if (!filtered.length) fragment.append(makeElement("p", { text: "No hay fichas que coincidan con ambos filtros." }));
      results.replaceChildren(fragment);
      renderMatrix(matrix, [...selected].map((id) => byId.get(id)).filter(Boolean));
    };

    const toggle = (id) => {
      if (selected.has(id)) selected.delete(id);
      else if (selected.size < 2) selected.add(id);
      else {
        updateStatus("Ya seleccionó dos experiencias. Quite una antes de elegir otra.");
        return;
      }
      updateStatus();
      render();
      requestAnimationFrame(() => {
        [...results.querySelectorAll("[data-art-select]")]
          .find((button) => button.dataset.artSelect === id)?.focus();
      });
    };

    approachFilter?.addEventListener("change", render);
    experienceFilter?.addEventListener("change", render);
    updateStatus();
    render();
  });
}
