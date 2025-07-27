"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Plane, Download, Mail, Calendar, MapPin, Users } from "lucide-react"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const confirmationData = searchParams.get("data")
  const booking = confirmationData ? JSON.parse(confirmationData) : null

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Booking information not found</p>
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
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Plane className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">FlightBooker</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your flight has been successfully booked. A confirmation email has been sent to {booking.contact.email}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                <p className="text-2xl font-bold text-blue-600">{booking.bookingReference}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Flight Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Airline:</span>
                    <span className="font-medium">{booking.flight.airline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Flight Number:</span>
                    <span className="font-medium">{booking.flight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Aircraft:</span>
                    <span className="font-medium">{booking.flight.aircraft}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Route & Schedule
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{booking.flight.departure.time}</p>
                    <p className="text-sm text-gray-600">{booking.flight.departure.airport}</p>
                    <p className="text-xs text-gray-500">{booking.flight.departure.city}</p>
                  </div>

                  <div className="flex-1 mx-4">
                    <div className="flex items-center justify-center relative">
                      <div className="w-full h-px bg-gray-300"></div>
                      <Plane className="h-4 w-4 text-gray-400 bg-white px-1" />
                    </div>
                    <div className="text-center mt-1">
                      <p className="text-sm text-gray-600">{booking.flight.duration}</p>
                      {booking.flight.stops === 0 ? (
                        <Badge variant="secondary" className="text-xs">
                          Direct
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {booking.flight.stops} stop{booking.flight.stops > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold">{booking.flight.arrival.time}</p>
                    <p className="text-sm text-gray-600">{booking.flight.arrival.airport}</p>
                    <p className="text-xs text-gray-500">{booking.flight.arrival.city}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passenger Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Passenger Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.passengers.map((passenger: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">
                        {passenger.firstName} {passenger.lastName}
                      </p>
                      <p className="text-sm text-gray-600">Age: {passenger.age}</p>
                      <p className="text-sm text-gray-600">Passport: {passenger.passportNumber}</p>
                    </div>
                    <Badge variant="outline">Seat {passenger.seat}</Badge>
                  </div>
                </div>
              ))}

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-gray-600">Email:</span> {booking.contact.email}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Phone:</span> {booking.contact.phone}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Payment Summary</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Flight Cost:</span>
                    <span>${booking.flight.price * booking.passengers.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & Fees:</span>
                    <span>$45</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Paid:</span>
                    <span>${booking.totalPrice + 45}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download Ticket
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              Email Confirmation
            </Button>
            <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
              Book Another Flight
            </Button>
          </div>
        </div>

        {/* Important Information */}
        <Card className="max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Check-in</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Online check-in opens 24 hours before departure</li>
                  <li>• Arrive at airport 2 hours before domestic flights</li>
                  <li>• Arrive at airport 3 hours before international flights</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Baggage</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• 1 carry-on bag (22" x 14" x 9") included</li>
                  <li>• 1 personal item included</li>
                  <li>• Checked baggage fees may apply</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
