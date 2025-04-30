"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Car, CreditCard, LogOut, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import EVStationFinder from "@/components/ev-station-finder"

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">VoltVerge</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                Find Stations
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                My Bookings
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                Help
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                className="md:hidden border-primary/20 hover:bg-primary/10 hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-medium">{user?.email}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border/40 p-4">
          <nav className="flex flex-col gap-2">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors py-2">
              Find Stations
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors py-2">
              My Bookings
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors py-2">
              Help
            </a>
            <div className="border-t border-border/40 mt-2 pt-2 flex justify-between items-center">
              <span className="text-sm font-medium">{user?.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 container py-8">
        <Tabs defaultValue="map" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">User Dashboard</h1>
            <TabsList>
              <TabsTrigger value="map" className="data-[state=active]:bg-primary/20">
                Map
              </TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-primary/20">
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20">
                Profile
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="map" className="mt-0">
            <div className="h-[calc(100vh-12rem)]">
              <EVStationFinder />
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="mt-0">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>View and manage your charging station bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border/40 overflow-hidden">
                    <div className="bg-muted/30 p-4 text-sm font-medium grid grid-cols-5 gap-4">
                      <div>Station</div>
                      <div>Date & Time</div>
                      <div>Duration</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>
                    <div className="divide-y divide-border/40">
                      <div className="p-4 grid grid-cols-5 gap-4 items-center">
                        <div className="font-medium">Downtown Fast Charger</div>
                        <div className="text-sm">May 15, 2023 • 10:30 AM</div>
                        <div className="text-sm">45 minutes</div>
                        <div>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Completed
                          </span>
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                          >
                            View Receipt
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 grid grid-cols-5 gap-4 items-center">
                        <div className="font-medium">Midtown Charging Hub</div>
                        <div className="text-sm">May 20, 2023 • 2:15 PM</div>
                        <div className="text-sm">60 minutes</div>
                        <div>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            Upcoming
                          </span>
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="rounded-md border border-border/40 p-2 bg-muted/30">{user?.email}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="rounded-md border border-border/40 p-2 bg-muted/30">John Doe</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <div className="rounded-md border border-border/40 p-2 bg-muted/30">+91 98765 43210</div>
                  </div>
                  <Button className="w-full">Edit Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border border-border/40 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-muted/50 p-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">•••• •••• •••• 4242</div>
                        <div className="text-xs text-muted-foreground">Expires 12/25</div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-primary">Default</div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-primary/20 hover:bg-primary/10 hover:text-foreground"
                  >
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Your Vehicles</CardTitle>
                  <CardDescription>Manage your registered vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-md border border-border/40 p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="rounded-md bg-muted/50 p-2">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">Tesla Model 3</div>
                          <div className="text-xs text-muted-foreground">MH 01 AB 1234</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Connector:</span> Type 2
                        </div>
                        <div>
                          <span className="text-muted-foreground">Battery:</span> 75 kWh
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md border border-dashed border-border/40 p-4 flex flex-col items-center justify-center text-center">
                      <Car className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="font-medium">Add Vehicle</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Register your EV to get personalized charging recommendations
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 border-primary/20 hover:bg-primary/10 hover:text-foreground"
                      >
                        Add Vehicle
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
