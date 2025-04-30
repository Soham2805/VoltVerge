"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Zap, CreditCard, CheckCircle } from "lucide-react"
import { format } from "date-fns"

type Station = {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  type: string
  available: boolean
  power: string
  price: string
  connectors: string[]
  rating: number
  amenities: string[]
  distance: number
}

interface BookingDialogProps {
  station: Station
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BookingDialog({ station, open, onOpenChange }: BookingDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("12:00")
  const [duration, setDuration] = useState("60")
  const [connector, setConnector] = useState(station.connectors[0] || "")
  const [currentStep, setCurrentStep] = useState(1)
  const [isPaymentComplete, setIsPaymentComplete] = useState(false)

  const estimatedCost = calculateEstimatedCost(station.price, Number.parseInt(duration))

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePayment = () => {
    // In a real app, this would integrate with Razorpay
    setTimeout(() => {
      setIsPaymentComplete(true)
    }, 1500)
  }

  const resetDialog = () => {
    setCurrentStep(1)
    setIsPaymentComplete(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-primary/10 to-transparent p-4 -m-4 mb-0 rounded-t-lg">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Book Charging Session
          </DialogTitle>
        </DialogHeader>

        {!isPaymentComplete ? (
          <div className="mt-4">
            <div className="flex justify-between mb-6">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex flex-col items-center ${currentStep === step ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-xs">{step === 1 ? "Details" : step === 2 ? "Review" : "Payment"}</span>
                </div>
              ))}
            </div>

            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">{station.name}</h3>
                  <p className="text-sm text-muted-foreground">{station.address}</p>
                  <Badge className="mt-2">{station.type}</Badge>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        className="mx-auto"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="time">Start Time</Label>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={`${i}:00`}>
                              {i < 10 ? `0${i}:00` : `${i}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="connector">Connector Type</Label>
                    <Select value={connector} onValueChange={setConnector}>
                      <SelectTrigger id="connector">
                        <SelectValue placeholder="Select connector" />
                      </SelectTrigger>
                      <SelectContent>
                        {station.connectors.map((conn) => (
                          <SelectItem key={conn} value={conn}>
                            {conn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full" onClick={handleNextStep}>
                  Continue
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-muted/20">
                  <h3 className="font-medium mb-2">Booking Summary</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Station:</span>
                      <span>{station.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{date ? format(date, "PPP") : "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connector:</span>
                      <span>{connector}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Estimated Cost:</span>
                      <span>{estimatedCost}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handlePreviousStep}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handleNextStep}>
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-muted/20">
                  <h3 className="font-medium mb-2">Payment Details</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Total Amount: <span className="font-medium text-foreground">{estimatedCost}</span>
                  </p>

                  <Tabs defaultValue="card">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="card">Credit Card</TabsTrigger>
                      <TabsTrigger value="upi">UPI</TabsTrigger>
                    </TabsList>

                    <TabsContent value="card" className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="name">Name on Card</Label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                    </TabsContent>

                    <TabsContent value="upi" className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input id="upiId" placeholder="name@upi" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handlePreviousStep}>
                    Back
                  </Button>
                  <Button className="flex-1 gap-2" onClick={handlePayment}>
                    <CreditCard className="h-4 w-4" />
                    Pay {estimatedCost}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground mb-6">Your charging session has been booked successfully.</p>

            <div className="border rounded-md p-4 bg-muted/20 w-full mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID:</span>
                  <span>
                    VV-
                    {Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Station:</span>
                  <span>{station.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span>
                    {date ? format(date, "PPP") : "Not selected"} at {time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{duration} minutes</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Amount Paid:</span>
                  <span>{estimatedCost}</span>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={resetDialog}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Helper function to calculate estimated cost
function calculateEstimatedCost(priceString: string, durationMinutes: number): string {
  // Extract the numeric part from the price string (e.g., "₹18/kWh" -> 18)
  const pricePerKwh = Number.parseFloat(priceString.replace(/[^\d.]/g, ""))

  // Estimate kWh based on duration (simplified calculation)
  // Assuming average charging rate of 40 kWh per hour
  const estimatedKwh = (durationMinutes / 60) * 40

  // Calculate total cost
  const totalCost = pricePerKwh * estimatedKwh

  return `₹${totalCost.toFixed(0)}`
}
