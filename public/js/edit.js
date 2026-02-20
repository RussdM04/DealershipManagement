function getId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadCar(id) {
  const res = await fetch(`/api/cars/${id}`);
  if (!res.ok) throw new Error('Car not found');
  return res.json();
}

function setValue(id, value) {
  const el = document.querySelector(`#${id}`);
  if (el) el.value = value ?? '';
}

async function init() {
  const id = getId();
  if (!id) {
    document.querySelector('#error').textContent = 'Missing car id in URL.';
    return;
  }

  try {
    const car = await loadCar(id);

    setValue('name', car.name);
    setValue('brand', car.brand);
    setValue('price', car.price);
    setValue('description', car.description);
    // show filename only (form accepts either filename or /images/filename)
    setValue('image', (car.image || '').replace('/images/',''));

    // Set form action for POST helper
    const form = document.querySelector('#editForm');
    form.setAttribute('action', `/cars/${id}/update`);

    // Preview
    const preview = document.querySelector('#preview');
    preview.src = car.image || '/images/placeholder.jpg';
  } catch (err) {
    console.error(err);
    document.querySelector('#error').textContent = 'Could not load car. Check the ID and try again.';
  }

  // Live preview when image changes
  const imgInput = document.querySelector('#image');
  imgInput.addEventListener('input', () => {
    const v = imgInput.value.trim();
    const src = v.startsWith('/images/') ? v : `/images/${v.replace(/^\//,'')}`;
    document.querySelector('#preview').src = src;
  });
}

document.addEventListener('DOMContentLoaded', init);