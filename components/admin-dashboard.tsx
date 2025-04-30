"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Zap,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
  Battery,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Sample station data
const initialStations = [
  {
    id: 1,
    name: "Downtown Fast Charger",
    location: "Mumbai Central",
    address: "123 Marine Drive, Mumbai, Maharashtra",
    type: "Fast Charger",
    status: "active",
    lastUpdated: "2 hours ago",
    connectors: ["CCS", "CHAdeMO"],
    power: "150kW",
    price: "₹18/kWh",
  },
  {
    id: 2,
    name: "Midtown Charging Hub",
    location: "Andheri",
    address: "456 Linking Road, Andheri, Mumbai",
    type: "Level 2",
    status: "active",
    lastUpdated: "5 hours ago",
    connectors: ["Type 2"],
    power: "22kW",
    price: "₹15/kWh",
  },
  {
    id: 3,
    name: "Uptown Supercharger",
    location: "Bandra",
    address: "789 Hill Road, Bandra, Mumbai",
    type: "Supercharger",
    status: "offline",
    lastUpdated: "1 day ago",
    connectors: ["Tesla"],
    power: "250kW",
    price: "₹22/kWh",
  },
  {
    id: 4,
    name: "Suburban Charging Station",
    location: "Thane",
    address: "456 Eastern Express Highway, Thane, Maharashtra",
    type: "Fast Charger",
    status: "active",
    lastUpdated: "12 hours ago",
    connectors: ["CCS", "Type 2"],
    power: "100kW",
    price: "₹17/kWh",
  },
  {
    id: 5,
    name: "Highway Express Charger",
    location: "Pune Expressway",
    address: "Mumbai-Pune Expressway, Km 45, Maharashtra",
    type: "Supercharger",
    status: "active",
    lastUpdated: "3 hours ago",
    connectors: ["CCS", "CHAdeMO", "Tesla"],
    power: "250kW",
    price: "₹20/kWh",
  },
]

// Sample user data
const initialUsers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    joined: "Jan 12, 2023",
    bookings: 24,
    status: "active",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@example.com",
    joined: "Mar 5, 2023",
    bookings: 18,
    status: "active",
  },
  {
    id: 3,
    name: "Amit Desai",
    email: "amit.desai@example.com",
    joined: "Apr 18, 2023",
    bookings: 7,
    status: "inactive",
  },
  {
    id: 4,
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    joined: "Feb 22, 2023",
    bookings: 15,
    status: "active",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    joined: "May 10, 2023",
    bookings: 3,
    status: "active",
  },
]

