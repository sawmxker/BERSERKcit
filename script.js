const languageSelect = document.getElementById("language");
const itemsTableBody = document.getElementById("items-table").getElementsByTagName("tbody")[0];
const themeToggleButton = document.getElementById("theme-toggle");
const translateBtn = document.getElementById("translate-btn");
const languageMenu = document.getElementById("language-menu");

let currentLanguage = 'en';

function createTableRow(item) {
  const row = document.createElement('tr');
  
  const iconCell = document.createElement('td');
  const iconImages = item.icon.split(' ').map(imgSrc => {
    const img = document.createElement('img');
    img.src = imgSrc;
    return img;
  });
  iconCell.append(...iconImages);
  
  const nameCell = document.createElement('td');
  nameCell.textContent = item.names[currentLanguage];

  const baseItemCell = document.createElement('td');
  baseItemCell.textContent = item.base_item;

  const referenceCell = document.createElement('td');
  if (item.reference) {
    const refImg = document.createElement('img');
    refImg.src = item.reference;
    referenceCell.appendChild(refImg);
  }

  row.append(iconCell, nameCell, baseItemCell, referenceCell);
  return row;
}

function renderTable() {
  itemsTableBody.innerHTML = '';
  data.forEach(item => {
    const row = createTableRow(item);
    itemsTableBody.appendChild(row);
  });
}

function toggleLanguageMenu() {
  languageMenu.classList.toggle("hidden");
}

function changeLanguage(lang) {
  currentLanguage = lang;
  renderTable();
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

translateBtn.addEventListener("click", toggleLanguageMenu);

languageMenu.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    changeLanguage(button.getAttribute("data-lang"));
    languageMenu.classList.add("hidden");
  });
});

themeToggleButton.addEventListener("click", toggleTheme);

renderTable();
