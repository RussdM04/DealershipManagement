const Car = require('../models/carModel');

function normalizeImagePath(imageValue = '') {
  // Allow:
  // - "ferrari.jpg" -> "/images/ferrari.jpg"
  // - "/images/ferrari.jpg" (keep)
  // - "images/ferrari.jpg" -> "/images/ferrari.jpg"
  let v = String(imageValue).trim();
  if (!v) return v;

  if (v.startsWith('/images/')) return v;
  if (v.startsWith('images/')) return '/' + v;
  return '/images/' + v.replace(/^\//, '');
}

// GET – list all cars (JSON)
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cars', error: err.message });
  }
};

// GET – get one car (JSON)
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ message: 'Invalid car id', error: err.message });
  }
};

// POST – create car (JSON)
exports.createCar = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      brand: req.body.brand,
      price: Number(req.body.price),
      description: req.body.description,
      image: normalizeImagePath(req.body.image)
    };
    const car = await Car.create(payload);
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: 'Error creating car', error: err.message });
  }
};

// PUT – update car (JSON)
exports.updateCar = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      brand: req.body.brand,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      description: req.body.description,
      image: req.body.image !== undefined ? normalizeImagePath(req.body.image) : undefined
    };

    // Remove undefined fields so they don't overwrite
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    const car = await Car.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ message: 'Error updating car', error: err.message });
  }
};

// DELETE – delete car (JSON)
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting car', error: err.message });
  }
};

// --------------------
// Form helpers (redirect back to UI pages)
// --------------------
exports.createCarFromForm = async (req, res) => {
  try {
    await Car.create({
      name: req.body.name,
      brand: req.body.brand,
      price: Number(req.body.price),
      description: req.body.description,
      image: normalizeImagePath(req.body.image)
    });
    res.redirect('/cars.html');
  } catch (err) {
    res.status(400).send('Error adding car: ' + err.message);
  }
};

exports.updateCarFromForm = async (req, res) => {
  try {
    await Car.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        brand: req.body.brand,
        price: Number(req.body.price),
        description: req.body.description,
        image: normalizeImagePath(req.body.image)
      },
      { runValidators: true }
    );
    res.redirect('/cars.html');
  } catch (err) {
    res.status(400).send('Error updating car: ' + err.message);
  }
};

exports.deleteCarFromForm = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.redirect('/cars.html');
  } catch (err) {
    res.status(400).send('Error deleting car: ' + err.message);
  }
};