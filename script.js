const data = [
  {
    id: "first_guts_sword",
    names: {
      en: "First Guts Sword; Pupper Slayer; Guts Child's Sword;",
      ru: "Первый меч Гатса;",
      jp: "ガッツの最初の剣 ; Gattsu no saisho no ken;"
    },
    base_item: "Any sword",
    icon: "images/firstswordguts.png images/firstswordgutsleft.png",
    reference: "images/ref1.jpg"
  },
  {
    id: "first_duel_with_griffith",
    names: {
      en: "First duel with Griffith; Duel with Bazuso; Sword of reconciliation; Rematch sword; Great sword of reconciliation; Rematch great sword;",
      ru: "Первая дуэль с Гриффитом; Дуэль с Базусо; Меч примирения;",
      jp: "和解の剣 ; Wakai no ken;"
    },
    base_item: "Any sword, any axe",
    icon: "images/1.png images/2.png",
    reference: ""
  }
];

// Получение текущего языка
function getCurrentLanguage() {
  return document.getElementById("language").value || "en";
}

// Отрисовка таблицы
function renderTable() {
  const tbody = document.querySelector("#items-table tbody");
  tbody.innerHTML = "";
  const lang = getCurrentLanguage();

  data.forEach(item => {
    const row = document.createElement("tr");

    // Иконки
    const iconCell = document.createElement("td");
    const icons = item.icon.split(" ");
    iconCell.className = "item-icons";
    icons.forEach((src, idx) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = item.id;
      img.title = idx === 0 ? "Main hand" : "Off hand";
      iconCell.appendChild(img);
    });
    row.appendChild(iconCell);

    // Названия
    const nameCell = document.createElement("td");
    nameCell.innerText = item.names[lang] || item.names.en;
    row.appendChild(nameCell);

    // Базовый предмет
    const baseItemCell = document.createElement("td");
    baseItemCell.innerText = item.base_item;
    row.appendChild(baseItemCell);

    // Референс
    const refCell = document.createElement("td");
    if (item.reference) {
      const img = document.createElement("img");
      img.src = item.reference;
      img.alt = "Reference";
      img.style.height = "40px";
      refCell.appendChild(img);
    } else {
      refCell.innerText = "-";
    }
    row.appendChild(refCell);

    tbody.appendChild(row);
  });
}

// Обработчики языка
document.getElementById("language").addEventListener("change", renderTable);

// Кнопка перевода и меню
const translateBtn = document.getElementById("translate-btn");
const languageMenu = document.getElementById("language-menu");

translateBtn.addEventListener("click", () => {
  languageMenu.classList.toggle("hidden");
});

languageMenu.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", e => {
    const lang = e.currentTarget.dataset.lang;
    document.getElementById("language").value = lang;
    document.getElementById("language").dispatchEvent(new Event("change"));
    languageMenu.classList.add("hidden");
  });
});

// Инициализация
renderTable();
