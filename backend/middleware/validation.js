const Joi = require('joi');

// Validation schemas
const searchFlightsSchema = Joi.object({
  origin: Joi.string().min(3).max(3).required(),
  destination: Joi.string().min(3).max(3).required(),
  date: Joi.date().iso().min('now').required()
});

const createBookingSchema = Joi.object({
  flight_id: Joi.string().uuid().required(),
  passenger_name: Joi.string().min(2).max(100).required(),
  passenger_email: Joi.string().email().required(),
  passenger_phone: Joi.string().min(10).max(15).required(),
  seat_preference: Joi.string().valid('window', 'aisle', 'middle').optional()
});

// Validation middleware
const validateSearchFlights = (req, res, next) => {
  const { error } = searchFlightsSchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

const validateCreateBooking = (req, res, next) => {
  const { error } = createBookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

const validateUUID = (req, res, next) => {
  const { id } = req.params;
  const uuidSchema = Joi.string().uuid();
  const { error } = uuidSchema.validate(id);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      details: 'ID must be a valid UUID'
    });
  }
  next();
};

module.exports = {
  validateSearchFlights,
  validateCreateBooking,
  validateUUID
};