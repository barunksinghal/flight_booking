const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Flight Booking API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Flight Booking API',
    version: '1.0.0',
    endpoints: {
      flights: {
        search: 'GET /api/flights?origin=LAX&destination=NYC&date=2024-01-01',
        getById: 'GET /api/flights/:id',
        getAll: 'GET /api/flights/all'
      },
      bookings: {
        create: 'POST /api/bookings',
        getById: 'GET /api/bookings/:id',
        getByReference: 'GET /api/bookings/reference/:reference'
      },
      health: 'GET /health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;