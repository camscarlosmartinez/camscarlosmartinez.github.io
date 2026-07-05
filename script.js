const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const search = document.querySelector("#docSearch");
const filter = document.querySelector("#docFilter");
const docs = [...document.querySelectorAll(".doc-item")];

function applyDocFilter() {
  const q = (search?.value || "").toLowerCase().trim();
  const type = filter?.value || "all";
  docs.forEach((item) => {
    const text = (item.dataset.text + " " + item.innerText).toLowerCase();
    const okText = !q || text.includes(q);
    const okType = type === "all" || item.dataset.type === type;
    item.classList.toggle("is-hidden", !(okText && okType));
  });
}
search?.addEventListener("input", applyDocFilter);
filter?.addEventListener("change", applyDocFilter);
