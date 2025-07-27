const supabase = require('../db/supabase');
const { v4: uuidv4 } = require('uuid');

// Generate booking reference number
const generateBookingReference = () => {
  return 'FB' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
};

// Create a new booking
const createBooking = async (req, res, next) => {
  try {
    const { flight_id, passenger_name, passenger_email, passenger_phone, seat_preference } = req.body;

    // First, check if flight exists and has available seats
    const { data: flight, error: flightError } = await supabase
      .from('flights')
      .select('*')
      .eq('id', flight_id)
      .single();

    if (flightError) {
      if (flightError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Flight not found'
        });
      }
      throw flightError;
    }

    if (flight.available_seats <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'No available seats on this flight'
      });
    }

    // Check if flight is in the future
    const flightDate = new Date(flight.departure_time);
    const now = new Date();
    if (flightDate <= now) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Cannot book flights in the past'
      });
    }

    // Create user if doesn't exist
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', passenger_email)
      .single();

    let userId;
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          id: uuidv4(),
          name: passenger_name,
          email: passenger_email,
          phone: passenger_phone
        }])
        .select('id')
        .single();

      if (userError) {
        throw userError;
      }
      userId = newUser.id;
    }

    // Create booking
    const bookingData = {
      id: uuidv4(),
      flight_id: flight_id,
      user_id: userId,
      booking_reference: generateBookingReference(),
      passenger_name,
      passenger_email,
      passenger_phone,
      seat_preference: seat_preference || null,
      booking_status: 'confirmed',
      created_at: new Date().toISOString()
    };

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select('*')
      .single();

    if (bookingError) {
      throw bookingError;
    }

    // Update available seats
    const { error: updateError } = await supabase
      .from('flights')
      .update({ available_seats: flight.available_seats - 1 })
      .eq('id', flight_id);

    if (updateError) {
      // If updating seats fails, we should rollback the booking
      await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id);
      
      throw updateError;
    }

    // Return booking with flight details
    const bookingWithFlight = {
      ...booking,
      flight: {
        id: flight.id,
        flight_number: flight.flight_number,
        airline: flight.airline,
        origin: flight.origin,
        destination: flight.destination,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        price: flight.price
      }
    };

    res.status(201).json({
      success: true,
      data: bookingWithFlight,
      message: 'Booking created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        flights (
          id,
          flight_number,
          airline,
          origin,
          destination,
          departure_time,
          arrival_time,
          price,
          aircraft_type
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Booking not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by reference number
const getBookingByReference = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        flights (
          id,
          flight_number,
          airline,
          origin,
          destination,
          departure_time,
          arrival_time,
          price,
          aircraft_type
        )
      `)
      .eq('booking_reference', reference.toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Booking not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getBookingByReference
};