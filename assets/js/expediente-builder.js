/** Fourteen-dimension, browser-local pedagogical expediente builder. */
import {
  buttonFeedback,
  copyText,
  debounce,
  makeElement,
  safeStorageGet,
  safeStorageRemove,
  safeStorageSet,
  scrollToElement
} from "./utilities.js";

const STORAGE_KEY = "cams:expedienteBuilder:v1";

const DIMENSIONS = [
  { id: "problema", title: "Problema", explanation: "Delimita la brecha pública sin anticipar una forma institucional.", question: "¿Qué ocurre, a quién afecta y qué capacidad explica la brecha?" },
  { id: "alternativas", title: "Alternativas", explanation: "Compara fortalecer, integrar, trasladar, cerrar, pilotear o crear.", question: "¿Qué opciones se descartaron y con qué criterio?" },
  { id: "evidencia", title: "Evidencia", explanation: "Distingue datos, síntomas, hipótesis y vacíos de información.", question: "¿Qué evidencia verificable sostiene el diagnóstico y qué falta?" },
  { id: "fiscal", title: "Impacto fiscal", explanation: "Hace visibles costo, fuente, sostenibilidad y contingencias.", question: "¿Cuánto cuesta implementar y sostener la alternativa?" },
  { id: "empleo", title: "Empleo público", explanation: "Revisa funciones, perfiles, cargas, planta y contratación recurrente.", question: "¿Qué capacidad humana permanente exige la decisión?" },
  { id: "territorio", title: "Territorio", explanation: "Contrasta el diseño con capacidades y competencias subnacionales.", question: "¿Qué cambia entre territorios y cómo se evita imponer una capacidad ficticia?" },
  { id: "datos", title: "Datos", explanation: "Define fuentes, calidad, interoperabilidad, custodia y uso decisorio.", question: "¿Qué datos permiten operar, corregir y evaluar?" },
  { id: "archivo", title: "Archivo", explanation: "Preserva soportes, decisiones, versiones y memoria institucional.", question: "¿Qué debe conservarse, durante cuánto tiempo y bajo qué responsable?" },
  { id: "participacion", title: "Participación", explanation: "Identifica actores afectados y cómo se responderán sus aportes.", question: "¿Quién debe intervenir y cómo quedará trazabilidad de la respuesta?" },
  { id: "captura", title: "Captura y corrupción", explanation: "Anticipa conflictos de interés, opacidad y beneficios concentrados.", question: "¿Quién podría capturar la decisión y qué controles lo reducen?" },
  { id: "juridica", title: "Ruta jurídica", explanation: "Clasifica competencia, reserva de ley y posibles instrumentos.", question: "¿Qué autoridad puede decidir y qué concepto especializado falta?" },
  { id: "implementacion", title: "Implementación", explanation: "Ordena responsables, fases, recursos, hitos y dependencias.", question: "¿Quién hace qué, con qué recursos y en qué plazo?" },
  { id: "indicadores", title: "Indicadores", explanation: "Conecta línea base, proceso, resultado y aprendizaje.", question: "¿Qué señal permitiría corregir antes de que la falla se vuelva permanente?" },
  { id: "evaluacion", title: "Evaluación", explanation: "Define cuándo ajustar, escalar, absorber, cerrar o archivar.", question: "¿Qué decisión posterior se tomará según los resultados?" }
];

const STATES = [
  ["no-revisado", "No revisado"],
  ["incompleto", "Incompleto"],
  ["preparado", "Preparado"]
];

