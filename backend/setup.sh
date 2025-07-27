#!/bin/bash

echo "🚀 Flight Booking Backend Setup Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your Supabase credentials."
    echo ""
    echo "⚠️  IMPORTANT: You need to update the following variables in .env:"
    echo "   - SUPABASE_URL=your_supabase_project_url"
    echo "   - SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "   - SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your Supabase credentials"
echo "2. Create database schema in Supabase SQL editor using sql/schema.sql"
echo "3. Run 'npm run seed' to populate with sample data"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "📚 For detailed instructions, see README.md"