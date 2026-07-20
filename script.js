/**
 * CAMS site entry point.
 *
 * Only navigation and search are loaded on every page. Page-specific tools are
 * imported when their HTML hook is present, so one failed enhancement cannot
 * prevent the rest of the site from working.
 */
import { initMenu } from "./assets/js/menu.js";
import { initCommandPalette } from "./assets/js/command-palette.js";

document.documentElement.classList.add("js");

async function runEnhancement(name, initializer) {
  try {
    await initializer();
  } catch (error) {
    console.error(`[CAMS] No se pudo iniciar ${name}.`, error);
  }
}

function whenPresent(selector, name, loader, exportName) {
  if (!document.querySelector(selector)) return Promise.resolve();
  return runEnhancement(name, async () => {
    const module = await loader();
    const initializer = module[exportName];
    if (typeof initializer === "function") await initializer();
  });
}

async function initSite() {
  await Promise.all([
    runEnhancement("la navegación", initMenu),
    runEnhancement("el buscador", initCommandPalette)
  ]);

  await Promise.all([
    whenPresent(
      "[data-visitor-selector], [data-ecosystem-map]",
      "la portada interactiva",
      () => import("./assets/js/home-experience.js"),
      "initHomeExperience"
    ),
    whenPresent(
      "[data-view-modes]",
      "los modos de lectura",
      () => import("./assets/js/view-modes.js"),
      "initViewModes"
    ),
    whenPresent(
      "[data-problem-tree]",
      "el árbol del problema",
      () => import("./assets/js/problem-tree.js"),
      "initProblemTree"
    ),
    whenPresent(
      "[data-proposal-core]",
      "el núcleo de la propuesta",
      () => import("./assets/js/proposal-core.js"),
      "initProposalCore"
    ),
    whenPresent(
      "[data-institutional-map]",
      "el mapa institucional",
      () => import("./assets/js/institutional-map.js"),
      "initInstitutionalMap"
    ),
    whenPresent(
      "[data-state-of-art]",
      "el estado del arte",
      () => import("./assets/js/state-of-art.js"),
      "initStateOfArt"
    ),
    whenPresent(
      "[data-decision-lab]",
      "el laboratorio de decisión",
      () => import("./assets/js/decision-lab.js"),
      "initDecisionLab"
    ),
    whenPresent(
      "[data-expediente-builder]",
      "el constructor de expediente",
      () => import("./assets/js/expediente-builder.js"),
      "initExpedienteBuilder"
    ),
    whenPresent(
      "[data-document-library]",
      "la biblioteca documental",
      () => import("./assets/js/document-library.js"),
      "initDocumentLibrary"
    ),
    whenPresent(
      "[data-share-site], [data-copy-link]",
      "las acciones de participación",
      () => import("./assets/js/participation.js"),
      "initParticipation"
    ),
    whenPresent(
      "[data-reveal], [data-reading-progress], [data-context-index]",
      "las microinteracciones",
      () => import("./assets/js/interactions.js"),
      "initInteractions"
    )
  ]);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite, { once: true });
} else {
  initSite();
}
