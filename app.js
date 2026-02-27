const DB_NAME = 'accountant-pwa';
const DB_VERSION = 1;

let db;

async function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const d = req.result;
      if (!d.objectStoreNames.contains('suppliers')) {
        d.createObjectStore('suppliers', { keyPath: 'id', autoIncrement: true });
      }
      if (!d.objectStoreNames.contains('expenses')) {
        d.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
      }
      if (!d.objectStoreNames.contains('files')) {
        d.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(store, mode = 'readonly') {
  return db.transaction(store, mode).objectStore(store);
}

function all(store) {
  return new Promise((resolve, reject) => {
    const req = tx(store).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

function add(store, value) {
  return new Promise((resolve, reject) => {
    const req = tx(store, 'readwrite').add(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function put(store, value) {
  return new Promise((resolve, reject) => {
    const req = tx(store, 'readwrite').put(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsArrayBuffer(file);
  });
}

function fmtCurrency(n) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(Number(n || 0));
}

async function renderSuppliers() {
  const suppliers = await all('suppliers');
  const list = document.getElementById('supplier-list');
  const select = document.getElementById('supplier-select');

  list.innerHTML = suppliers
    .map((s) => `<li class="item"><span>${s.name} (${s.defaultCategory || 'No default'})</span></li>`)
    .join('');

  select.innerHTML = `<option value="">-- Select Supplier --</option>${suppliers
    .map((s) => `<option value="${s.id}">${s.name}</option>`)
    .join('')}`;
}

async function renderExpenses() {
  const expenses = (await all('expenses')).sort((a, b) => (a.date < b.date ? 1 : -1));
  const host = document.getElementById('expense-list');
  host.innerHTML = '';

  for (const e of expenses.slice(0, 100)) {
    const invoiceLink = e.invoiceFileId
      ? `<button data-open-file="${e.invoiceFileId}" type="button">Open Invoice</button>`
      : '';
    host.insertAdjacentHTML(
      'beforeend',
      `<div class="item"><span>${e.date} • ${e.supplierName || 'Unknown'} • ${e.category}/${e.subCategory || '-'} • ${fmtCurrency(
        e.amount
      )}</span><span>${invoiceLink}</span></div>`
    );
  }

  host.querySelectorAll('[data-open-file]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.getAttribute('data-open-file'));
      const file = await new Promise((resolve, reject) => {
        const req = tx('files').get(id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      if (!file) return;
      const blob = new Blob([file.data], { type: file.type });
      window.open(URL.createObjectURL(blob), '_blank');
    });
  });
}

async function renderReport() {
  const from = document.getElementById('from-date').value;
  const to = document.getElementById('to-date').value;
  const expenses = await all('expenses');
  const filtered = expenses.filter((e) => (!from || e.date >= from) && (!to || e.date <= to));

  const grouped = {};
  for (const e of filtered) {
    grouped[e.category] ??= { total: 0, sub: {} };
    grouped[e.category].total += Number(e.amount || 0);
    const sub = e.subCategory || 'Uncategorised';
    grouped[e.category].sub[sub] = (grouped[e.category].sub[sub] || 0) + Number(e.amount || 0);
  }

  let grand = 0;
  const html = Object.entries(grouped)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([cat, details]) => {
      grand += details.total;
      const subHtml = Object.entries(details.sub)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([sub, amount]) => `<div>${sub}: ${fmtCurrency(amount)}</div>`)
        .join('');
      return `<div class="report-category"><strong>${cat}</strong> (${fmtCurrency(details.total)})${subHtml}</div>`;
    })
    .join('');

  document.getElementById('report').innerHTML = `${html}<hr/><strong>Total: ${fmtCurrency(grand)}</strong>`;
}

async function exportJson() {
  const payload = {
    suppliers: await all('suppliers'),
    expenses: await all('expenses'),
    files: await all('files')
  };
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `accountant-backup-${Date.now()}.json`;
  a.click();
}

async function importJson(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  for (const s of data.suppliers || []) await put('suppliers', s);
  for (const f of data.files || []) await put('files', f);
  for (const e of data.expenses || []) await put('expenses', e);
}

async function init() {
  db = await openDb();

  document.getElementById('expense-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    const supplierId = Number(form.get('supplierId')) || null;
    const suppliers = await all('suppliers');
    const supplier = suppliers.find((s) => s.id === supplierId);

    let invoiceFileId = null;
    const invoice = form.get('invoice');
    if (invoice && invoice.size) {
      const data = await readFileAsArrayBuffer(invoice);
      invoiceFileId = await add('files', {
        name: invoice.name,
        type: invoice.type,
        size: invoice.size,
        data
      });
    }

    await add('expenses', {
      date: form.get('date'),
      supplierId,
      supplierName: supplier?.name || '',
      category: form.get('category'),
      subCategory: form.get('subCategory'),
      amount: Number(form.get('amount')),
      description: form.get('description'),
      invoiceFileId
    });

    ev.currentTarget.reset();
    await renderExpenses();
    await renderReport();
  });

  document.getElementById('supplier-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    await add('suppliers', {
      name: form.get('name'),
      address: form.get('address'),
      phone: form.get('phone'),
      defaultCategory: form.get('defaultCategory'),
      defaultSubCategory: form.get('defaultSubCategory')
    });
    ev.currentTarget.reset();
    await renderSuppliers();
  });

  document.getElementById('supplier-select').addEventListener('change', async (ev) => {
    const id = Number(ev.target.value);
    if (!id) return;
    const supplier = (await all('suppliers')).find((s) => s.id === id);
    if (!supplier) return;
    const ef = document.getElementById('expense-form');
    if (supplier.defaultCategory) ef.category.value = supplier.defaultCategory;
    if (supplier.defaultSubCategory) ef.subCategory.value = supplier.defaultSubCategory;
  });

  document.getElementById('refresh-report').addEventListener('click', renderReport);
  document.getElementById('export-json').addEventListener('click', exportJson);
  document.getElementById('import-json').addEventListener('change', async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    await importJson(file);
    await renderSuppliers();
    await renderExpenses();
    await renderReport();
  });

  const now = new Date();
  const year = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
  document.getElementById('from-date').value = `${year}-07-01`;
  document.getElementById('to-date').value = `${year + 1}-06-30`;

  await renderSuppliers();
  await renderExpenses();
  await renderReport();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
}

init();
