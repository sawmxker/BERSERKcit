document.addEventListener('DOMContentLoaded', () => {
  const dataUrl = "data.json";
  const tableBody = document.querySelector("#items-table tbody");
  const translateBtn = document.getElementById("translate-btn");
  const languageMenu = document.getElementById("language-menu");
  const themeToggle = document.getElementById("theme-toggle");
  const searchBtn = document.getElementById("search-btn");
  const searchContainer = document.getElementById("search-container");
  const searchInput = document.getElementById("search-input");
  const clearSearch = document.getElementById("clear-search");
  const loadingIndicator = document.getElementById("loading-indicator");
  const noResults = document.getElementById("no-results");
  const splashScreen = document.getElementById("splash-screen");
  const tableHeaders = document.querySelectorAll("#items-table th");
  
  let currentLang = localStorage.getItem('language') || "en";
  let allItems = [];
  let filteredItems = [];

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

  // Translations for UI elements
  const translations = {
    en: {
      searchPlaceholder: "Search items...",
      noResults: "No items found matching your search",
      loading: "Loading items...",
      headers: ["Icon", "Display Name", "Base Item", "Reference"]
    },
    ru: {
      searchPlaceholder: "Поиск предметов...",
      noResults: "Ничего не найдено",
      loading: "Загрузка...",
      headers: ["Иконка", "Название", "Базовый предмет", "Референс"]
    },
    jp: {
      searchPlaceholder: "アイテムを検索...",
      noResults: "該当するアイテムが見つかりません",
      loading: "読み込み中...",
      headers: ["アイコン", "表示名", "基本アイテム", "参照"]
    }
  };

  // Initialize the app
  function init() {
    loadData();
    setupEventListeners();
    applySavedSettings();
    simulateLoadingProgress();
  }

  // Simulate loading progress for splash screen
  function simulateLoadingProgress() {
    const progress = document.querySelector('.progress');
    let width = 0;
    const interval = setInterval(() => {
      width += Math.random() * 10;
      progress.style.width = `${Math.min(width, 100)}%`;
      if (width >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          splashScreen.classList.add('fade-out');
          setTimeout(() => {
            splashScreen.style.display = 'none';
          }, 500);
        }, 300);
      }
    }, 100);
  }

  // Load data from JSON
  function loadData() {
    loadingIndicator.style.display = 'flex';
    tableBody.innerHTML = '';
    
    fetch(dataUrl)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        allItems = data;
        filteredItems = [...data];
        renderTable();
        updateUI();
        initImageModals();
      })
      .catch(error => {
        console.error('Error loading data:', error);
        showError();
      })
      .finally(() => {
        loadingIndicator.style.display = 'none';
      });
  }

  // Render table with items
  function renderTable() {
    if (!filteredItems || filteredItems.length === 0) {
      noResults.classList.add('show');
      tableBody.innerHTML = '';
      return;
    }

    noResults.classList.remove('show');
    tableBody.innerHTML = "";
    
    filteredItems.forEach(item => {
      const tr = document.createElement("tr");
      tr.classList.add('item-row');
      tr.dataset.id = item.id;

      // Icon column
      const iconTd = document.createElement("td");
      iconTd.classList.add("item-icons");
      
      // Add Font Awesome icon with tooltip
      const iconWrapper = document.createElement("div");
      iconWrapper.className = "tooltip";
      
      const faIcon = document.createElement("i");
      faIcon.className = "fa-icon";
      
      // Determine icon based on item type
      if (item.base_item.includes("sword")) {
        faIcon.classList.add("fas", "fa-sword");
        iconWrapper.innerHTML = '<span class="tooltiptext">Sword</span>';
      } else if (item.base_item.includes("axe")) {
        faIcon.classList.add("fas", "fa-hatchet");
        iconWrapper.innerHTML = '<span class="tooltiptext">Axe</span>';
      } else {
        faIcon.classList.add("fas", "fa-question");
        iconWrapper.innerHTML = '<span class="tooltiptext">Unknown</span>';
      }
      
      iconWrapper.prepend(faIcon);
      iconTd.appendChild(iconWrapper);
      
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

  // Filter items based on search query
  function filterItems(query) {
    if (!query) {
      filteredItems = [...allItems];
    } else {
      const lowerQuery = query.toLowerCase();
      filteredItems = allItems.filter(item => {
        // Search in names
        const names = item.names?.[currentLang]?.toLowerCase() || '';
        if (names.includes(lowerQuery)) return true;
        
        // Search in base item
        const baseItem = item.base_item?.toLowerCase() || '';
        if (baseItem.includes(lowerQuery)) return true;
        
        return false;
      });
    }
    
    renderTable();
    updateNoResultsState();
  }

  // Update no results state
  function updateNoResultsState() {
    if (filteredItems.length === 0 && allItems.length > 0) {
      noResults.querySelector('p').textContent = translations[currentLang].noResults;
      noResults.classList.add('show');
    } else {
      noResults.classList.remove('show');
    }
  }

  // Show error state
  function showError() {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 2rem; font-weight: 500; color: var(--text-secondary)">
          <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>Error loading data. Please try again later.</p>
        </td>
      </tr>
    `;
  }

  // Initialize image modals
  function initImageModals() {
    const images = document.querySelectorAll('.item-icons img, .ref-image');
    const modalImg = document.querySelector('.modal-img');
    const closeBtn = document.querySelector('.close');

    images.forEach(img => {
      img.addEventListener('click', () => {
        modal.classList.add('show');
        modal.style.display = "block";
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        document.body.style.overflow = 'hidden';
      });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = 'auto';
    }, 300);
  }

  // Update table headers and other UI elements
  function updateUI() {
    // Update table headers
    tableHeaders.forEach((header, index) => {
      header.textContent = translations[currentLang].headers[index] || header.textContent;
    });
    
    // Update search placeholder
    searchInput.placeholder = translations[currentLang].searchPlaceholder;
    
    // Update loading text
    loadingIndicator.querySelector('span').textContent = translations[currentLang].loading;
  }

  // Apply saved settings from localStorage
  function applySavedSettings() {
    // Theme
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add("dark-mode");
      themeToggle.innerHTML = '<img src="images/webIconsLogosButtons/sun.png" alt="Light mode">';
    } else {
      themeToggle.innerHTML = '<img src="images/webIconsLogosButtons/moon.png" alt="Dark mode">';
    }
    
    // Language
    if (localStorage.getItem('language')) {
      currentLang = localStorage.getItem('language');
      updateUI();
    }
  }

  // Set up event listeners
  function setupEventListeners() {
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
        filterItems(searchInput.value);
        updateUI();
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

    // Search functionality
    searchBtn.addEventListener('click', () => {
      searchContainer.classList.toggle('hidden');
      searchContainer.classList.toggle('visible');
      if (!searchContainer.classList.contains('hidden')) {
        searchInput.focus();
      }
    });

    searchInput.addEventListener('input', (e) => {
      filterItems(e.target.value);
    });

    clearSearch.addEventListener('click', () => {
      searchInput.value = '';
      filterItems('');
      searchInput.focus();
    });

    // Close language menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!languageMenu.contains(e.target) && e.target !== translateBtn) {
        languageMenu.classList.add("hidden");
        translateBtn.classList.remove("active");
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchContainer.classList.remove('hidden');
        searchContainer.classList.add('visible');
        searchInput.focus();
      }
      
      // Escape to close search or language menu
      if (e.key === 'Escape') {
        if (!searchContainer.classList.contains('hidden')) {
          searchContainer.classList.add('hidden');
          searchContainer.classList.remove('visible');
        }
        if (!languageMenu.classList.contains('hidden')) {
          languageMenu.classList.add('hidden');
          translateBtn.classList.remove('active');
        }
      }
    });
  }

  // Initialize the app
  init();
});
