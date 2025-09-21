# 🌐 ShikshaMudra – A Hyperlocal P2P Skill Exchange Platform  

![GitHub stars](https://img.shields.io/github/stars/JayP2006/Bharat-Skill-Exchange?style=social)  
![GitHub forks](https://img.shields.io/github/forks/JayP2006/Bharat-Skill-Exchange?style=social)  
![GitHub issues](https://img.shields.io/github/issues/JayP2006/Bharat-Skill-Exchange)  
![GitHub license](https://img.shields.io/github/license/JayP2006/Bharat-Skill-Exchange)  
![Contributors](https://img.shields.io/github/contributors/JayP2006/Bharat-Skill-Exchange)  

> **ShikshaMudra** is a full-stack **MERN application** built as a **hyperlocal, peer-to-peer skill exchange platform**.  
> It connects **Gurus (experts/teachers)** with **Shishyas (learners)**, fostering community-driven knowledge sharing through **location-based discovery, booking, and real-time communication**.  

---

## 📖 Table of Contents  
- [✨ Features](#-features)  
- [🛠️ Tech Stack](#️-tech-stack)  
- [🚀 Getting Started](#-getting-started)  
- [📸 Screenshots](#-screenshots)  
- [📊 Technical Architecture](#-technical-architecture)  
- [🛤️ Roadmap](#️-roadmap)  
- [🤝 Contributing](#-contributing)  
- [🛡️ License](#️-license)  
- [👨‍💻 Author](#-author)  

---

## ✨ Features  

### 🔑 User Authentication & Role-Based Access  
- Role-based system: **Guru** (teacher) / **Shishya** (learner).  
- Secure authentication using **JWT**.  
- Passwords encrypted with **bcrypt.js**.  
- Middleware ensures protected & authorized routes.  

### 🎓 Guru-Centric Skill & Course Management  
- Full **CRUD** on skills.  
- Create structured workshops with title, duration, rate, seats, and mode (Online/Offline).  
- Upload **images & videos** with **Cloudinary**.  
- Location-aware listings with geospatial search support.  

### 🔍 Advanced Search & Discovery  
- **Keyword-based search** for skills.  
- **Geospatial “Nearby” search** using MongoDB `$geoWithin` and `$centerSphere`.  

### 📅 Booking & Review System  
- Direct session booking (hackathon version bypassed payments).  
- Prevents duplicate bookings.  
- Ratings (⭐1–5) + written reviews with live average rating updates.  

### 💬 Real-Time Communication  
- **Socket.IO-powered chat** between Gurus and Shishyas.  
- Auto-generated contact lists with role-based filtering.  

### 📊 Guru Dashboard & Analytics  
- Track KPIs: ⭐ Average Rating, 📖 Total Bookings, 💰 Earnings, 👩‍🎓 Students.  
- Realtime activity list & skill management.  
- Monthly earnings graph via **Recharts**.  

---

## 🛠️ Tech Stack  

**Frontend:**  
- ⚛️ React.js (Vite)  
- 🎨 Tailwind CSS + shadcn/ui  
- 🗂 Zustand (state management)  
- 🎬 Framer Motion (animations)  
- 🔗 Axios (API handling)  

**Backend:**  
- 🟢 Node.js + Express.js  
- 📦 Mongoose (ODM for MongoDB)  
- 🔐 JWT + bcrypt.js (Auth & Security)  
- 🌐 Socket.IO (Realtime chat)  
- 🖼 Multer + Cloudinary (Media handling)  

**Database:**  
- 🍃 MongoDB Atlas (with geospatial indexing)  

**Cross-Cutting Concerns:**  
- 🛡 Helmet + CORS (Security)  

---

## 🚀 Getting Started  

### 1️⃣ Clone the Repo  
```bash
git clone https://github.com/JayP2006/Bharat-Skill-Exchange.git
cd Bharat-Skill-Exchange
