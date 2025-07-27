# Flight Booking Backend API

A complete Node.js/Express backend application for flight booking with Supabase integration.

## 🚀 Features

- **Flight Search**: Search flights by origin, destination, and date
- **Flight Details**: Get detailed information about specific flights
- **Booking System**: Create and manage flight bookings
- **Database Integration**: Supabase PostgreSQL database with UUID primary keys
- **Data Validation**: Comprehensive input validation using Joi
- **Error Handling**: Centralized error handling with appropriate HTTP status codes
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration
- **Environment Configuration**: Secure environment variable management
- **Sample Data**: Mock data loading script with 10 sample flights

## 📁 Project Structure

```
backend/
├── controllers/
│   ├── flightController.js    # Flight-related business logic
│   └── bookingController.js   # Booking-related business logic
├── db/
│   └── supabase.js           # Supabase client configuration
├── middleware/
│   ├── validation.js         # Request validation middleware
│   └── errorHandler.js       # Centralized error handling
├── routes/
│   ├── flights.js           # Flight API routes
│   └── bookings.js          # Booking API routes
├── scripts/
│   └── seedData.js          # Database seeding script
├── sql/
│   └── schema.sql           # Database schema definitions
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── server.js               # Main application entry point
└── README.md               # This file
```

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### 2. Clone and Install

```bash
cd backend
npm install
```

### 3. Environment Configuration

Copy the environment template and configure your variables:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema in your Supabase SQL editor:

```bash
# Copy the contents of sql/schema.sql and execute in Supabase SQL editor
```

3. Seed the database with sample data:

```bash
npm run seed
```

### 5. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Health Check
```http
GET /health
```

### Flights

#### Search Flights
```http
GET /api/flights?origin=LAX&destination=JFK&date=2024-02-15
```

**Query Parameters:**
- `origin` (required): 3-letter airport code
- `destination` (required): 3-letter airport code  
- `date` (required): Date in YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "flight_number": "AA101",
      "airline": "American Airlines",
      "origin": "LAX",
      "destination": "JFK",
      "departure_time": "2024-02-15T08:00:00Z",
      "arrival_time": "2024-02-15T16:30:00Z",
      "price": 299.99,
      "available_seats": 120,
      "total_seats": 180,
      "aircraft_type": "Boeing 737-800"
    }
  ],
  "count": 1
}
```

#### Get Flight Details
```http
GET /api/flights/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "flight_number": "AA101",
    "airline": "American Airlines",
    // ... other flight details
  }
}
```

### Bookings

#### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "flight_id": "uuid",
  "passenger_name": "John Doe",
  "passenger_email": "john@example.com",
  "passenger_phone": "+1234567890",
  "seat_preference": "window"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "booking_reference": "FB12345678ABCD",
    "flight_id": "uuid",
    "passenger_name": "John Doe",
    "passenger_email": "john@example.com",
    "booking_status": "confirmed",
    "flight": {
      "flight_number": "AA101",
      "airline": "American Airlines",
      // ... flight details
    }
  },
  "message": "Booking created successfully"
}
```

#### Get Booking Details
```http
GET /api/bookings/:id
```

#### Get Booking by Reference
```http
GET /api/bookings/reference/:reference
```

## 🧪 Testing the API

### Using curl

1. **Search Flights:**
```bash
curl "http://localhost:3001/api/flights?origin=LAX&destination=JFK&date=2024-02-15"
```

2. **Create Booking:**
```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "flight_id": "your-flight-uuid",
    "passenger_name": "John Doe",
    "passenger_email": "john@example.com",
    "passenger_phone": "+1234567890"
  }'
```

### Using Postman

Import the following collection:

1. Set base URL: `http://localhost:3001/api`
2. Create requests for each endpoint
3. Use the sample data UUIDs from the seeding script

## 🔧 Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3001) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | No |
| `FRONTEND_URL` | Frontend URL for CORS | No (default: http://localhost:3000) |

### Database Schema

The application uses three main tables:

1. **users** - User information
2. **flights** - Flight details and availability
3. **bookings** - Booking records with references

See `sql/schema.sql` for complete schema definitions.

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation with Joi
- Environment variable protection
- SQL injection prevention through Supabase client

## 📈 Performance Considerations

- Database indexes on frequently queried fields
- Efficient Supabase queries with selective field loading
- Error logging for debugging
- Request logging with Morgan

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.