function moneyCAD(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
}

function truncate(text, max = 110) {
  const t = String(text || '');
  if (t.length <= max) return t;
  return t.slice(0, max).trimEnd() + '…';
}

async function fetchCars() {
  const res = await fetch('/api/cars');
  if (!res.ok) throw new Error('Failed to load cars');
  return res.json();
}

function renderCars(cars, query = '') {
  const grid = document.querySelector('#carGrid');
  const empty = document.querySelector('#emptyState');

  const q = query.trim().toLowerCase();
  const filtered = !q
    ? cars
    : cars.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.brand || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
      );

  grid.innerHTML = '';

  if (filtered.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  for (const car of filtered) {
    const card = document.createElement('div');
    card.className = 'card car';

    card.innerHTML = `
      <img class="car-img" src="${car.image}" alt="${car.brand} ${car.name}" onerror="this.src='/images/placeholder.jpg'">
      <div class="car-body">
        <div class="car-top">
          <div>
            <h3>${car.name}</h3>
            <div class="helper">${car.brand}</div>
          </div>
          <div class="tag">Luxury</div>
        </div>
        <p>${truncate(car.description)}</p>
        <div class="meta">
          <div class="price">${moneyCAD(car.price)}</div>
          <div class="actions">
            <a class="btn" href="/edit-car.html?id=${car._id}" title="Edit">✏️ Edit</a>
            <button class="btn btn-danger" data-id="${car._id}" title="Delete">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  }

  // Hook delete buttons
  document.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const ok = confirm('Delete this car? This cannot be undone.');
      if (!ok) return;

      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Delete failed. Please try again.');
        return;
      }
      // Reload list
      window.location.reload();
    });
  });
}

async function init() {
  try {
    const cars = await fetchCars();
    renderCars(cars);

    const search = document.querySelector('#search');
    search.addEventListener('input', () => renderCars(cars, search.value));
  } catch (err) {
    console.error(err);
    const empty = document.querySelector('#emptyState');
    empty.style.display = 'block';
    empty.innerHTML = '⚠️ Could not load cars. Make sure MongoDB is running and the server is up.';
  }
}

document.addEventListener('DOMContentLoaded', init);