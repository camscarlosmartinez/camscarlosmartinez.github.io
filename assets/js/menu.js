/** Accessible desktop Explore panel and conventional mobile navigation. */
import { ensureId } from "./utilities.js";

export function initMenu() {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const siteNav = document.querySelector("[data-site-nav]");
  const exploreToggle = document.querySelector("[data-explore-toggle]");
  const explorePanel = document.querySelector("[data-explore-panel]");
  if (!menuToggle && !exploreToggle) return;

  const setMenu = (open, restoreFocus = false) => {
    if (!menuToggle || !siteNav) return;
    siteNav.classList.toggle("is-open", open);
    siteNav.toggleAttribute("data-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    if (!open) setExplore(false);
    if (!open && restoreFocus) menuToggle.focus();
  };

  const setExplore = (open, restoreFocus = false) => {
    if (!exploreToggle || !explorePanel) return;
    explorePanel.hidden = !open;
    explorePanel.classList.toggle("is-open", open);
    exploreToggle.setAttribute("aria-expanded", String(open));
    if (open) explorePanel.querySelector("a, button")?.focus();
    if (!open && restoreFocus) exploreToggle.focus();
  };

  if (menuToggle && siteNav) {
    menuToggle.setAttribute("aria-controls", ensureId(siteNav, "site-nav"));
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });
    siteNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
  }

  if (exploreToggle && explorePanel) {
    exploreToggle.setAttribute("aria-controls", ensureId(explorePanel, "explore-panel"));
    exploreToggle.setAttribute("aria-expanded", "false");
    explorePanel.hidden = true;
    exploreToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setExplore(exploreToggle.getAttribute("aria-expanded") !== "true");
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (exploreToggle?.getAttribute("aria-expanded") === "true") {
      setExplore(false, true);
      return;
    }
    if (menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false, true);
    }
  });

  document.addEventListener("click", (event) => {
    if (
      exploreToggle?.getAttribute("aria-expanded") === "true" &&
      !explorePanel?.contains(event.target) &&
      !exploreToggle.contains(event.target)
    ) {
      setExplore(false);
    }
  });
}
