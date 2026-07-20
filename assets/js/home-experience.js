/** Visitor routes and the non-navigating CAMS ecosystem map on the home page. */
import { safeStorageGet, safeStorageSet, setText } from "./utilities.js";

const VISITORS = {
  citizen: {
    title: "Ciudadanía",
    explore: "Comprenda el problema público y siga cómo una decisión debería dejar evidencia y resultados verificables.",
    tool: "Árbol del problema",
    route: "Comprender → seleccionar síntomas → abrir RAÍCES.",
    href: "/estado-que-cumple/#arbol-problema"
  },
  "public-servant": {
    title: "Servidor público",
    explore: "Revise duplicidades, restricciones operativas y condiciones para fortalecer capacidad existente.",
    tool: "Núcleo RAÍCES, SAVIA y SEMILLAS",
    route: "Revisar lo existente → madurez → expediente.",
    href: "/estado-que-cumple/#nucleo-metodologico"
  },
  researcher: {
    title: "Investigador/a",
    explore: "Compare enfoques, examine supuestos y conecte aprendizajes con herramientas institucionales.",
    tool: "Explorador del estado del arte",
    route: "Comparar experiencias → revisar riesgos → consultar documentos.",
    href: "/estado-que-cumple/#estado-arte"
  },
  "social-organization": {
    title: "Organización social",
    explore: "Convierta observaciones ciudadanas en preguntas trazables, evidencia y rutas de incidencia.",
    tool: "Recorrido diagnóstico",
    route: "Identificar efectos → construir resumen → participar.",
    href: "/participar/"
  },
  "territorial-government": {
    title: "Gobierno territorial",
    explore: "Adapte la arquitectura a competencias, capacidades y brechas de implementación territoriales.",
    tool: "Laboratorio de ruta normativa",
    route: "Definir alcance territorial → verificar capacidad → valorar piloto.",
    href: "/estado-que-cumple/#simulador"
  },
  congress: {
    title: "Congreso",
    explore: "Distinga reserva de ley, soporte técnico y condiciones de implementación antes de legislar.",
    tool: "Ruta jurídico-institucional",
    route: "Competencia → expediente → instrumento → seguimiento.",
    href: "/estado-que-cumple/#marco-institucional"
  },
  "government-team": {
    title: "Equipo de gobierno",
    explore: "Ordene alternativas, riesgos fiscales, empleo, datos y secuencia de implementación.",
    tool: "Constructor de expediente",
    route: "Diagnóstico → alternativas → decisión competente → evaluación.",
    href: "/estado-que-cumple/#expediente"
  }
};

const VISITOR_ALIASES = {
  ciudadania: "citizen",
  ciudadanía: "citizen",
  ciudadano: "citizen",
  "servidor-publico": "public-servant",
  servidor: "public-servant",
  investigador: "researcher",
  investigadora: "researcher",
  organizacion: "social-organization",
  "organizacion-social": "social-organization",
  "civil-society": "social-organization",
  territorial: "territorial-government",
  congreso: "congress",
  gobierno: "government-team",
  government: "government-team",
  "equipo-gobierno": "government-team"
};

const ECOSYSTEM = {
  eqc: { title: "Estado que Cumple", function: "Propuesta integral", status: "Propuesta abierta", description: "Explica, prueba y conecta la arquitectura de capacidad pública.", href: "/estado-que-cumple/" },
  documents: { title: "Documentos", function: "Biblioteca documental", status: "Activa", description: "Reúne versiones, metadatos, descargas y formas de citación.", href: "/documentos/" },
  observatory: { title: "Observatorio", function: "Seguimiento y visualización", status: "En construcción", description: "Define fuentes, líneas de observación e indicadores sin simular datos inexistentes.", href: "/observatorio/" },
  log: { title: "Bitácora", function: "Publicación editorial", status: "En preparación", description: "Ordena notas, categorías, fechas y estados de publicación.", href: "/bitacora/" },
  participation: { title: "Participación", function: "Colaboración pública", status: "Canales parciales", description: "Distingue lo disponible de comentarios, suscripción y voluntariado aún por conectar.", href: "/participar/" },
  archive: { title: "Archivo público", function: "Preservación y trazabilidad", status: "Activo", description: "Conecta repositorios, redes confirmadas, versiones y memoria pública.", href: "/archivo/" },
  cams: { title: "CAMS", function: "Autoría y criterios", status: "Independiente", description: "Explica quién produce el archivo, sus líneas de trabajo y su relación con la propuesta.", href: "/cams/" }
};

const ECOSYSTEM_ALIASES = {
  "estado-que-cumple": "eqc",
  propuesta: "eqc",
  proposal: "eqc",
  documentos: "documents",
  observatorio: "observatory",
  bitacora: "log",
  bitácora: "log",
  participar: "participation",
  participacion: "participation",
  archivo: "archive"
};

function canonical(value, aliases, catalogue) {
  const key = String(value || "").trim();
  const mapped = aliases[key] || key;
  return catalogue[mapped] ? mapped : Object.keys(catalogue)[0];
}

function bindArrowKeys(buttons, activate) {
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

function initVisitorSelector(root) {
  const buttons = [...root.querySelectorAll("[data-visitor-option]")];
  if (!buttons.length) return;

  const apply = (button) => {
    const key = canonical(button.dataset.visitorOption, VISITOR_ALIASES, VISITORS);
    const profile = VISITORS[key];
    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    setText(root, "[data-visitor-title]", profile.title);
    setText(root, "[data-visitor-explore]", profile.explore);
    setText(root, "[data-visitor-tool]", profile.tool);
    setText(root, "[data-visitor-route]", profile.route);
    const link = root.querySelector("[data-visitor-link]");
    if (link) link.href = profile.href;
    safeStorageSet("cams:visitorProfile", key);
  };

  buttons.forEach((button) => button.addEventListener("click", () => apply(button)));
  bindArrowKeys(buttons, apply);
  const stored = canonical(safeStorageGet("cams:visitorProfile"), VISITOR_ALIASES, VISITORS);
  apply(buttons.find((button) => canonical(button.dataset.visitorOption, VISITOR_ALIASES, VISITORS) === stored) || buttons[0]);
}

function initEcosystemMap(root) {
  const buttons = [...root.querySelectorAll("[data-ecosystem-node]")];
  if (!buttons.length) return;

  const apply = (button) => {
    const key = canonical(button.dataset.ecosystemNode, ECOSYSTEM_ALIASES, ECOSYSTEM);
    const node = ECOSYSTEM[key];
    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    setText(root, "[data-ecosystem-title]", node.title);
    setText(root, "[data-ecosystem-function]", node.function);
    setText(root, "[data-ecosystem-status]", node.status);
    setText(root, "[data-ecosystem-description]", node.description);
    const link = root.querySelector("[data-ecosystem-link]");
    if (link) link.href = node.href;
  };

  buttons.forEach((button) => button.addEventListener("click", () => apply(button)));
  bindArrowKeys(buttons, apply);
  apply(buttons.find((button) => button.classList.contains("is-active")) || buttons[0]);
}

export function initHomeExperience() {
  document.querySelectorAll("[data-visitor-selector]").forEach(initVisitorSelector);
  document.querySelectorAll("[data-ecosystem-map]").forEach(initEcosystemMap);
}
