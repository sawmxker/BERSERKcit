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

  // Модальное окно для изображений
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `<span class="close">&times;</span><div class="modal-content"><img class="modal-img" src="" alt="Preview"></div>`;
  document.body.appendChild(modal);

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

  // Применить тему
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

  // Применить язык
  function applyLanguage() {
    langIcon.src = langIcons[currentLang];
    langIcon.alt = currentLang.toUpperCase();
    updateTableHeaders();
    // Если данные уже загружены, перерисовать таблицу
    if (window._berserkData) renderTable(window._berserkData);
  }

  // Заголовки
  function updateTableHeaders() {
    headerTranslations[currentLang].forEach((txt, i) => {
      if (tableHeaders[i]) tableHeaders[i].textContent = txt;
    });
  }

  // Рендер таблицы
  function renderTable(data) {
    tableBody.innerHTML = '';
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
        // Разделяем по ;
        const names = item.names[currentLang].split(';').map(n => n.trim()).filter(Boolean);
        names.forEach((name, idx) => {
          const span = document.createElement('span');
          span.textContent = name;
          nameTd.appendChild(span);
          if (idx !== names.length - 1) nameTd.appendChild(document.createElement('br'));
        });
      }
      tr.appendChild(nameTd);

      // Base Item
      const baseTd = document.createElement('td');
      baseTd.textContent = item.base_item || '';
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

  // Модальное окно для изображений
  function showModal(src) {
    const modalImg = modal.querySelector('.modal-img');
    modalImg.src = src;
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('active'), 10);
  }
  modal.querySelector('.close').onclick = () => {
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  };
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
  });

  // Переключение языка
  translateBtn.onclick = () => {
    languageMenu.classList.toggle('hidden');
  };
  languageMenu.onclick = (e) => {
    if (e.target.closest('button[data-lang]')) {
      const lang = e.target.closest('button[data-lang]').dataset.lang;
      currentLang = lang;
      localStorage.setItem('language', lang);
      applyLanguage();
      languageMenu.classList.add('hidden');
    }
  };
  document.addEventListener('click', (e) => {
    if (!languageMenu.contains(e.target) && e.target !== translateBtn) {
      languageMenu.classList.add('hidden');
    }
  });

  // Переключение темы
  themeToggle.onclick = () => {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    applyTheme();
  };

  // Загрузка данных
  fetch(dataUrl)
    .then(res => res.json())
    .then(data => {
      window._berserkData = data;
      renderTable(data);
      updateTableHeaders();
      applyTheme();
      applyLanguage();
    })
    .catch(error => {
      tableBody.innerHTML = `<tr><td colspan="4">Error loading data</td></tr>`;
    });

  // Инициализация темы и языка
  applyTheme();
  applyLanguage();
});
