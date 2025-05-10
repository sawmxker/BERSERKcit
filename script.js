document.addEventListener('DOMContentLoaded', () => {
  const dataUrl = "data.json";
  const tableBody = document.querySelector("#items-table tbody");
  const translateBtn = document.getElementById("translate-btn");
  const languageMenu = document.getElementById("language-menu");
  const themeToggle = document.getElementById("theme-toggle");
  let currentLang = localStorage.getItem('language') || "en";
  let currentTheme = localStorage.getItem('theme') || "light";

  // Apply saved theme
  if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Load data
  fetch(dataUrl)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => renderTable(data))
    .catch(error => {
      console.error('Error loading data:', error);
      tableBody.innerHTML = `<tr><td colspan="4">Error loading data. Please try again later.</td></tr>`;
    });

  function renderTable(items) {
    if (!items || items.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4">No items found</td></tr>`;
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
        .then(data => renderTable(data));
      languageMenu.classList.add("hidden");
      translateBtn.classList.remove("active");
    });
  });

  // Close language menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!languageMenu.contains(e.target) {
      languageMenu.classList.add("hidden");
      translateBtn.classList.remove("active");
    }
  });

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.body.removeAttribute('data-theme');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'light');
    } else {
      document.body.setAttribute('data-theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
    }
  });

  // Splash screen and load animation
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.body.classList.add("loaded");
    }, 300);
  });
});
