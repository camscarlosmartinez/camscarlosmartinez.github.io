/** Pedagogical normative-route simulator. It never returns a legal opinion. */
import { buttonFeedback, copyText, fetchJson, makeElement } from "./utilities.js";

const FIELD_NAMES = [
  "activator",
  "transformation",
  "structure",
  "legalReserve",
  "fiscal",
  "employment",
  "pilot",
  "scope",
  "authority",
  "data"
];

const DISCLAIMER = "Resultado pedagógico, no constituye concepto jurídico.";

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function listOrPending(items) {
  return unique(items).length ? unique(items) : ["Ninguna condición puede darse por cerrada sin revisar el expediente."];
}

function makeResult(values, catalogue) {
  const pending = [];
  const risks = [];
  const instruments = [];

  let route = "Ruta administrativa preliminar, sujeta a verificación de competencia.";
  if (values.legalReserve === "yes") route = "Ruta legislativa preliminar con soporte técnico previo.";
  else if (values.scope === "territorial") route = "Ruta territorial preliminar según competencia local.";
  else if (values.scope === "mixed") route = "Ruta multinivel de coordinación nacional y territorial.";
  else if (values.activator === "congress") route = "Ruta de incidencia y deliberación legislativa preliminar.";
  else if (values.activator === "civil") route = "Ruta ciudadana de evidencia e incidencia ante la autoridad competente.";

  if (values.legalReserve === "yes" || values.activator === "congress") instruments.push("proyecto de ley", "audiencia o control político");
  if (values.activator === "executive" && values.legalReserve !== "yes") instruments.push("directiva", "decreto", "CONPES", "PND o instrumento sectorial");
  if (values.scope === "territorial" || values.activator === "territorial") instruments.push("plan de desarrollo territorial", "acuerdo", "decreto local");
  if (values.activator === "civil") instruments.push("documento técnico", "derecho de petición", "audiencia pública", "observatorio");
  if (!instruments.length) instruments.push(...(catalogue.defaultInstruments || ["instrumento por clasificar mediante expediente"]));

  if (values.structure === "unknown") pending.push("definir si la transformación modifica estructura");
  if (values.legalReserve === "unknown") pending.push("verificar reserva de ley y competencia normativa");
  if (values.fiscal === "unknown") pending.push("estimar costo y fuente fiscal");
  if (values.fiscal === "yes") pending.push("documentar fuente, sostenibilidad e impacto fiscal");
  if (values.employment === "unknown") pending.push("revisar efectos sobre empleo público");
  if (values.employment === "yes") pending.push("preparar soporte laboral, perfiles y cargas");
  if (values.pilot === "unknown") pending.push("decidir si la incertidumbre justifica un piloto");
  if (values.authority !== "yes") pending.push("identificar autoridad y competencias aplicables");
  if (values.data !== "ready") pending.push("completar datos, línea base y estrategia de evaluación");

  if (values.structure === "yes") risks.push("crear estructura antes de probar necesidad y capacidad");
  if (values.fiscal !== "no") risks.push("comprometer gasto sin cierre fiscal suficiente");
  if (values.employment !== "no") risks.push("asignar funciones sin capacidad laboral sostenible");
  if (values.authority !== "yes") risks.push("duplicidad o conflicto de competencias");
  if (values.data !== "ready") risks.push("decidir sin línea base ni evaluación verificable");
  if (values.scope === "mixed") risks.push("descoordinación entre niveles de gobierno");

  const semillasSuggested = values.pilot === "yes"
    || values.pilot === "unknown"
    || values.data === "low"
    || (values.transformation === "create" && values.data !== "ready");
  const actor = catalogue.activators?.[values.activator]
    || "Autoridad competente, equipos técnicos y actores afectados.";
  const raices = values.transformation === "improve"
    ? "Requerido: inventariar funciones, restricciones y opciones de fortalecimiento."
    : "Requerido: comprobar qué existe y descartar duplicidades antes de decidir.";
  const savia = `Requerido: revisar soporte ${unique([
    "jurídico",
    values.fiscal !== "no" ? "fiscal" : "presupuestal",
    values.employment !== "no" ? "laboral" : "organizacional",
    values.scope !== "national" ? "territorial" : "nacional",
    "documental y de datos"
  ]).join(", ")}.`;
  const nextStep = pending.length
    ? `Resolver primero: ${pending[0]}.`
    : "Consolidar alternativas en el expediente y someter la decisión al actor competente.";

  return {
    route,
    raices,
    savia,
    semillas: semillasSuggested
      ? "Sugerido: probar con alcance, línea base, plazo y decisión posterior explícita."
      : "No aparece indispensable con estas respuestas, pero debe justificarse por qué se omite.",
    expediente: "Requerido: integrar evidencia, alternativas, impactos, participación, implementación e indicadores.",
    instruments: unique(instruments),
    actors: unique([actor, ...(catalogue.commonActors || [])]),
    pending: listOrPending(pending),
    risks: listOrPending(risks),
    nextStep,
    disclaimer: DISCLAIMER
  };
}

function appendList(container, title, items) {
  const heading = makeElement("h4", { text: title });
  const list = makeElement("ul");
  items.forEach((item) => list.append(makeElement("li", { text: item })));
  container.append(heading, list);
}

