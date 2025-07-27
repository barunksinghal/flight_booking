const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

// Sample flight data
const sampleFlights = [
  {
    id: uuidv4(),
    flight_number: 'AA101',
    airline: 'American Airlines',
    origin: 'LAX',
    destination: 'JFK',
    departure_time: new Date('2024-02-15T08:00:00Z').toISOString(),
    arrival_time: new Date('2024-02-15T16:30:00Z').toISOString(),
    price: 299.99,
    available_seats: 120,
    total_seats: 180,
    aircraft_type: 'Boeing 737-800'
  },
  {
    id: uuidv4(),
    flight_number: 'DL205',
    airline: 'Delta Airlines',
    origin: 'JFK',
    destination: 'LAX',
    departure_time: new Date('2024-02-15T10:15:00Z').toISOString(),
    arrival_time: new Date('2024-02-15T13:45:00Z').toISOString(),
    price: 349.99,
    available_seats: 85,
    total_seats: 160,
    aircraft_type: 'Airbus A320'
  },
  {
    id: uuidv4(),
    flight_number: 'UA308',
    airline: 'United Airlines',
    origin: 'ORD',
    destination: 'SFO',
    departure_time: new Date('2024-02-16T09:30:00Z').toISOString(),
    arrival_time: new Date('2024-02-16T12:15:00Z').toISOString(),
    price: 279.99,
    available_seats: 95,
    total_seats: 150,
    aircraft_type: 'Boeing 777-200'
  },
  {
    id: uuidv4(),
    flight_number: 'SW412',
    airline: 'Southwest Airlines',
    origin: 'DEN',
    destination: 'PHX',
    departure_time: new Date('2024-02-16T14:20:00Z').toISOString(),
    arrival_time: new Date('2024-02-16T15:40:00Z').toISOString(),
    price: 159.99,
    available_seats: 110,
    total_seats: 143,
    aircraft_type: 'Boeing 737-700'
  },
  {
    id: uuidv4(),
    flight_number: 'AA515',
    airline: 'American Airlines',
    origin: 'MIA',
    destination: 'LAS',
    departure_time: new Date('2024-02-17T07:45:00Z').toISOString(),
    arrival_time: new Date('2024-02-17T10:30:00Z').toISOString(),
    price: 389.99,
    available_seats: 68,
    total_seats: 128,
    aircraft_type: 'Airbus A321'
  },
  {
    id: uuidv4(),
    flight_number: 'JB620',
    airline: 'JetBlue Airways',
    origin: 'BOS',
    destination: 'LAX',
    departure_time: new Date('2024-02-17T11:00:00Z').toISOString(),
    arrival_time: new Date('2024-02-17T14:45:00Z').toISOString(),
    price: 329.99,
    available_seats: 92,
    total_seats: 162,
    aircraft_type: 'Airbus A320'
  },
  {
    id: uuidv4(),
    flight_number: 'DL723',
    airline: 'Delta Airlines',
    origin: 'ATL',
    destination: 'SEA',
    departure_time: new Date('2024-02-18T06:30:00Z').toISOString(),
    arrival_time: new Date('2024-02-18T08:15:00Z').toISOString(),
    price: 259.99,
    available_seats: 105,
    total_seats: 170,
    aircraft_type: 'Boeing 757-200'
  },
  {
    id: uuidv4(),
    flight_number: 'UA826',
    airline: 'United Airlines',
    origin: 'IAH',
    destination: 'ORD',
    departure_time: new Date('2024-02-18T16:40:00Z').toISOString(),
    arrival_time: new Date('2024-02-18T19:25:00Z').toISOString(),
    price: 199.99,
    available_seats: 78,
    total_seats: 124,
    aircraft_type: 'Boeing 737-900'
  },
  {
    id: uuidv4(),
    flight_number: 'AA929',
    airline: 'American Airlines',
    origin: 'DFW',
    destination: 'JFK',
    departure_time: new Date('2024-02-19T12:15:00Z').toISOString(),
    arrival_time: new Date('2024-02-19T16:50:00Z').toISOString(),
    price: 319.99,
    available_seats: 87,
    total_seats: 140,
    aircraft_type: 'Airbus A319'
  },
  {
    id: uuidv4(),
    flight_number: 'SW1030',
    airline: 'Southwest Airlines',
    origin: 'LAS',
    destination: 'DEN',
    departure_time: new Date('2024-02-19T18:30:00Z').toISOString(),
    arrival_time: new Date('2024-02-19T21:45:00Z').toISOString(),
    price: 179.99,
    available_seats: 125,
    total_seats: 143,
    aircraft_type: 'Boeing 737-800'
  }
];

// Sample users data
const sampleUsers = [
  {
    id: uuidv4(),
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890'
  },
  {
    id: uuidv4(),
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('flights').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert users
    console.log('👥 Inserting users...');
    const { error: usersError } = await supabase
      .from('users')
      .insert(sampleUsers);

    if (usersError) {
      throw usersError;
    }
    console.log(`✅ Inserted ${sampleUsers.length} users`);

    // Insert flights
    console.log('✈️  Inserting flights...');
    const { error: flightsError } = await supabase
      .from('flights')
      .insert(sampleFlights);

    if (flightsError) {
      throw flightsError;
    }
    console.log(`✅ Inserted ${sampleFlights.length} flights`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Sample data overview:');
    console.log(`- ${sampleUsers.length} users`);
    console.log(`- ${sampleFlights.length} flights`);
    console.log('\n🔍 You can now test the API with these sample flights:');
    sampleFlights.forEach(flight => {
      console.log(`  ${flight.airline} ${flight.flight_number}: ${flight.origin} → ${flight.destination} (${flight.departure_time.split('T')[0]})`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('\n✨ Seeding complete. You can now start the server with: npm run dev');
    process.exit(0);
  });
}

module.exports = { seedDatabase, sampleFlights, sampleUsers };