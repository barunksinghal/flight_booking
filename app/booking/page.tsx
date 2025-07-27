"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plane, User } from "lucide-react"

interface PassengerInfo {
  firstName: string
  lastName: string
  age: string
  passportNumber: string
  seat: string
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const flightData = searchParams.get("flightData")
  const passengers = Number.parseInt(searchParams.get("passengers") || "1")

  const flight = flightData ? JSON.parse(flightData) : null

  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo[]>(
    Array.from({ length: passengers }, () => ({
      firstName: "",
      lastName: "",
      age: "",
      passportNumber: "",
      seat: "",
    })),
  )

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  })

  const [currentStep, setCurrentStep] = useState(1)

  const updatePassengerInfo = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengerInfo]
    updated[index] = { ...updated[index], [field]: value }
    setPassengerInfo(updated)
  }

  const handleContinue = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Generate booking reference and go to confirmation
      const bookingRef = "FB" + Math.random().toString(36).substr(2, 8).toUpperCase()
      const confirmationData = {
        bookingReference: bookingRef,
        flight,
        passengers: passengerInfo,
        contact: contactInfo,
        totalPrice: flight.price * passengers,
      }

      const confirmParams = new URLSearchParams({
        data: JSON.stringify(confirmationData),
      })
      router.push(`/confirmation?${confirmParams.toString()}`)
    }
  }

  const isStep1Valid =
    passengerInfo.every((p: { firstName: any; lastName: any; age: any; passportNumber: any }) => p.firstName && p.lastName && p.age && p.passportNumber) &&
    contactInfo.email &&
    contactInfo.phone

  const isStep2Valid = passengerInfo.every((p) => p.seat)

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Flight information not found</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Return to Home
          </Button>
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
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Plane className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">FlightBooker</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  1
                </div>
                <div className={`w-16 h-1 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  2
                </div>
                <div className={`w-16 h-1 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  3
                </div>
              </div>
            </div>

            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Passenger Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Passenger Details */}
                  {passengerInfo.map((passenger, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold mb-4">Passenger {index + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`firstName-${index}`}>First Name</Label>
                          <Input
                            id={`firstName-${index}`}
                            value={passenger.firstName}
                            onChange={(e) => updatePassengerInfo(index, "firstName", e.target.value)}
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                          <Input
                            id={`lastName-${index}`}
                            value={passenger.lastName}
                            onChange={(e) => updatePassengerInfo(index, "lastName", e.target.value)}
                            placeholder="Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`age-${index}`}>Age</Label>
                          <Input
                            id={`age-${index}`}
                            type="number"
                            value={passenger.age}
                            onChange={(e) => updatePassengerInfo(index, "age", e.target.value)}
                            placeholder="25"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`passport-${index}`}>Passport Number</Label>
                          <Input
                            id={`passport-${index}`}
                            value={passenger.passportNumber}
                            onChange={(e) => updatePassengerInfo(index, "passportNumber", e.target.value)}
                            placeholder="A12345678"
                          />
                        </div>
                      </div>
                      {index < passengerInfo.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}

                  <Button
                    onClick={handleContinue}
                    disabled={!isStep1Valid}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Continue to Seat Selection
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Seats</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Seat Map */}
                  <div className="mb-6">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="text-center mb-4">
                        <p className="font-semibold">{flight.aircraft}</p>
                        <p className="text-sm text-gray-600">Economy Class</p>
                      </div>

                      {/* Simple seat grid */}
                      <div className="grid grid-cols-6 gap-2 max-w-md mx-auto">
                        {Array.from({ length: 30 }, (_, i) => {
                          const seatNumber = `${Math.floor(i / 6) + 1}${String.fromCharCode(65 + (i % 6))}`
                          const isSelected = passengerInfo.some((p) => p.seat === seatNumber)
                          const isOccupied = Math.random() > 0.7 // Random occupied seats

                          return (
                            <button
                              key={seatNumber}
                              onClick={() => {
                                if (!isOccupied) {
                                  const availablePassenger = passengerInfo.findIndex((p) => !p.seat)
                                  if (availablePassenger !== -1) {
                                    updatePassengerInfo(availablePassenger, "seat", seatNumber)
                                  }
                                }
                              }}
                              disabled={isOccupied}
                              className={`w-8 h-8 text-xs rounded ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : isOccupied
                                    ? "bg-red-200 cursor-not-allowed"
                                    : "bg-green-200 hover:bg-green-300"
                              }`}
                            >
                              {seatNumber}
                            </button>
                          )
                        })}
                      </div>

                      <div className="flex justify-center gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-green-200 rounded"></div>
                          <span>Available</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-blue-600 rounded"></div>
                          <span>Selected</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-red-200 rounded"></div>
                          <span>Occupied</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Seats */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Selected Seats:</h3>
                    {passengerInfo.map((passenger, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <span>
                          {passenger.firstName} {passenger.lastName}
                        </span>
                        <Badge variant={passenger.seat ? "default" : "secondary"}>
                          {passenger.seat || "Not selected"}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleContinue}
                    disabled={!isStep2Valid}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Flight Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Flight Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {flight.airline.charAt(0)}
                    </div>
                    <span className="font-semibold">{flight.airline}</span>
                  </div>
                  <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Departure:</span>
                    <span className="text-sm font-medium">
                      {flight.departure.time} {flight.departure.airport}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Arrival:</span>
                    <span className="text-sm font-medium">
                      {flight.arrival.time} {flight.arrival.airport}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duration:</span>
                    <span className="text-sm font-medium">{flight.duration}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Base Price:</span>
                    <span className="text-sm">
                      ${flight.price} × {passengers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Taxes & Fees:</span>
                    <span className="text-sm">$45</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${flight.price * passengers + 45}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
