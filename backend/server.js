const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const initializeSocket = require('./utils/socket');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Make io instance available globally in the app
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});