function renderResult(output, result) {
  const fragment = document.createDocumentFragment();
  fragment.append(
    makeElement("p", { className: "eyebrow", text: "Ruta preliminar" }),
    makeElement("h3", { text: result.route })
  );
  const details = makeElement("dl", { className: "decision-detail-list" });
  [["RAÍCES", result.raices], ["SAVIA", result.savia], ["SEMILLAS", result.semillas], ["Expediente", result.expediente], ["Siguiente paso", result.nextStep]].forEach(([label, value]) => {
    const wrapper = makeElement("div");
    wrapper.append(makeElement("dt", { text: label }), makeElement("dd", { text: value }));
    details.append(wrapper);
  });
  fragment.append(details);
  const groups = makeElement("div", { className: "decision-result-groups" });
  appendList(groups, "Posibles instrumentos", result.instruments);
  appendList(groups, "Actores competentes", result.actors);
  appendList(groups, "Condiciones pendientes", result.pending);
  appendList(groups, "Riesgos", result.risks);
  fragment.append(groups, makeElement("p", { className: "legal-disclaimer", text: DISCLAIMER }));
  output.replaceChildren(fragment);
}

function resultAsText(result) {
  return [
    result.route,
    `RAÍCES: ${result.raices}`,
    `SAVIA: ${result.savia}`,
    `SEMILLAS: ${result.semillas}`,
    `Expediente: ${result.expediente}`,
    `Posibles instrumentos: ${result.instruments.join("; ")}`,
    `Actores competentes: ${result.actors.join("; ")}`,
    `Condiciones pendientes: ${result.pending.join("; ")}`,
    `Riesgos: ${result.risks.join("; ")}`,
    `Siguiente paso: ${result.nextStep}`,
    DISCLAIMER
  ].join("\n");
}

function valuesFromForm(form) {
  const entries = Object.fromEntries(new FormData(form).entries());
  return Object.fromEntries(FIELD_NAMES.map((name) => [name, String(entries[name] || "unknown")]));
}

function urlForValues(values) {
  const url = new URL(window.location.href);
  FIELD_NAMES.forEach((name) => url.searchParams.set(name, values[name]));
  return url;
}

function loadUrlValues(form) {
  const params = new URLSearchParams(window.location.search);
  let found = false;
  FIELD_NAMES.forEach((name) => {
    const value = params.get(name);
    const control = form.elements.namedItem(name);
    if (value && control instanceof HTMLSelectElement && [...control.options].some((option) => option.value === value)) {
      control.value = value;
      found = true;
    }
  });
  return found;
}

export async function initDecisionLab() {
  const catalogue = await fetchJson("/assets/data/activation-routes.json");
  document.querySelectorAll("[data-decision-lab]").forEach((lab) => {
    const form = lab.querySelector("[data-decision-form]");
    const output = lab.querySelector("[data-decision-output]");
    const copyButton = lab.querySelector("[data-decision-copy]");
    const printButton = lab.querySelector("[data-decision-print]");
    const shareButton = lab.querySelector("[data-decision-share]");
    const resetButton = lab.querySelector("[data-decision-reset]");
    if (!form || !output) return;
    let currentResult = null;

    const enableActions = (enabled) => {
      [copyButton, printButton, shareButton].forEach((button) => {
        if (button) {
          button.disabled = !enabled;
          button.classList.toggle("button--disabled", !enabled);
        }
      });
    };

    const calculate = () => {
      const values = valuesFromForm(form);
      currentResult = makeResult(values, catalogue);
      renderResult(output, currentResult);
      enableActions(true);
      return values;
    };

    const showPendingCalculation = (message = "Complete las preguntas para organizar una ruta.") => {
      output.replaceChildren(
        makeElement("p", { className: "eyebrow", text: "Resultado" }),
        makeElement("h3", { text: message }),
        makeElement("p", { text: "La herramienta presentará condiciones y riesgos; no decidirá por la autoridad competente." }),
        makeElement("p", { className: "legal-disclaimer", text: DISCLAIMER })
      );
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      calculate();
    });
    form.addEventListener("change", () => {
      if (!currentResult) return;
      currentResult = null;
      enableActions(false);
      showPendingCalculation("Las respuestas cambiaron. Vuelva a calcular la ruta.");
    });
    copyButton?.addEventListener("click", async () => {
      const copied = currentResult && await copyText(resultAsText(currentResult));
      buttonFeedback(copyButton, copied ? "Resultado copiado" : "No se pudo copiar");
    });
    printButton?.addEventListener("click", () => window.print());
    shareButton?.addEventListener("click", async () => {
      const values = currentResult ? valuesFromForm(form) : calculate();
      const url = urlForValues(values);
      history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      const copied = await copyText(url.href);
      buttonFeedback(shareButton, copied ? "Enlace copiado" : "Enlace generado; copie la dirección del navegador");
    });
    resetButton?.addEventListener("click", () => {
      form.reset();
      currentResult = null;
      enableActions(false);
      const url = new URL(window.location.href);
      FIELD_NAMES.forEach((name) => url.searchParams.delete(name));
      history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      showPendingCalculation();
    });

    enableActions(false);
    if (loadUrlValues(form)) calculate();
  });
}
