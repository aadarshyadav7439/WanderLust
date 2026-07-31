# 🏡 WanderLust

WanderLust is a full-stack Airbnb-inspired web application where users can discover, create, and manage vacation rental listings.

🌐 **Live Demo:** https://wanderlust-js03.onrender.com/listings

## ✨ Features

- 🔐 User Authentication (Sign Up / Login / Logout)
- 🏡 Create, Edit & Delete Listings
- ☁️ Image Uploads with Cloudinary
- ⭐ Reviews & Ratings
- 🔍 Search Listings by Title, Location, and Country
- 🏷️ Category-Based Filters
- 🗺️ Interactive Maps with Leaflet
- 📄 Pagination
- 🍪 Persistent Login Sessions using MongoDB Session Store
- 📱 Responsive UI built with Bootstrap

## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS
- Bootstrap
- JavaScript
- EJS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose

**Authentication**
- Passport.js
- Express Session

**Storage & Deployment**
- Cloudinary
- Multer
- Render

## 🚀 Run Locally

```bash
git clone https://github.com/aadarshyadav7439/WanderLust.git
cd WanderLust
npm install
npm start
```

Create a `.env` file with:

```env
ATLAS_DB_URL=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
SECRET=
```

Visit:

```
http://localhost:8080/listings
```

## 📌 Future Improvements

- ❤️ Wishlist / Favorites
- 📅 Booking System
- 💳 Payment Integration
- 📧 Email Notifications
- 🗂️ Advanced Search & Sorting

---

Inspired by Airbnb and built as a full-stack learning project using the MERN ecosystem (EJS-based frontend).