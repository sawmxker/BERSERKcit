document.addEventListener('DOMContentLoaded', () => {
  const dataUrl = "data.json";
  const tableBody = document.querySelector("#items-table tbody");
  const translateBtn = document.getElementById("translate-btn");
  const languageMenu = document.getElementById("language-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const tableHeaders = document.querySelectorAll("#items-table th");
  let currentLang = localStorage.getItem('language') || "en";

  // Translations for table headers
  const headerTranslations = {
    en: ["Icon", "Display Name", "Base Item", "Reference"],
    ru: ["Иконка", "Название", "Базовый предмет", "Референс"],
    jp: ["アイコン", "表示名", "基本アイテム", "参照"]
  };

  // Load data
  fetch(dataUrl)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      renderTable(data);
      updateTableHeaders();
    })
    .catch(error => {
      console.error('Error loading data:', error);
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; font-weight: bold;">Error loading data. Please try again later.</td></tr>`;
    });

  function renderTable(items) {
    if (!items || items.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; font-weight: bold;">No items found</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    items.forEach(item => {
      const tr = document.createElement("tr");

      // Icon column
      const iconTd = document.createElement("td");
      iconTd.classList.add("item-icons");
      const icons = item.icon?.split(" ") || [];
      icons.forEach((icon, i) => {
        if (icon) {
          const img = document.createElement("img");
          img.src = icon;
          img.alt = i === 0 ? "Main hand" : "Off hand";
          img.loading = "lazy";
          iconTd.appendChild(img);
        }
      });

      // Name column
      const nameTd = document.createElement("td");
      const names = item.names?.[currentLang]?.split(";") || [];
      nameTd.textContent = names[0]?.trim() || "N/A";
      nameTd.style.fontWeight = "bold";
      if (names.length > 1) {
        nameTd.title = names.map(n => n.trim()).filter(n => n).join("\n");
      }

      // Base item column
      const baseTd = document.createElement("td");
      baseTd.textContent = item.base_item || "Any";
      baseTd.style.fontWeight = "bold";

      // Reference column
      const refTd = document.createElement("td");
      if (item.reference) {
        const img = document.createElement("img");
        img.src = item.reference;
        img.alt = "Reference";
        img.classList.add("ref-image");
        img.loading = "lazy";
        refTd.appendChild(img);
      } else {
        refTd.textContent = "-";
        refTd.style.fontWeight = "bold";
      }

      tr.append(iconTd, nameTd, baseTd, refTd);
      tableBody.appendChild(tr);
    });
  }

  function updateTableHeaders() {
    tableHeaders.forEach((header, index) => {
      header.textContent = headerTranslations[currentLang]?.[index] || header.textContent;
      header.style.fontWeight = "bold";
    });
  }

  // Language selection
  translateBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    languageMenu.classList.toggle("hidden");
    translateBtn.classList.toggle("active");
  });

  document.querySelectorAll(".language-menu button").forEach(btn => {
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang;
      localStorage.setItem('language', currentLang);
      fetch(dataUrl)
        .then(res => res.json())
        .then(data => {
          renderTable(data);
          updateTableHeaders();
        });
      languageMenu.classList.add("hidden");
      translateBtn.classList.remove("active");
    });
  });

  // Close language menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!languageMenu.contains(e.target) && e.target !== translateBtn) {
      languageMenu.classList.add("hidden");
      translateBtn.classList.remove("active");
    }
  });

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem('theme', document.body.classList.contains("dark-mode") ? 'dark' : 'light');
    
    // Update moon/sun icon
    const isDarkMode = document.body.classList.contains("dark-mode");
    themeToggle.innerHTML = isDarkMode 
      ? '<img src="images/webIconsLogosButtons/moon.png" alt="Light mode">'
      : '<img src="images/webIconsLogosButtons/moon.png" alt="Dark mode">';
  });

  // Apply saved theme and icon
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML = '<img src="images/webIconsLogosButtons/moon.png" alt="Light mode">';
  } else {
    themeToggle.innerHTML = '<img src="images/webIconsLogosButtons/moon.png" alt="Dark mode">';
  }

  // Splash screen and load animation
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.body.classList.add("loaded");
    }, 300);
  });
});
