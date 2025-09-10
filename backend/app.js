const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');


const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);


app.get('/', (req, res) => {
    res.send('<h1>BharatSkill Connect API</h1><p>Welcome to the P2P Skill Exchange Platform!</p>');
});

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/certificates', certificateRoutes);


app.use(errorHandler);

module.exports = app;