document.addEventListener('DOMContentLoaded', () => {
  const dataUrl = "data.json";
  const tableBody = document.querySelector("#items-table tbody");
  const translateBtn = document.getElementById("translate-btn");
  const languageMenu = document.getElementById("language-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const langIcon = document.getElementById("lang-icon");
  const themeIcon = document.getElementById("theme-icon");
  const tableHeaders = document.querySelectorAll("#items-table th");
  let currentLang = localStorage.getItem('language') || "en";
  let darkMode = localStorage.getItem('darkMode') === 'true';

  // Переводы заголовков
  const headerTranslations = {
    en: ["Icon", "Display Name", "Base Item", "Reference"],
    ru: ["Иконка", "Название", "Базовый предмет", "Референс"],
    jp: ["アイコン", "表示名", "基本アイテム", "参照"]
  };

  // Иконки для языков
  const langIcons = {
    en: "images/flag-en.png",
    ru: "images/flag-ru.png",
    jp: "images/flag-jp.png"
  };

  // Иконки для темы
  const themeIcons = {
    light: "images/sun.png",
    dark: "images/moon.png"
  };

  // Модальное окно для изображений
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <span class="close" title="Close">&times;</span>
    <div class="modal-content">
      <img class="modal-img" src="" alt="Preview" />
    </div>
  `;
  document.body.appendChild(modal);

  // Функция показа модального окна с изображением
  function showModal(src) {
    const modalImg = modal.querySelector('.modal-img');
    modalImg.src = src;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
  }

  // Закрытие модального окна
  modal.querySelector('.close').addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
  });

  // Применение темы
  function applyTheme() {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      themeIcon.src = themeIcons.dark;
      themeIcon.alt = "Dark mode";
    } else {
      document.body.classList.remove('dark-mode');
      themeIcon.src = themeIcons.light;
      themeIcon.alt = "Light mode";
    }
  }

  // Обновление заголовков таблицы в зависимости от языка
  function updateTableHeaders() {
    const headers = headerTranslations[currentLang] || headerTranslations.en;
    tableHeaders.forEach((th, i) => {
      th.textContent = headers[i] || th.textContent;
    });
  }

  // Обновление иконки языка
  function updateLangIcon() {
    langIcon.src = langIcons[currentLang] || langIcons.en;
    langIcon.alt = currentLang.toUpperCase();
  }

  // Рендер таблицы
  function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(item => {
      const tr = document.createElement('tr');

      // Иконки
      const iconTd = document.createElement('td');
      iconTd.className = 'item-icons';
      if (item.icon) {
        item.icon.split(' ').forEach(iconPath => {
          if (iconPath.trim()) {
            const img = document.createElement('img');
            img.src = iconPath.trim();
            img.alt = "icon";
            img.addEventListener('click', () => showModal(iconPath.trim()));
            iconTd.appendChild(img);
          }
        });
      }
      tr.appendChild(iconTd);

      // Display Name
      const nameTd = document.createElement('td');
      if (item.names && item.names[currentLang]) {
        const names = item.names[currentLang].split(';').map(n => n.trim()).filter(Boolean);
        names.forEach((name, idx) => {
          const span = document.createElement('span');
          span.textContent = name;
          nameTd.appendChild(span);
          if (idx !== names.length - 1) nameTd.appendChild(document.createElement('br'));
        });
      } else {
        nameTd.textContent = "";
      }
      tr.appendChild(nameTd);

      // Base Item
      const baseTd = document.createElement('td');
      baseTd.textContent = item.base_item || "";
      tr.appendChild(baseTd);

      // Reference
      const refTd = document.createElement('td');
      if (item.reference) {
        const refImg = document.createElement('img');
        refImg.className = 'ref-image';
        refImg.src = item.reference;
        refImg.alt = "reference";
        refImg.addEventListener('click', () => showModal(item.reference));
        refTd.appendChild(refImg);
      }
      tr.appendChild(refTd);

      tableBody.appendChild(tr);
    });
  }

  // Переключение языка по кнопке
  translateBtn.addEventListener('click', () => {
    languageMenu.classList.toggle('hidden');
  });

  // Выбор языка из меню
  languageMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-lang]');
    if (!btn) return;
    currentLang = btn.dataset.lang;
    localStorage.setItem('language', currentLang);
    updateLangIcon();
    updateTableHeaders();
    if (window._berserkData) renderTable(window._berserkData);
    languageMenu.classList.add('hidden');
  });

  // Закрытие меню при клике вне
  document.addEventListener('click', (e) => {
    if (!languageMenu.contains(e.target) && e.target !== translateBtn) {
      languageMenu.classList.add('hidden');
    }
  });

  // Переключение темы
  themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    applyTheme();
  });

  // Загрузка данных из JSON
  fetch(dataUrl)
    .then(response => {
      if (!response.ok) throw new Error("Failed to load data");
      return response.json();
    })
    .then(data => {
      window._berserkData = data;
      renderTable(data);
      updateTableHeaders();
      updateLangIcon();
      applyTheme();
    })
    .catch(error => {
      tableBody.innerHTML = `<tr><td colspan="4" style="color: red;">Ошибка загрузки данных: ${error.message}</td></tr>`;
      console.error("Ошибка загрузки данных:", error);
    });

  // Инициализация интерфейса
  updateLangIcon();
  updateTableHeaders();
  applyTheme();
});