// Sample booking data
const initialBookings = [
  {
    id: "BK-1234",
    userId: 1,
    userName: "Rahul Sharma",
    stationId: 1,
    stationName: "Downtown Fast Charger",
    dateTime: "May 15, 2023 • 10:30 AM",
    duration: "45 minutes",
    status: "completed",
  },
  {
    id: "BK-1235",
    userId: 2,
    userName: "Priya Patel",
    stationId: 2,
    stationName: "Midtown Charging Hub",
    dateTime: "May 20, 2023 • 2:15 PM",
    duration: "60 minutes",
    status: "upcoming",
  },
  {
    id: "BK-1236",
    userId: 3,
    userName: "Amit Desai",
    stationId: 3,
    stationName: "Uptown Supercharger",
    dateTime: "May 18, 2023 • 4:00 PM",
    duration: "30 minutes",
    status: "cancelled",
  },
  {
    id: "BK-1237",
    userId: 4,
    userName: "Neha Gupta",
    stationId: 4,
    stationName: "Suburban Charging Station",
    dateTime: "May 19, 2023 • 11:45 AM",
    duration: "60 minutes",
    status: "completed",
  },
  {
    id: "BK-1238",
    userId: 5,
    userName: "Vikram Singh",
    stationId: 5,
    stationName: "Highway Express Charger",
    dateTime: "May 21, 2023 • 3:30 PM",
    duration: "45 minutes",
    status: "upcoming",
  },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [stations, setStations] = useState(initialStations)
  const [users, setUsers] = useState(initialUsers)
  const [bookings, setBookings] = useState(initialBookings)
  const [stationFilter, setStationFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [bookingFilter, setBookingFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddStationOpen, setIsAddStationOpen] = useState(false)
  const [isEditStationOpen, setIsEditStationOpen] = useState(false)
  const [isDeleteStationOpen, setIsDeleteStationOpen] = useState(false)
  const [currentStation, setCurrentStation] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Filter stations based on search query and status filter
  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = stationFilter === "all" || station.status === stationFilter
    return matchesSearch && matchesFilter
  })

  // Filter users based on search query and status filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = userFilter === "all" || user.status === userFilter
    return matchesSearch && matchesFilter
  })

  // Filter bookings based on search query and status filter
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = bookingFilter === "all" || booking.status === bookingFilter
    return matchesSearch && matchesFilter
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentStations = filteredStations.slice(indexOfFirstItem, indexOfLastItem)
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem)

  const totalStationsPages = Math.ceil(filteredStations.length / itemsPerPage)
  const totalUsersPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const totalBookingsPages = Math.ceil(filteredBookings.length / itemsPerPage)

  // Handle add station
  const handleAddStation = (newStation: any) => {
    const id = stations.length > 0 ? Math.max(...stations.map((s) => s.id)) + 1 : 1
    const stationWithId = { ...newStation, id, lastUpdated: "Just now" }
    setStations([...stations, stationWithId])
    setIsAddStationOpen(false)
    toast({
      title: "Success",
      description: "Station added successfully",
    })
  }

  // Handle edit station
  const handleEditStation = (updatedStation: any) => {
    setStations(
      stations.map((station) =>
        station.id === updatedStation.id ? { ...updatedStation, lastUpdated: "Just now" } : station,
      ),
    )
    setIsEditStationOpen(false)
    toast({
      title: "Success",
      description: "Station updated successfully",
    })
  }

  // Handle delete station
  const handleDeleteStation = (id: number) => {
    setStations(stations.filter((station) => station.id !== id))
    setIsDeleteStationOpen(false)
    toast({
      title: "Success",
      description: "Station deleted successfully",
    })
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar collapsible="icon" className="hidden md:flex">
          <SidebarHeader>
            <div className="flex h-16 items-center px-4">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">VoltVerge</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Panel</h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-foreground"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-foreground"
                >
                  <MapPin className="h-4 w-4" />
                  Stations
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-foreground"
                >
                  <Users className="h-4 w-4" />
                  Users
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-foreground"
                >
                  <Battery className="h-4 w-4" />
                  Bookings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-foreground"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </SidebarContent>
          <SidebarFooter>
            <div className="border-t border-border/40 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">{user?.email}</div>
                  <div className="text-xs text-muted-foreground">Admin</div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <div className="md:hidden flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">VoltVerge</span>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold">Admin Dashboard</h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="hidden md:block">
                  <span className="text-sm font-medium">{user?.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden border-primary/20 hover:bg-primary/10 hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-background border-b border-border/40 p-4">
              <nav className="grid gap-2">
                <Button variant="ghost" className="justify-start gap-2 hover:bg-primary/10 hover:text-foreground">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start gap-2 hover:bg-primary/10 hover:text-foreground">
                  <MapPin className="h-4 w-4" />
                  Stations
                </Button>
                <Button variant="ghost" className="justify-start gap-2 hover:bg-primary/10 hover:text-foreground">
                  <Users className="h-4 w-4" />
                  Users
                </Button>
                <Button variant="ghost" className="justify-start gap-2 hover:bg-primary/10 hover:text-foreground">
                  <Battery className="h-4 w-4" />
                  Bookings
                </Button>
                <Button variant="ghost" className="justify-start gap-2 hover:bg-primary/10 hover:text-foreground">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <div className="border-t border-border/40 mt-2 pt-2 flex justify-between items-center">
                  <div className="text-sm">
                    <div className="font-medium">{user?.email}</div>
                    <div className="text-xs text-muted-foreground">Admin</div>
                  </div>
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

          {/* Dashboard Content */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="grid gap-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Stations"
                  value={stations.length.toString()}
                  description="Across Maharashtra"
                  icon={<MapPin className="h-5 w-5" />}
                  trend={{ value: "+12%", direction: "up" }}
                />
                <StatsCard
                  title="Active Users"
                  value="3,842"
                  description="Last 30 days"
                  icon={<Users className="h-5 w-5" />}
                  trend={{ value: "+18%", direction: "up" }}
                />
                <StatsCard
                  title="Total Bookings"
                  value="12,568"
                  description="All time"
                  icon={<Battery className="h-5 w-5" />}
                  trend={{ value: "+8%", direction: "up" }}
                />
                <StatsCard
                  title="Stations Offline"
                  value={stations.filter((s) => s.status === "offline").length.toString()}
                  description="Needs attention"
                  icon={<AlertTriangle className="h-5 w-5" />}
                  trend={{ value: "-2", direction: "down" }}
                  trendColor="success"
                />
              </div>

              {/* Tabs */}
              <Tabs defaultValue="stations" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:w-auto">
                  <TabsTrigger value="stations" className="data-[state=active]:bg-primary/20">
                    Stations
                  </TabsTrigger>
                  <TabsTrigger value="users" className="data-[state=active]:bg-primary/20">
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="bookings" className="data-[state=active]:bg-primary/20">
                    Bookings
                  </TabsTrigger>
                </TabsList>

                {/* Stations Tab */}
                <TabsContent value="stations" className="mt-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search stations..."
                        className="pl-9 bg-background/50 border-primary/20 focus-visible:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <Select value={stationFilter} onValueChange={setStationFilter}>
                        <SelectTrigger className="w-[180px] border-primary/20">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stations</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="gap-2" onClick={() => setIsAddStationOpen(true)}>
                        <PlusCircle className="h-4 w-4" />
                        Add Station
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle>Charging Stations</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentStations.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No stations found
                              </TableCell>
                            </TableRow>
                          ) : (
                            currentStations.map((station) => (
                              <TableRow key={station.id}>
                                <TableCell className="font-medium">{station.name}</TableCell>
                                <TableCell>{station.location}</TableCell>
                                <TableCell>{station.type}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      station.status === "active"
                                        ? "success"
                                        : station.status === "offline"
                                          ? "destructive"
                                          : "secondary"
                                    }
                                  >
                                    {station.status === "active"
                                      ? "Active"
                                      : station.status === "offline"
                                        ? "Offline"
                                        : "Maintenance"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{station.lastUpdated}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 border-primary/20 hover:bg-primary/10 hover:text-foreground"
                                      onClick={() => {
                                        setCurrentStation(station)
                                        setIsEditStationOpen(true)
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 border-primary/20 hover:bg-primary/10 hover:text-foreground"
                                      onClick={() => {
                                        setCurrentStation(station)
                                        setIsDeleteStationOpen(true)
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                    {totalStationsPages > 1 && (
                      <CardFooter className="flex items-center justify-between p-4 border-t border-border/40">
                        <div className="text-sm text-muted-foreground">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStations.length)} of{" "}
                          {filteredStations.length} entries
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalStationsPages}
                            className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="mt-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search users..."
                        className="pl-9 bg-background/50 border-primary/20 focus-visible:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={userFilter} onValueChange={setUserFilter} className="w-full md:w-auto">
                      <SelectTrigger className="w-[180px] border-primary/20">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle>Registered Users</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Bookings</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No users found
                              </TableCell>
                            </TableRow>
                          ) : (
                            currentUsers.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.joined}</TableCell>
                                <TableCell>{user.bookings}</TableCell>
                                <TableCell>
                                  <Badge variant={user.status === "active" ? "success" : "secondary"}>
                                    {user.status === "active" ? "Active" : "Inactive"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                                  >
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                    {totalUsersPages > 1 && (
                      <CardFooter className="flex items-center justify-between p-4 border-t border-border/40">
                        <div className="text-sm text-muted-foreground">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
                          {filteredUsers.length} entries
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalUsersPages}
                            className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="mt-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search bookings..."
                        className="pl-9 bg-background/50 border-primary/20 focus-visible:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={bookingFilter} onValueChange={setBookingFilter} className="w-full md:w-auto">
                      <SelectTrigger className="w-[180px] border-primary/20">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Bookings</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle>Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Station</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentBookings.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                No bookings found
                              </TableCell>
                            </TableRow>
                          ) : (
                            currentBookings.map((booking) => (
                              <TableRow key={booking.id}>
                                <TableCell className="font-medium">#{booking.id}</TableCell>
                                <TableCell>{booking.userName}</TableCell>
                                <TableCell>{booking.stationName}</TableCell>
                                <TableCell>{booking.dateTime}</TableCell>
                                <TableCell>{booking.duration}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      booking.status === "completed"
                                        ? "success"
                                        : booking.status === "cancelled"
                                          ? "destructive"
                                          : "secondary"
                                    }
                                  >
                                    {booking.status === "completed"
                                      ? "Completed"
                                      : booking.status === "cancelled"
                                        ? "Cancelled"
                                        : "Upcoming"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                                  >
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                    {totalBookingsPages > 1 && (
                      <CardFooter className="flex items-center justify-between p-4 border-t border-border/40">
                        <div className="text-sm text-muted-foreground">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBookings.length)} of{" "}
                          {filteredBookings.length} entries
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalBookingsPages}
                            className="border-primary/20 hover:bg-primary/10 hover:text-foreground"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Add Station Dialog */}
      <Dialog open={isAddStationOpen} onOpenChange={setIsAddStationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Charging Station</DialogTitle>
            <DialogDescription>Fill in the details to add a new charging station to the network.</DialogDescription>
          </DialogHeader>
          <StationForm onSubmit={handleAddStation} onCancel={() => setIsAddStationOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Station Dialog */}
      <Dialog open={isEditStationOpen} onOpenChange={setIsEditStationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Charging Station</DialogTitle>
            <DialogDescription>Update the details of this charging station.</DialogDescription>
          </DialogHeader>
          {currentStation && (
            <StationForm
              initialData={currentStation}
              onSubmit={handleEditStation}
              onCancel={() => setIsEditStationOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Station Dialog */}
      <Dialog open={isDeleteStationOpen} onOpenChange={setIsDeleteStationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Charging Station</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this charging station? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md bg-muted/20 mb-4">
            <p className="font-medium">{currentStation?.name}</p>
            <p className="text-sm text-muted-foreground">{currentStation?.location}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteStationOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => currentStation && handleDeleteStation(currentStation.id)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendColor = "default",
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: { value: string; direction: "up" | "down" }
  trendColor?: "default" | "success"
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold">{value}</h2>
              {trend && (
                <span
                  className={`flex items-center text-xs font-medium ${
                    trendColor === "success"
                      ? trend.direction === "up"
                        ? "text-destructive"
                        : "text-success"
                      : trend.direction === "up"
                        ? "text-success"
                        : "text-destructive"
                  }`}
                >
                  {trend.direction === "up" ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                  )}
                  {trend.value}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="rounded-full bg-primary/10 p-3">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function StationForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initialData?.name || "")
  const [location, setLocation] = useState(initialData?.location || "")
  const [address, setAddress] = useState(initialData?.address || "")
  const [type, setType] = useState(initialData?.type || "Fast Charger")
  const [status, setStatus] = useState(initialData?.status || "active")
  const [power, setPower] = useState(initialData?.power || "")
  const [price, setPrice] = useState(initialData?.price || "")
  const [connectors, setConnectors] = useState<string[]>(initialData?.connectors || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: initialData?.id,
      name,
      location,
      address,
      type,
      status,
      power,
      price,
      connectors,
    })
  }

  const toggleConnector = (connector: string) => {
    if (connectors.includes(connector)) {
      setConnectors(connectors.filter((c) => c !== connector))
    } else {
      setConnectors([...connectors, connector])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Station Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-primary/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="border-primary/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Full Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="border-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Station Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type" className="border-primary/20">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fast Charger">Fast Charger</SelectItem>
              <SelectItem value="Level 2">Level 2</SelectItem>
              <SelectItem value="Supercharger">Supercharger</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status" className="border-primary/20">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="power">Power Output</Label>
          <Input
            id="power"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            placeholder="e.g. 150kW"
            required
            className="border-primary/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price per kWh</Label>
        <Input
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. ₹18/kWh"
          required
          className="border-primary/20"
        />
      </div>

      <div className="space-y-2">
        <Label>Available Connectors</Label>
        <div className="flex flex-wrap gap-4">
          {["CCS", "CHAdeMO", "Type 2", "J1772", "Tesla"].map((connector) => (
            <div key={connector} className="flex items-center space-x-2">
              <Checkbox
                id={`connector-${connector}`}
                checked={connectors.includes(connector)}
                onCheckedChange={() => toggleConnector(connector)}
              />
              <Label htmlFor={`connector-${connector}`} className="font-normal">
                {connector}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          {initialData ? "Update Station" : "Add Station"}
        </Button>
      </DialogFooter>
    </form>
  )
}
