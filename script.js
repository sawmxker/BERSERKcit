const dataUrl = "data.json";
const tableBody = document.querySelector("#items-table tbody");
const translateBtn = document.getElementById("translate-btn");
const languageMenu = document.getElementById("language-menu");
const themeToggle = document.getElementById("theme-toggle");
let currentLang = "en";

fetch(dataUrl)
  .then(res => res.json())
  .then(data => renderTable(data));

function renderTable(items) {
  tableBody.innerHTML = "";
  items.forEach(item => {
    const tr = document.createElement("tr");

    const iconTd = document.createElement("td");
    iconTd.classList.add("item-icons");
    const icons = item.icon.split(" ");
    icons.forEach((icon, i) => {
      const img = document.createElement("img");
      img.src = icon;
      img.alt = i === 0 ? "Main hand" : "Off hand";
      iconTd.appendChild(img);
    });

    const nameTd = document.createElement("td");
    nameTd.textContent = item.names[currentLang] || "";

    const baseTd = document.createElement("td");
    baseTd.textContent = item.base_item;

    const refTd = document.createElement("td");
    if (item.reference) {
      const img = document.createElement("img");
      img.src = item.reference;
      img.alt = "Reference";
      img.style.height = "40px";
      refTd.appendChild(img);
    }

    tr.append(iconTd, nameTd, baseTd, refTd);
    tableBody.appendChild(tr);
  });
}

translateBtn.addEventListener("click", () => {
  languageMenu.classList.toggle("hidden");
  translateBtn.classList.toggle("active");
});

document.querySelectorAll(".language-menu button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    fetch(dataUrl)
      .then(res => res.json())
      .then(data => renderTable(data));
    languageMenu.classList.add("hidden");
    translateBtn.classList.remove("active");
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const icon = themeToggle.querySelector("img");
  icon.src = document.body.classList.contains("dark-mode")
    ? "images/webIconsLogosButtons/light.png"
    : "images/webIconsLogosButtons/dark.png";
});
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 3);
});

