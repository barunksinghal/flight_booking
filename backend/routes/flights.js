const express = require('express');
const router = express.Router();
const { searchFlights, getFlightById, getAllFlights } = require('../controllers/flightController');
const { validateSearchFlights, validateUUID } = require('../middleware/validation');

// GET /flights - Search flights with query parameters
router.get('/', validateSearchFlights, searchFlights);

// GET /flights/all - Get all flights (admin)
router.get('/all', getAllFlights);

// GET /flights/:id - Get flight by ID
router.get('/:id', validateUUID, getFlightById);

module.exports = router;