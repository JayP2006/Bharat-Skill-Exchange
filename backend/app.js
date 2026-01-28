const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

// --- 1. IMPORT ROUTES (Old + New) ---
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes'); // ✨ New Video Call Route

// --- 2. INITIALIZE APP ---
const app = express(); // Sirf Express App banaya

// --- 3. MIDDLEWARE ---
app.use(cors({
  origin: 'https://shiksha-mudraa.onrender.com',
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// --- 4. ROUTES ---
app.get('/', (req, res) => {
    res.send('<h1>BharatSkill Connect API is Running 🚀</h1>');
});

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes); // New Feature
app.use('/api/availability', require('./routes/availabilityRoutes')); // New Availability Route
app.use('/uploads', express.static('uploads'));

// --- 5. ERROR HANDLING ---
app.use(errorHandler);

// ⚠️ Important: Hum sirf 'app' export kar rahe hain, server nahi.
module.exports = app;