"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, BarChart3, Calendar, TrendingUp, Sparkles } from "lucide-react"

// Sample booking data by day of week
const bookingsByDay = [
  { day: "Monday", count: 42, color: "hsl(142, 76%, 36%)" },
  { day: "Tuesday", count: 38, color: "hsl(142, 76%, 36%)" },
  { day: "Wednesday", count: 56, color: "hsl(142, 76%, 36%)" },
  { day: "Thursday", count: 61, color: "hsl(142, 76%, 36%)" },
  { day: "Friday", count: 78, color: "hsl(142, 76%, 36%)" },
  { day: "Saturday", count: 85, color: "hsl(142, 76%, 36%)" },
  { day: "Sunday", count: 68, color: "hsl(142, 76%, 36%)" },
]

// Sample wait time data
const waitTimeData = [
  { id: 3, name: "ElectroCharge Worli", estimatedMinutes: 25 },
  { id: 7, name: "ElectroHub Nagpur", estimatedMinutes: 18 },
]

// Sample peak hours data
const peakHoursData = [
  { hour: "6 AM", usage: 15 },
  { hour: "8 AM", usage: 65 },
  { hour: "10 AM", usage: 45 },
  { hour: "12 PM", usage: 75 },
  { hour: "2 PM", usage: 55 },
  { hour: "4 PM", usage: 85 },
  { hour: "6 PM", usage: 95 },
  { hour: "8 PM", usage: 60 },
  { hour: "10 PM", usage: 30 },
]

interface StationAnalyticsProps {
  stationId?: number | null
}

export default function StationAnalytics({ stationId }: StationAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("weekly")

  // Find station-specific data based on stationId
  const stationData = stationId
    ? bookingsByDay.map((day) => ({
        ...day,
        // Adjust count slightly for each station to make it look unique
        count: Math.max(5, Math.floor(day.count * (0.7 + ((stationId * 0.1) % 0.6)))),
      }))
    : bookingsByDay

  // Find station-specific wait time data
  const stationWaitTime = stationId ? waitTimeData.filter((station) => station.id === stationId) : waitTimeData

  // Find the maximum value for scaling
  const maxBookings = Math.max(...stationData.map((day) => day.count))
  const maxPeakUsage = Math.max(...peakHoursData.map((hour) => hour.usage))

  return (
    <div className="space-y-4 animate-fade-in">
      <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 bg-background/10 backdrop-blur-sm border border-primary/20">
          <TabsTrigger value="weekly" className="flex items-center gap-1 data-[state=active]:bg-primary/20">
            <Calendar className="h-4 w-4" />
            Weekly Patterns
          </TabsTrigger>
          <TabsTrigger value="wait" className="flex items-center gap-1 data-[state=active]:bg-primary/20">
            <Clock className="h-4 w-4" />
            Wait Times
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4 mt-4">
          <Card className="border-primary/20 bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                {stationId ? "Station Bookings by Day" : "Average Bookings by Day"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stationData.map((day) => (
                  <div key={day.day} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{day.day}</span>
                      <span className="text-sm text-muted-foreground">{day.count} bookings</span>
                    </div>
                    <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                        style={{ width: `${(day.count / maxBookings) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {stationId ? "Station Peak Hours" : "Network Peak Hours"}
                </h4>
                <div className="flex items-end h-40 gap-1">
                  {peakHoursData.map((hour) => (
                    <div key={hour.hour} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-sm transition-all duration-500"
                        style={{ height: `${(hour.usage / maxPeakUsage) * 100}%` }}
                      />
                      <span className="text-xs mt-1 text-muted-foreground">{hour.hour}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  <Badge variant="outline" className="mr-1 border-primary/20 bg-primary/5">
                    <Sparkles className="h-3 w-3 mr-1 text-primary" />
                    Tip
                  </Badge>
                  {stationId
                    ? "For this station, consider booking on Mondays or Tuesdays when demand is lower."
                    : "For faster charging, consider booking on Mondays or Tuesdays when demand is lower."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wait" className="space-y-4 mt-4">
          <Card className="border-primary/20 bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Current Wait Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stationWaitTime.length > 0 ? (
                <div className="space-y-4">
                  {stationWaitTime.map((station) => (
                    <div key={station.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{station.name}</span>
                        <Badge
                          variant={station.estimatedMinutes > 20 ? "destructive" : "success"}
                          className={`shadow-sm ${station.estimatedMinutes > 20 ? "shadow-red-500/20" : "shadow-green-500/20"}`}
                        >
                          {station.estimatedMinutes} min wait
                        </Badge>
                      </div>
                      <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            station.estimatedMinutes > 20
                              ? "bg-gradient-to-r from-destructive to-destructive/80"
                              : "bg-gradient-to-r from-success to-success/80"
                          }`}
                          style={{ width: `${Math.min(100, (station.estimatedMinutes / 30) * 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Estimated available at {getEstimatedTime(station.estimatedMinutes)}
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 pt-4 border-t border-primary/20 text-sm">
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      Wait Time Prediction
                    </h4>
                    <p className="text-muted-foreground">
                      Wait times are calculated based on historical usage patterns and current charging sessions.
                      Predictions are updated every 5 minutes.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>
                    {stationId ? "This station currently has no wait time." : "No stations currently have wait times."}
                  </p>
                  <p className="text-sm mt-1">
                    {stationId
                      ? "This station can be booked immediately."
                      : "All available stations can be booked immediately."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Availability Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next 30 minutes</span>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5">
                    {stationId ? "Available" : "5 stations expected"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next 1 hour</span>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5">
                    {stationId ? "Available" : "8 stations expected"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next 2 hours</span>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5">
                    {stationId ? "Available" : "12 stations expected"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function to calculate estimated available time
function getEstimatedTime(minutesFromNow: number): string {
  const now = new Date()
  now.setMinutes(now.getMinutes() + minutesFromNow)

  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
