/** Shared, side-effect-free helpers for CAMS interactive components. */

const jsonCache = new Map();

export function normalizeText(value) {
  return String(value ?? "")
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function safeStorageGet(key, fallback = null) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

export function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeStorageRemove(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage can be disabled; the component remains usable for this session.
  }
}

export async function fetchJson(url) {
  if (!jsonCache.has(url)) {
    jsonCache.set(url, fetch(url, { credentials: "same-origin" }).then((response) => {
      if (!response.ok) throw new Error(`${response.status} al cargar ${url}`);
      return response.json();
    }));
  }
  return jsonCache.get(url);
}

export function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function scrollToElement(element, block = "start") {
  element?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block
  });
}

export async function copyText(value) {
  const text = String(value ?? "");
  if (!text) return false;

  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Continue with the local fallback.
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.readOnly = true;
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  field.remove();
  return copied;
}

export function buttonFeedback(button, message, duration = 1800) {
  if (!button) return;
  const original = button.dataset.originalLabel || button.textContent;
  button.dataset.originalLabel = original;
  button.textContent = message;
  window.setTimeout(() => {
    button.textContent = original;
  }, duration);
}

export function ensureId(element, prefix) {
  if (element.id) return element.id;
  const random = Math.random().toString(36).slice(2, 9);
  element.id = `${prefix}-${random}`;
  return element.id;
}

export function setText(root, selector, value) {
  const element = root?.querySelector(selector);
  if (element) element.textContent = String(value ?? "");
  return element;
}

export function splitTokens(value) {
  return String(value ?? "")
    .split(/[\s,|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function debounce(callback, wait = 180) {
  let timer = 0;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), wait);
  };
}

export function makeElement(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = String(options.text);
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([name, value]) => {
      if (value !== null && value !== undefined) element.setAttribute(name, String(value));
    });
  }
  return element;
}
