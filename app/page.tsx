"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plane, Users, MapPin } from "lucide-react"
import { format } from "date-fns"

export default function HomePage() {
  const router = useRouter()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [passengers, setPassengers] = useState("1")
  const [tripType, setTripType] = useState("round-trip")

  const handleSearch = () => {
    if (origin && destination && departureDate) {
      const searchParams = new URLSearchParams({
        origin,
        destination,
        departureDate: departureDate.toISOString(),
        returnDate: returnDate?.toISOString() || "",
        passengers,
        tripType,
      })
      router.push(`/search?${searchParams.toString()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plane className="h-8 w-8" />
            <h1 className="text-2xl font-bold">FlightBooker</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-200">
              Flights
            </a>
            <a href="#" className="hover:text-blue-200">
              Hotels
            </a>
            <a href="#" className="hover:text-blue-200">
              Car Rental
            </a>
            <a href="#" className="hover:text-blue-200">
              My Bookings
            </a>
          </nav>
          <div className="flex space-x-2">
            <Button variant="outline" className="text-blue-900 border-white hover:bg-white bg-transparent">
              Sign In
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">Register</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-white mb-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Flight</h2>
          <p className="text-xl md:text-2xl opacity-90">Compare prices from hundreds of airlines and travel sites</p>
        </div>

        {/* Search Form */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            {/* Trip Type Selection */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="round-trip"
                  name="tripType"
                  value="round-trip"
                  checked={tripType === "round-trip"}
                  onChange={(e) => setTripType(e.target.value)}
                  className="text-blue-600"
                />
                <Label htmlFor="round-trip">Round Trip</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="one-way"
                  name="tripType"
                  value="one-way"
                  checked={tripType === "one-way"}
                  onChange={(e) => setTripType(e.target.value)}
                  className="text-blue-600"
                />
                <Label htmlFor="one-way">One Way</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Origin */}
              <div className="space-y-2">
                <Label htmlFor="origin" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  From
                </Label>
                <Input
                  id="origin"
                  placeholder="Origin city"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  To
                </Label>
                <Input
                  id="destination"
                  placeholder="Destination city"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Departure Date */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Departure
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start text-left font-normal bg-transparent"
                    >
                      {departureDate ? format(departureDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date */}
              {tripType === "round-trip" && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Return
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-12 w-full justify-start text-left font-normal bg-transparent"
                      >
                        {returnDate ? format(returnDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Passengers */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Passengers
                </Label>
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold"
            >
              Search Flights
            </Button>
          </CardContent>
        </Card>

        {/* Popular Destinations */}
        <div className="mt-16 text-white">
          <h3 className="text-2xl font-bold text-center mb-8">Popular Destinations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: "New York", country: "USA", image: "/placeholder.svg?height=200&width=300" },
              { city: "London", country: "UK", image: "/placeholder.svg?height=200&width=300" },
              { city: "Tokyo", country: "Japan", image: "/placeholder.svg?height=200&width=300" },
              { city: "Paris", country: "France", image: "/placeholder.svg?height=200&width=300" },
            ].map((dest) => (
              <Card key={dest.city} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative h-32">
                  <img src={dest.image || "/placeholder.svg"} alt={dest.city} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                    <div className="p-3 text-white">
                      <h4 className="font-semibold">{dest.city}</h4>
                      <p className="text-sm opacity-90">{dest.country}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