function readState() {
  try {
    const parsed = JSON.parse(safeStorageGet(STORAGE_KEY, "{}"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function createItem(dimension, saved, persist) {
  const articleId = `expediente-dimension-${dimension.id}`;
  const headingId = `${articleId}-titulo`;
  const article = makeElement("article", {
    className: "card card--interactive expediente-item",
    attributes: {
      id: articleId,
      tabindex: "-1",
      "aria-labelledby": headingId,
      "data-expediente-dimension": dimension.id
    }
  });
  const heading = makeElement("h3", { text: dimension.title, attributes: { id: headingId } });
  const explanation = makeElement("p", { text: dimension.explanation });
  const question = makeElement("p");
  question.append(makeElement("strong", { text: "Pregunta: " }), document.createTextNode(dimension.question));

  const stateId = `expediente-${dimension.id}-estado`;
  const stateLabel = makeElement("label", { text: "Estado", attributes: { for: stateId } });
  const select = makeElement("select", {
    attributes: { id: stateId, "data-expediente-state": dimension.id }
  });
  STATES.forEach(([value, label]) => select.append(makeElement("option", { text: label, attributes: { value } })));
  select.value = STATES.some(([value]) => value === saved?.state) ? saved.state : "no-revisado";

  const notesId = `expediente-${dimension.id}-notas`;
  const notesLabel = makeElement("label", { text: "Notas locales opcionales", attributes: { for: notesId } });
  const notes = makeElement("textarea", {
    attributes: {
      id: notesId,
      rows: "3",
      "data-expediente-notes": dimension.id,
      placeholder: "No incluya información sensible."
    }
  });
  notes.value = String(saved?.notes || "");
  select.addEventListener("change", persist);
  notes.addEventListener("input", debounce(persist));
  article.append(heading, explanation, question, stateLabel, select, notesLabel, notes);
  return article;
}

function collectState(root) {
  return Object.fromEntries(DIMENSIONS.map((dimension) => {
    const state = root.querySelector(`[data-expediente-state="${dimension.id}"]`)?.value || "no-revisado";
    const notes = root.querySelector(`[data-expediente-notes="${dimension.id}"]`)?.value.trim() || "";
    return [dimension.id, { state, notes }];
  }));
}

function summaryText(state) {
  const lines = [
    "EXPEDIENTE TÉCNICO PEDAGÓGICO — RESUMEN LOCAL",
    "No constituye expediente oficial ni concepto jurídico.",
    ""
  ];
  DIMENSIONS.forEach((dimension, index) => {
    const item = state[dimension.id] || { state: "no-revisado", notes: "" };
    const stateLabel = STATES.find(([value]) => value === item.state)?.[1] || "No revisado";
    lines.push(`${index + 1}. ${dimension.title} — ${stateLabel}`);
    lines.push(`Pregunta: ${dimension.question}`);
    if (item.notes) lines.push(`Notas: ${item.notes}`);
    lines.push("");
  });
  return lines.join("\n").trim();
}

export function initExpedienteBuilder() {
  document.querySelectorAll("[data-expediente-builder]").forEach((root) => {
    const host = root.querySelector("[data-expediente-items]");
    const indexList = root.querySelector("[data-expediente-index-list]");
    const indexSelect = root.querySelector("[data-expediente-index-select]");
    const progress = root.querySelector("[data-expediente-progress]");
    const progressBar = root.querySelector("[data-expediente-progress-bar]");
    const progressMeter = progressBar?.closest("[role='progressbar']");
    const exportButton = root.querySelector("[data-expediente-export]");
    const copyButton = root.querySelector("[data-expediente-copy]");
    const resetButton = root.querySelector("[data-expediente-reset]");
    if (!host || !progress) return;
    let state = readState();

    const focusDimension = (dimensionId) => {
      const item = root.querySelector(`#expediente-dimension-${dimensionId}`);
      if (!item) return;
      scrollToElement(item, "start");
      window.setTimeout(() => item.focus({ preventScroll: true }), 240);
    };

    const setCurrentDimension = (dimensionId) => {
      indexList?.querySelectorAll("a").forEach((link) => {
        const current = link.dataset.expedienteIndexLink === dimensionId;
        if (current) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
      if (indexSelect && indexSelect.value !== dimensionId) indexSelect.value = dimensionId;
    };

    const renderIndex = () => {
      if (indexSelect) {
        const options = DIMENSIONS.map((dimension, index) => makeElement("option", {
          text: `${String(index + 1).padStart(2, "0")} · ${dimension.title}`,
          attributes: { value: dimension.id }
        }));
        indexSelect.replaceChildren(...options);
        indexSelect.addEventListener("change", () => focusDimension(indexSelect.value));
      }
      if (indexList) {
        const entries = DIMENSIONS.map((dimension, index) => {
          const item = makeElement("li");
          const link = makeElement("a", {
            attributes: {
              href: `#expediente-dimension-${dimension.id}`,
              "data-expediente-index-link": dimension.id
            }
          });
          link.append(
            makeElement("span", { className: "expediente-index__number", text: String(index + 1).padStart(2, "0") }),
            makeElement("span", { className: "expediente-index__title", text: dimension.title }),
            makeElement("span", {
              className: "expediente-index__state",
              text: "No revisado",
              attributes: { "data-expediente-index-state": dimension.id }
            })
          );
          link.addEventListener("click", (event) => {
            event.preventDefault();
            setCurrentDimension(dimension.id);
            focusDimension(dimension.id);
          });
          item.append(link);
          return item;
        });
        indexList.replaceChildren(...entries);
      }
      setCurrentDimension(DIMENSIONS[0].id);
    };

    const updateProgress = () => {
      state = collectState(root);
      const reviewed = Object.values(state).filter((item) => item.state !== "no-revisado").length;
      progress.textContent = `${reviewed} de ${DIMENSIONS.length} dimensiones revisadas.`;
      progress.setAttribute("aria-live", "polite");
      if (progressBar) {
        const ratio = reviewed / DIMENSIONS.length;
        progressBar.style.width = `${Math.round(ratio * 100)}%`;
      }
      if (progressMeter) {
        progressMeter.setAttribute("aria-valuenow", String(reviewed));
        progressMeter.setAttribute("aria-valuetext", `${reviewed} de ${DIMENSIONS.length} dimensiones revisadas`);
      }
      DIMENSIONS.forEach((dimension) => {
        const value = state[dimension.id]?.state || "no-revisado";
        const label = STATES.find(([candidate]) => candidate === value)?.[1] || "No revisado";
        const indexState = indexList?.querySelector(`[data-expediente-index-state="${dimension.id}"]`);
        const indexLink = indexState?.closest("a");
        if (indexState) indexState.textContent = label;
        if (indexLink) indexLink.dataset.state = value;
      });
      safeStorageSet(STORAGE_KEY, JSON.stringify(state));
    };

    const render = () => {
      const fragment = document.createDocumentFragment();
      DIMENSIONS.forEach((dimension) => fragment.append(createItem(dimension, state[dimension.id], updateProgress)));
      host.replaceChildren(fragment);
      updateProgress();
    };

    exportButton?.addEventListener("click", () => {
      updateProgress();
      const blob = new Blob([summaryText(state)], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = makeElement("a", { attributes: { href: url, download: "expediente-tecnico-cams.txt" } });
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      buttonFeedback(exportButton, "Resumen exportado");
    });
    copyButton?.addEventListener("click", async () => {
      updateProgress();
      const copied = await copyText(summaryText(state));
      buttonFeedback(copyButton, copied ? "Resumen copiado" : "No se pudo copiar");
    });
    resetButton?.addEventListener("click", () => {
      safeStorageRemove(STORAGE_KEY);
      state = {};
      root.querySelectorAll("[data-expediente-state]").forEach((select) => {
        select.value = "no-revisado";
      });
      root.querySelectorAll("[data-expediente-notes]").forEach((notes) => {
        notes.value = "";
      });
      updateProgress();
      setCurrentDimension(DIMENSIONS[0].id);
      buttonFeedback(resetButton, "Expediente reiniciado");
    });

    renderIndex();
    render();

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const dimensionId = visible?.target.dataset.expedienteDimension;
        if (dimensionId) setCurrentDimension(dimensionId);
      }, { rootMargin: "-18% 0px -62%", threshold: [0.15, 0.5, 0.8] });
      host.querySelectorAll("[data-expediente-dimension]").forEach((item) => observer.observe(item));
    }
  });
}
