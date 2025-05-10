let currentLang = 'en';

function loadData() {
  fetch('data.json')
    .then(res => res.json())
    .then(data => renderTable(data));
}

function renderTable(items) {
  const tbody = document.querySelector('#items-table tbody');
  tbody.innerHTML = ''; // clear
  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${item.icon}" alt="" width="32" /></td>
      <td>${item.names[currentLang]}</td>
      <td>${item.base_item}</td>
      <td>${item.reference ? `<img src="${item.reference}" width="64"/>` : '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('language').addEventListener('change', e => {
  currentLang = e.target.value;
  loadData();
});

loadData();
