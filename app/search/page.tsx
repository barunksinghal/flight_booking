"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plane, Calendar } from "lucide-react"
import { format } from "date-fns"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    time: string
    airport: string
    city: string
  }
  arrival: {
    time: string
    airport: string
    city: string
  }
  duration: string
  price: number
  stops: number
  aircraft: string
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)

  const origin = searchParams.get("origin")
  const destination = searchParams.get("destination")
  const departureDate = searchParams.get("departureDate")
  const passengers = searchParams.get("passengers")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockFlights: Flight[] = [
        {
          id: "1",
          airline: "American Airlines",
          flightNumber: "AA 1234",
          departure: { time: "08:00", airport: "JFK", city: origin || "New York" },
          arrival: { time: "11:30", airport: "LAX", city: destination || "Los Angeles" },
          duration: "5h 30m",
          price: 299,
          stops: 0,
          aircraft: "Boeing 737",
        },
        {
          id: "2",
          airline: "Delta Airlines",
          flightNumber: "DL 5678",
          departure: { time: "10:15", airport: "JFK", city: origin || "New York" },
          arrival: { time: "14:45", airport: "LAX", city: destination || "Los Angeles" },
          duration: "6h 30m",
          price: 259,
          stops: 1,
          aircraft: "Airbus A320",
        },
        {
          id: "3",
          airline: "United Airlines",
          flightNumber: "UA 9012",
          departure: { time: "14:20", airport: "JFK", city: origin || "New York" },
          arrival: { time: "17:50", airport: "LAX", city: destination || "Los Angeles" },
          duration: "5h 30m",
          price: 329,
          stops: 0,
          aircraft: "Boeing 777",
        },
        {
          id: "4",
          airline: "JetBlue Airways",
          flightNumber: "B6 3456",
          departure: { time: "18:30", airport: "JFK", city: origin || "New York" },
          arrival: { time: "22:00", airport: "LAX", city: destination || "Los Angeles" },
          duration: "5h 30m",
          price: 279,
          stops: 0,
          aircraft: "Airbus A321",
        },
      ]
      setFlights(mockFlights)
      setLoading(false)
    }, 1000)
  }, [origin, destination])

  const handleBookFlight = (flightId: string) => {
    const selectedFlight = flights.find((f) => f.id === flightId)
    if (selectedFlight) {
      const bookingParams = new URLSearchParams({
        flightId,
        passengers: passengers || "1",
        flightData: JSON.stringify(selectedFlight),
      })
      router.push(`/booking?${bookingParams.toString()}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Plane className="h-12 w-12 animate-bounce mx-auto mb-4 text-blue-600" />
          <p className="text-lg">Searching for flights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
            <div className="flex items-center space-x-2">
              <Plane className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">FlightBooker</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-semibold">{origin}</p>
                  <p className="text-sm text-gray-600">From</p>
                </div>
                <Plane className="h-5 w-5 text-blue-600" />
                <div className="text-center">
                  <p className="font-semibold">{destination}</p>
                  <p className="text-sm text-gray-600">To</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {departureDate && format(new Date(departureDate), "MMM dd, yyyy")}
                </div>
                <div>
                  {passengers} passenger{passengers !== "1" ? "s" : ""}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{flights.length} flights found</h2>
          <div className="text-sm text-gray-600">Sorted by: Best value</div>
        </div>

        {/* Flight Results */}
        <div className="space-y-4">
          {flights.map((flight) => (
            <Card key={flight.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                  {/* Flight Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {flight.airline.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{flight.airline}</p>
                        <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{flight.departure.time}</p>
                        <p className="text-sm text-gray-600">{flight.departure.airport}</p>
                        <p className="text-xs text-gray-500">{flight.departure.city}</p>
                      </div>

                      <div className="flex-1 mx-4">
                        <div className="flex items-center justify-center relative">
                          <div className="w-full h-px bg-gray-300"></div>
                          <Plane className="h-4 w-4 text-gray-400 bg-white px-1" />
                        </div>
                        <div className="text-center mt-1">
                          <p className="text-sm text-gray-600">{flight.duration}</p>
                          {flight.stops === 0 ? (
                            <Badge variant="secondary" className="text-xs">
                              Direct
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              {flight.stops} stop{flight.stops > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-bold">{flight.arrival.time}</p>
                        <p className="text-sm text-gray-600">{flight.arrival.airport}</p>
                        <p className="text-xs text-gray-500">{flight.arrival.city}</p>
                      </div>
                    </div>
                  </div>

                  <Separator orientation="vertical" className="hidden lg:block" />

                  {/* Price and Book */}
                  <div className="text-center lg:text-right">
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-green-600">${flight.price}</p>
                      <p className="text-sm text-gray-600">per person</p>
                    </div>
                    <Button
                      onClick={() => handleBookFlight(flight.id)}
                      className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600"
                    >
                      Book Now
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">{flight.aircraft}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
