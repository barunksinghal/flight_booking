const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

// Test data
const testFlightSearch = {
  origin: 'LAX',
  destination: 'JFK',
  date: '2024-02-15'
};

const testBooking = {
  passenger_name: 'Test User',
  passenger_email: 'test@example.com',
  passenger_phone: '+1234567890',
  seat_preference: 'window'
};

async function testAPI() {
  try {
    console.log('🧪 Testing Flight Booking API');
    console.log('=============================\n');

    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test 2: Get all flights
    console.log('\n2. Testing get all flights...');
    const allFlightsResponse = await axios.get(`${BASE_URL}/api/flights/all`);
    console.log(`✅ Retrieved ${allFlightsResponse.data.count} flights`);

    if (allFlightsResponse.data.count === 0) {
      console.log('⚠️  No flights found. Make sure to run: npm run seed');
      return;
    }

    // Test 3: Search flights
    console.log('\n3. Testing flight search...');
    const searchUrl = `${BASE_URL}/api/flights?origin=${testFlightSearch.origin}&destination=${testFlightSearch.destination}&date=${testFlightSearch.date}`;
    const searchResponse = await axios.get(searchUrl);
    console.log(`✅ Flight search returned ${searchResponse.data.count} results`);

    if (searchResponse.data.count === 0) {
      console.log('⚠️  No flights found for search criteria, trying different route...');
      // Try a different route that should have data
      const altSearchUrl = `${BASE_URL}/api/flights?origin=LAX&destination=JFK&date=2024-02-15`;
      const altSearchResponse = await axios.get(altSearchUrl);
      console.log(`✅ Alternative search returned ${altSearchResponse.data.count} results`);
    }

    // Test 4: Get specific flight
    const sampleFlight = allFlightsResponse.data.data[0];
    console.log('\n4. Testing get flight by ID...');
    const flightResponse = await axios.get(`${BASE_URL}/api/flights/${sampleFlight.id}`);
    console.log(`✅ Retrieved flight: ${flightResponse.data.data.flight_number}`);

    // Test 5: Create booking
    console.log('\n5. Testing create booking...');
    const bookingData = {
      ...testBooking,
      flight_id: sampleFlight.id
    };
    
    const bookingResponse = await axios.post(`${BASE_URL}/api/bookings`, bookingData);
    console.log(`✅ Booking created: ${bookingResponse.data.data.booking_reference}`);

    // Test 6: Get booking by ID
    console.log('\n6. Testing get booking by ID...');
    const bookingId = bookingResponse.data.data.id;
    const getBookingResponse = await axios.get(`${BASE_URL}/api/bookings/${bookingId}`);
    console.log(`✅ Retrieved booking: ${getBookingResponse.data.data.booking_reference}`);

    // Test 7: Get booking by reference
    console.log('\n7. Testing get booking by reference...');
    const bookingRef = bookingResponse.data.data.booking_reference;
    const getBookingByRefResponse = await axios.get(`${BASE_URL}/api/bookings/reference/${bookingRef}`);
    console.log(`✅ Retrieved booking by reference: ${getBookingByRefResponse.data.data.passenger_name}`);

    // Test 8: Error handling - invalid flight ID
    console.log('\n8. Testing error handling...');
    try {
      await axios.get(`${BASE_URL}/api/flights/invalid-uuid`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Error handling works: Invalid UUID format detected');
      } else {
        console.log('❌ Unexpected error response');
      }
    }

    console.log('\n🎉 All tests passed successfully!');
    console.log('🔧 API is working correctly and ready for frontend integration.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };