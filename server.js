const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const carController = require('./controllers/carController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));
app.use(express.static('views'));

// MongoDB
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/luxuryCarDB';
mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB:', MONGO_URL))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// --------------------
// API (JSON endpoints)
// --------------------
app.get('/api/cars', carController.getAllCars);
app.get('/api/cars/:id', carController.getCarById);
app.post('/api/cars', carController.createCar);
app.put('/api/cars/:id', carController.updateCar);
app.delete('/api/cars/:id', carController.deleteCar);

// --------------------
// Form-friendly routes (beginner-friendly)
// HTML forms can only do GET/POST, so we provide POST helpers.
// --------------------
app.post('/cars', carController.createCarFromForm);
app.post('/cars/:id/update', carController.updateCarFromForm);
app.post('/cars/:id/delete', carController.deleteCarFromForm);

// Default route
app.get('/', (req, res) => res.redirect('/index.html'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});