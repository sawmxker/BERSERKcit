document.addEventListener('DOMContentLoaded', () => {
  const dataUrl = "data.json";
  const tableBody = document.querySelector("#items-table tbody");
  const translateBtn = document.getElementById("translate-btn");
  const languageMenu = document.getElementById("language-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const tableHeaders = document.querySelectorAll("#items-table th");
  let currentLang = localStorage.getItem('language') || "en";

  // Create modal for image preview
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <span class="close">&times;</span>
    <div class="modal-content">
      <img class="modal-img" src="" alt="Enlarged view">
    </div>
  `;
  document.body.appendChild(modal);

  // Translations for table headers
  const headerTranslations = {
    en: ["Icon", "Display Name", "Base Item", "Reference"],
    ru: ["Иконка", "Название", "Базовый предмет", "Референс"],
    jp: ["アイコン", "表示名", "基本アイテム", "参照"]
  };

  // SF Symbols mapping (example)
  const sfSymbols = {
    sword: "􀣌",
    axe: "􀣋",
    default: "􀎟"
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
      initImageModals();
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

      // Icon column with SF Symbol
      const iconTd = document.createElement("td");
      iconTd.classList.add("item-icons");
      
      // Add SF Symbol
      const symbolSpan = document.createElement("span");
      symbolSpan.className = "sf-symbol";
      symbolSpan.textContent = item.base_item.includes("sword") ? sfSymbols.sword : 
                              item.base_item.includes("axe") ? sfSymbols.axe : 
                              sfSymbols.default;
      iconTd.appendChild(symbolSpan);
      
      // Add original icons if available
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
      if (names.length > 1) {
        nameTd.title = names.map(n => n.trim()).filter(n => n).join("\n");
      }

      // Base item column
      const baseTd = document.createElement("td");
      baseTd.textContent = item.base_item || "Any";

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
      }

      tr.append(iconTd, nameTd, baseTd, refTd);
      tableBody.appendChild(tr);
    });
  }

  function initImageModals() {
    const images = document.querySelectorAll('.item-icons img, .ref-image');
    const modalImg = document.querySelector('.modal-img');
    const closeBtn = document.querySelector('.close');

    images.forEach(img => {
      img.addEventListener('click', () => {
        modal.style.display = "block";
        modalImg.src = img.src;
        modalImg.alt = img.alt;
      });
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = "none";
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  function updateTableHeaders() {
    tableHeaders.forEach((header, index) => {
      header.textContent = headerTranslations[currentLang]?.[index] || header.textContent;
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
          initImageModals();
        });
      languageMenu.classList.add("hidden");
      translateBtn.classList.remove("active");
    });
  });

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem('theme', document.body.classList.contains("dark-mode") ? 'dark' : 'light');
    
    // Update moon/sun icon
    const isDarkMode = document.body.classList.contains("dark-mode");
    themeToggle.innerHTML = isDarkMode 
      ? '<img src="images/webIconsLogosButtons/sun.png" alt="Light mode">'
      : '<img src="images/webIconsLogosButtons/moon.png" alt="Dark mode">';
  });

  // Apply saved theme and icon
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML = '<img src="images/webIconsLogosButtons/sun.png" alt="Light mode">';
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
