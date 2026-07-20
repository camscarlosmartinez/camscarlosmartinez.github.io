/** JSON-backed filtering for the accessible HTML document catalogue. */
import { copyText, fetchJson, normalizeText } from "./utilities.js";

function fallbackRecord(item) {
  return {
    id: item.dataset.documentId || "",
    title: item.dataset.documentTitle || item.querySelector("h3")?.textContent || "",
    type: item.dataset.documentType || "",
    status: item.dataset.documentStatus || "",
    summary: item.textContent || "",
    keywords: (item.dataset.documentKeywords || "").split(/\s+/)
  };
}

function bindCitationButtons(root) {
  root.querySelectorAll("[data-copy-text]").forEach((button) => {
    button.addEventListener("click", async () => {
      const copied = await copyText(button.dataset.copyText);
      const container = button.closest(".citation-block") || button.parentElement;
      let feedback = container?.querySelector(".copy-feedback");
      if (!feedback && container) {
        feedback = document.createElement("span");
        feedback.className = "copy-feedback";
        feedback.setAttribute("aria-live", "polite");
        container.append(feedback);
      }
      if (feedback) {
        feedback.textContent = copied ? "Citación copiada." : "No se pudo copiar.";
        window.setTimeout(() => { feedback.textContent = ""; }, 2200);
      }
    });
  });
}

export async function initDocumentLibrary() {
  const data = await fetchJson("/assets/data/documents.json");
  const records = data.documents || [];
  const byId = new Map(records.map((record) => [record.id, record]));

  document.querySelectorAll("[data-document-library]").forEach((root) => {
    const search = root.querySelector("[data-document-search]");
    const type = root.querySelector("[data-document-type]");
    const status = root.querySelector("[data-document-status]");
    const reset = root.querySelector("[data-document-reset]");
    const results = root.querySelector("[data-document-results]");
    const count = root.querySelector("[data-document-count]");
    const empty = root.querySelector("[data-document-empty]");
    if (!results) return;

    const catalogue = [...results.querySelectorAll("[data-document-item]")].map((item) => ({
      item,
      record: byId.get(item.dataset.documentId) || fallbackRecord(item)
    }));

    const render = () => {
      const query = normalizeText(search?.value);
      const selectedType = type?.value || "all";
      const selectedStatus = status?.value || "all";
      let visible = 0;

      catalogue.forEach(({ item, record }) => {
        const haystack = normalizeText(`${record.title} ${record.summary} ${record.type} ${(record.keywords || []).join(" ")}`);
        const matches = (!query || haystack.includes(query))
          && (selectedType === "all" || record.type === selectedType)
          && (selectedStatus === "all" || record.status === selectedStatus);
        item.hidden = !matches;
        if (matches) visible += 1;
      });

      if (count) count.textContent = `${visible} registro${visible === 1 ? "" : "s"} en la biblioteca.`;
      if (empty) empty.hidden = visible !== 0;
    };

    search?.addEventListener("input", render);
    type?.addEventListener("change", render);
    status?.addEventListener("change", render);
    reset?.closest("form")?.addEventListener("reset", () => requestAnimationFrame(render));
    bindCitationButtons(root);
    render();
  });
}
