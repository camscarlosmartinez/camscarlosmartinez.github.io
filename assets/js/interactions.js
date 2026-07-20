/** Small progressive interactions: reveals, reading progress and active index. */
import { makeElement, prefersReducedMotion } from "./utilities.js";

function initReveals() {
  const elements = [...new Set(document.querySelectorAll("main > section, [data-reveal]"))];
  if (!elements.length) return;
  elements.forEach((element) => element.setAttribute("data-reveal", ""));
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
  elements.forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
      element.classList.add("is-visible");
    } else {
      observer.observe(element);
    }
  });
  document.documentElement.classList.add("reveal-ready");
}

function initReadingProgress() {
  let roots = [...document.querySelectorAll("[data-reading-progress]")];
  if (!roots.length) {
    const root = makeElement("div", {
      className: "reading-progress",
      attributes: { "data-reading-progress": "", "aria-hidden": "true" }
    });
    root.append(makeElement("span"));
    document.body.prepend(root);
    roots = [root];
  }
  roots.forEach((root) => {
    const fill = root.querySelector("span") || root;
    const update = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 0;
      fill.style.transform = `scaleX(${ratio})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
  });
}

function initContextIndex() {
  document.querySelectorAll(".proposal-index").forEach((nav) => nav.setAttribute("data-context-index", ""));
  document.querySelectorAll("[data-context-index]").forEach((nav) => {
    const links = [...nav.querySelectorAll("a[href^='#']")];
    if (!links.length || !("IntersectionObserver" in window)) return;
    const targets = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      links.forEach((link) => {
        const current = link.getAttribute("href") === `#${active.target.id}`;
        link.classList.toggle("is-active", current);
        if (current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-25% 0px -65%", threshold: [0.01, 0.25] });
    targets.forEach((target) => observer.observe(target));
  });
}

export function initInteractions() {
  initReveals();
  initReadingProgress();
  initContextIndex();
}
