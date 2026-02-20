# 🚗 Luxury Car Dealership – Admin Inventory Management System

An **admin-only dealership inventory management system** built using **Node.js, Express, and MongoDB**.

This application allows dealership administrators to create, update, edit, and delete luxury vehicle inventory using RESTful API endpoints and HTML form-based routes.

> ⚠️ This system is intended for internal administrative use only.

---

## 📌 Overview

This project demonstrates:

- RESTful API development
- Full CRUD operations
- MongoDB integration using Mongoose
- Controller-based backend structure
- Form handling with Express
- Error handling and HTTP status codes
- Clean separation of concerns

---

## 🔐 Access Model

This system is designed strictly for:

- Dealership Administrators
- Inventory Managers
- Internal Staff

There are **no public customer-facing browsing routes** implemented.

All routes allow full inventory control and are expected to be protected by authentication middleware in a production environment.

---

## 🧱 Tech Stack

- **Backend:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Middleware:** CORS, Express JSON parsing
- **Architecture:** Controller-based structure

---

## 📂 Project Structure

```

dealership-management/
│
├── controllers/
│ └── carController.js
│
├── models/
│ └── carModel.js
│
├── views/
│ ├── index.html
│ ├── cars.html
│ ├── add-car.html
│ └── edit-car.html
│
├── public/
│ ├── css/
│ │ └── style.css 
│ ├── js/
│ │ ├── app.js 
│ │ └── edit.js
│ └── images/
│
├── server.js
├── package.json
└── package-lock.json

```