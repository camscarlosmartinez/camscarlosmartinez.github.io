/** Share/copy actions that never claim success until the browser confirms it. */
import { buttonFeedback, copyText } from "./utilities.js";

export function initParticipation() {
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
