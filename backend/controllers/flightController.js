const supabase = require('../db/supabase');

// Search flights with filters
const searchFlights = async (req, res, next) => {
  try {
    const { origin, destination, date } = req.query;
    
    // Convert date to start and end of day for better search
    const searchDate = new Date(date);
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: flights, error } = await supabase
      .from('flights')
      .select('*')
      .eq('origin', origin.toUpperCase())
      .eq('destination', destination.toUpperCase())
      .gte('departure_time', startOfDay.toISOString())
      .lte('departure_time', endOfDay.toISOString())
      .gt('available_seats', 0)
      .order('departure_time', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: flights,
      count: flights.length,
      filters: {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        date: date
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get flight by ID
const getFlightById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: flight, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Flight not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};

// Get all flights (for admin purposes)
const getAllFlights = async (req, res, next) => {
  try {
    const { data: flights, error } = await supabase
      .from('flights')
      .select('*')
      .order('departure_time', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: flights,
      count: flights.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchFlights,
  getFlightById,
  getAllFlights
};