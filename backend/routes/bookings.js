const express = require('express');
const router = express.Router();
const { createBooking, getBookingById, getBookingByReference } = require('../controllers/bookingController');
const { validateCreateBooking, validateUUID } = require('../middleware/validation');

// POST /bookings - Create a new booking
router.post('/', validateCreateBooking, createBooking);

// GET /bookings/:id - Get booking by ID
router.get('/:id', validateUUID, getBookingById);

// GET /bookings/reference/:reference - Get booking by reference number
router.get('/reference/:reference', getBookingByReference);

module.exports = router;