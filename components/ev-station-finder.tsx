"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { DivIcon } from "leaflet"
import { Search, ChevronDown, Zap, MapPin, Locate, BatteryCharging, Info, Filter, X, BarChart3 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import StationList from "./station-list"
import StationDetailDialog from "./station-detail-dialog"
import BookingDialog from "./booking-dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/use-auth"

// Custom bolt marker icons for available and unavailable stations
const createBoltMarker = (available: boolean) => {
  const color = available ? "hsl(142, 70%, 50%)" : "hsl(0, 84%, 60%)"
  const pulseColor = available ? "rgba(22, 163, 74, 0.3)" : "rgba(220, 38, 38, 0.3)"

  return new DivIcon({
    className: "bolt-marker",
    html: `
      <div class="relative">
        <div class="absolute top-0 left-0 w-10 h-10 rounded-full ${available ? "bg-green-500/20" : "bg-red-500/20"} animate-pulse-slow"></div>
        <div class="relative z-10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-lg">
            <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" fill="${color}" stroke="${color}" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

const userLocationIcon = new DivIcon({
  className: "user-location-marker",
  html: `
    <div class="relative">
      <div class="absolute top-0 left-0 w-8 h-8 rounded-full bg-blue-500/20 animate-ping"></div>
      <div class="relative z-10 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
    </div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

// Sample EV station data for Maharashtra, India
const sampleStations = [
  {
    id: 1,
    name: "VoltVerge Central Mumbai",
    address: "123 Marine Drive, Mumbai, Maharashtra",
    lat: 18.9442,
    lng: 72.8234,
    type: "Fast Charger",
    available: true,
    power: "150kW",
    price: "₹18/kWh",
    connectors: ["CCS", "CHAdeMO"],
    rating: 4.5,
    amenities: ["Restrooms", "Coffee Shop", "WiFi"],
    distance: 0.5,
  },
  {
    id: 2,
    name: "Powerhub Bandra",
    address: "456 Linking Road, Bandra, Mumbai",
    lat: 19.0596,
    lng: 72.8295,
    type: "Level 2",
    available: true,
    power: "22kW",
    price: "₹15/kWh",
    connectors: ["Type 2"],
    rating: 4.2,
    amenities: ["Restrooms", "Parking"],
    distance: 1.2,
  },
  {
    id: 3,
    name: "ElectroCharge Worli",
    address: "789 Worli Sea Face, Mumbai",
    lat: 19.0234,
    lng: 72.8151,
    type: "Supercharger",
    available: false,
    power: "250kW",
    price: "₹22/kWh",
    connectors: ["Tesla"],
    rating: 4.8,
    amenities: ["Restrooms", "Shopping", "Dining", "WiFi"],
    distance: 2.3,
  },
  {
    id: 4,
    name: "GreenVolt Andheri",
    address: "321 Andheri East, Mumbai",
    lat: 19.1136,
    lng: 72.8697,
    type: "Level 2",
    available: true,
    power: "19kW",
    price: "₹14/kWh",
    connectors: ["Type 2", "J1772"],
    rating: 3.9,
    amenities: ["Parking"],
    distance: 1.8,
  },
  {
    id: 5,
    name: "PowerStation Dadar",
    address: "654 Dadar West, Mumbai",
    lat: 19.0178,
    lng: 72.8478,
    type: "Fast Charger",
    available: true,
    power: "100kW",
    price: "₹17/kWh",
    connectors: ["CCS", "CHAdeMO", "Type 2"],
    rating: 4.1,
    amenities: ["Restrooms", "Dining", "WiFi"],
    distance: 1.5,
  },
  {
    id: 6,
    name: "VoltVerge Pune Central",
    address: "MG Road, Pune, Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    type: "Level 2",
    available: true,
    power: "22kW",
    price: "₹16/kWh",
    connectors: ["J1772", "Type 2"],
    rating: 4.3,
    amenities: ["Restrooms", "Park", "WiFi"],
    distance: 2.7,
  },
  {
    id: 7,
    name: "ElectroHub Nagpur",
    address: "Civil Lines, Nagpur, Maharashtra",
    lat: 21.1458,
    lng: 79.0882,
    type: "Fast Charger",
    available: false,
    power: "150kW",
    price: "₹19/kWh",
    connectors: ["CCS", "CHAdeMO"],
    rating: 4.0,
    amenities: ["Parking", "WiFi", "Coffee Shop"],
    distance: 3.1,
  },
  {
    id: 8,
    name: "PowerDrive Nashik",
    address: "College Road, Nashik, Maharashtra",
    lat: 19.9975,
    lng: 73.7898,
    type: "Fast Charger",
    available: true,
    power: "120kW",
    price: "₹18/kWh",
    connectors: ["CCS", "Type 2"],
    rating: 4.2,
    amenities: ["Restrooms", "Shopping", "Dining"],
    distance: 2.9,
  },
  {
    id: 9,
    name: "VoltVerge Aurangabad",
    address: "Jalna Road, Aurangabad, Maharashtra",
    lat: 19.8762,
    lng: 75.3433,
    type: "Level 2",
    available: true,
    power: "22kW",
    price: "₹15/kWh",
    connectors: ["Type 2"],
    rating: 3.8,
    amenities: ["Parking", "WiFi"],
    distance: 3.5,
  },
]

// Types for our stations and filters
type Station = (typeof sampleStations)[0]
type StationType = "Fast Charger" | "Level 2" | "Supercharger"
type ConnectorType = "CCS" | "CHAdeMO" | "Type 2" | "J1772" | "Tesla"
type AmenityType = "Restrooms" | "WiFi" | "Coffee Shop" | "Dining" | "Shopping" | "Parking" | "Park"

// Component to recenter map when user location changes
function RecenterMap({ position }: { position: [number, number] | null }) {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.setView(position, 13)
    }
  }, [position, map])

  return null
}

export default function EVStationFinder() {
  const [stations, setStations] = useState<Station[]>(sampleStations)
  const [filteredStations, setFilteredStations] = useState<Station[]>(stations)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<StationType[]>([])
  const [selectedConnectors, setSelectedConnectors] = useState<ConnectorType[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityType[]>([])
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [maxDistance, setMaxDistance] = useState(10)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([18.9442, 72.8234]) // Mumbai coordinates
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("map")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const { user } = useAuth()

  // Get user location on component mount with better error handling
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Default to Mumbai coordinates if geolocation fails
    const defaultLocation: [number, number] = [18.9442, 72.8234]
    setMapCenter(defaultLocation)

    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setUserLocation([latitude, longitude])
            setMapCenter([latitude, longitude])
          },
          (error) => {
            console.log("Geolocation permission denied or unavailable:", error.message)
            // Just use the default location, already set above
          },
          { timeout: 5000, enableHighAccuracy: false },
        )
      } catch (error) {
        console.log("Geolocation error:", error)
        // Just use the default location, already set above
      }
    } else {
      console.log("Geolocation is not supported by this browser")
      // Just use the default location, already set above
    }

    return () => clearTimeout(timer)
  }, [])

  // Apply filters when they change
  useEffect(() => {
    let results = stations

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (station) => station.name.toLowerCase().includes(query) || station.address.toLowerCase().includes(query),
      )
    }

    // Filter by station type
    if (selectedTypes.length > 0) {
      results = results.filter((station) => selectedTypes.includes(station.type as StationType))
    }

    // Filter by connector type
    if (selectedConnectors.length > 0) {
      results = results.filter((station) =>
        station.connectors.some((connector) => selectedConnectors.includes(connector as ConnectorType)),
      )
    }

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      results = results.filter((station) =>
        station.amenities.some((amenity) => selectedAmenities.includes(amenity as AmenityType)),
      )
    }

    // Filter by availability
    if (showAvailableOnly) {
      results = results.filter((station) => station.available)
    }

    // Filter by distance
    results = results.filter((station) => station.distance <= maxDistance)

    setFilteredStations(results)
  }, [searchQuery, selectedTypes, selectedConnectors, selectedAmenities, showAvailableOnly, maxDistance, stations])

  // Toggle station type filter
  const toggleStationType = (type: StationType) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  // Toggle connector type filter
  const toggleConnectorType = (connector: ConnectorType) => {
    setSelectedConnectors((prev) =>
      prev.includes(connector) ? prev.filter((c) => c !== connector) : [...prev, connector],
    )
  }

  // Toggle amenity filter
  const toggleAmenityType = (amenity: AmenityType) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedTypes([])
    setSelectedConnectors([])
    setSelectedAmenities([])
    setShowAvailableOnly(false)
    setMaxDistance(10)
  }

  // Try to get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setMapCenter([latitude, longitude])
        },
        (error) => {
          console.log("Geolocation error:", error)
          alert("Could not get your location. Please check your browser permissions.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  // Select a station
  const handleStationSelect = (station: Station) => {
    setSelectedStation(station)
    setMapCenter([station.lat, station.lng])
    if (window.innerWidth < 768) {
      setActiveTab("map")
    }
  }

  // Open station details dialog
  const handleOpenStationDetails = (station: Station) => {
    setSelectedStation(station)
    setIsDetailDialogOpen(true)
  }

  // Book a station
  const handleBookStation = (stationId: number) => {
    if (!user) {
      alert("Please login to book a charging station.")
      return
    }

    const station = stations.find((s) => s.id === stationId)
    if (station) {
      setSelectedStation(station)
      setIsBookingDialogOpen(true)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background dark:bg-gray-950">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background dark:bg-gray-950 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
              <BatteryCharging className="h-16 w-16 text-primary relative z-10" />
            </div>
            <h2 className="text-xl font-semibold animate-pulse">Initializing VoltVerge Network...</h2>
          </div>
        </div>
      )}

      {/* Station detail dialog */}
      {selectedStation && (
        <StationDetailDialog
          station={selectedStation}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          onBookStation={handleBookStation}
        />
      )}

      {/* Booking dialog */}
      {selectedStation && (
        <BookingDialog station={selectedStation} open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen} />
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile tabs */}
        <div className="flex flex-col flex-1">
          <Tabs
            defaultValue="map"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col md:hidden"
          >
            <TabsList className="grid grid-cols-2 mx-4 mt-2 bg-background/10 backdrop-blur-sm border border-primary/20">
              <TabsTrigger value="map" className="flex items-center gap-1 data-[state=active]:bg-primary/20">
                <MapPin className="h-4 w-4" />
                Map
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1 data-[state=active]:bg-primary/20">
                <Info className="h-4 w-4" />
                List ({filteredStations.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="map" className="flex-1 p-0 m-0">
              <div className="h-full">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={false}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredStations.map((station) => (
                    <Marker
                      key={station.id}
                      position={[station.lat, station.lng]}
                      icon={createBoltMarker(station.available)}
                      eventHandlers={{
                        click: () => {
                          setSelectedStation(station)
                        },
                      }}
                    >
                      <Popup className="station-popup">
                        <div className="p-1">
                          <h3 className="font-bold flex items-center gap-1">
                            <Zap className="h-4 w-4 text-primary" />
                            {station.name}
                          </h3>
                          <p className="text-sm">{station.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={station.available ? "success" : "destructive"}
                              className="shadow-sm shadow-primary/20"
                            >
                              {station.available ? "Available" : "In Use"}
                            </Badge>
                            <span className="text-xs">{station.type}</span>
                          </div>
                          <div className="mt-1 text-xs">
                            <p>Power: {station.power}</p>
                            <p>Price: {station.price}</p>
                            <p>Connectors: {station.connectors.join(", ")}</p>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                              onClick={() => handleBookStation(station.id)}
                            >
                              Book Now
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 border-primary/20 hover:bg-primary/10"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenStationDetails(station)
                              }}
                            >
                              <BarChart3 className="h-3 w-3" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  {userLocation && (
                    <Marker position={userLocation} icon={userLocationIcon}>
                      <Popup>Your Location</Popup>
                    </Marker>
                  )}
                  <RecenterMap position={mapCenter} />
                </MapContainer>
              </div>
            </TabsContent>
            <TabsContent value="list" className="flex-1 p-0 m-0 overflow-y-auto">
              <div className="p-4">
                <StationList
                  stations={filteredStations}
                  onStationSelect={handleStationSelect}
                  selectedStationId={selectedStation?.id}
                  onBookStation={handleBookStation}
                  onViewDetails={handleOpenStationDetails}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Desktop map (always visible) */}
          <div className="hidden md:block flex-1 relative">
            <div className="absolute inset-0">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredStations.map((station) => (
                  <Marker
                    key={station.id}
                    position={[station.lat, station.lng]}
                    icon={createBoltMarker(station.available)}
                    eventHandlers={{
                      click: () => {
                        setSelectedStation(station)
                      },
                    }}
                  >
                    <Popup className="station-popup">
                      <div className="p-1">
                        <h3 className="font-bold flex items-center gap-1">
                          <Zap className="h-4 w-4 text-primary" />
                          {station.name}
                        </h3>
                        <p className="text-sm">{station.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={station.available ? "success" : "destructive"}
                            className="shadow-sm shadow-primary/20"
                          >
                            {station.available ? "Available" : "In Use"}
                          </Badge>
                          <span className="text-xs">{station.type}</span>
                        </div>
                        <div className="mt-1 text-xs">
                          <p>Power: {station.power}</p>
                          <p>Price: {station.price}</p>
                          <p>Connectors: {station.connectors.join(", ")}</p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            onClick={() => handleBookStation(station.id)}
                          >
                            Book Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 border-primary/20 hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenStationDetails(station)
                            }}
                          >
                            <BarChart3 className="h-3 w-3" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {userLocation && (
                  <Marker position={userLocation} icon={userLocationIcon}>
                    <Popup>Your Location</Popup>
                  </Marker>
                )}
                <RecenterMap position={mapCenter} />
              </MapContainer>
            </div>

            {/* Locate me button */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 z-10 shadow-lg bg-background/80 backdrop-blur-sm border border-primary/20 hover:bg-background/90"
              onClick={getUserLocation}
            >
              <Locate className="h-4 w-4 mr-2" />
              Locate Me
            </Button>
          </div>
        </div>

        {/* Right sidebar (desktop) */}
        <div
          className={`hidden md:block w-80 border-l border-primary/20 overflow-y-auto animate-fade-in transition-all duration-300 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } absolute top-0 right-0 bottom-0 bg-background/90 backdrop-blur-md z-20 shadow-lg`}
        >
          <div className="p-4 border-b border-primary/20">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search stations or addresses..."
                className="pl-9 bg-background/50 border-primary/20 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-1">
                <Filter className="h-4 w-4 text-primary" />
                Filters
              </h2>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="hover:bg-primary/10">
                Reset
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Station Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between border-primary/20 hover:bg-primary/10">
                  Station Type
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/90 backdrop-blur-md border-primary/20">
                <DropdownMenuCheckboxItem
                  checked={selectedTypes.includes("Fast Charger")}
                  onCheckedChange={() => toggleStationType("Fast Charger")}
                >
                  Fast Charger
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedTypes.includes("Level 2")}
                  onCheckedChange={() => toggleStationType("Level 2")}
                >
                  Level 2
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedTypes.includes("Supercharger")}
                  onCheckedChange={() => toggleStationType("Supercharger")}
                >
                  Supercharger
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Connector Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between border-primary/20 hover:bg-primary/10">
                  Connector Type
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/90 backdrop-blur-md border-primary/20">
                <DropdownMenuCheckboxItem
                  checked={selectedConnectors.includes("CCS")}
                  onCheckedChange={() => toggleConnectorType("CCS")}
                >
                  CCS
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedConnectors.includes("CHAdeMO")}
                  onCheckedChange={() => toggleConnectorType("CHAdeMO")}
                >
                  CHAdeMO
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedConnectors.includes("Type 2")}
                  onCheckedChange={() => toggleConnectorType("Type 2")}
                >
                  Type 2
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedConnectors.includes("J1772")}
                  onCheckedChange={() => toggleConnectorType("J1772")}
                >
                  J1772
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedConnectors.includes("Tesla")}
                  onCheckedChange={() => toggleConnectorType("Tesla")}
                >
                  Tesla
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Amenities Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between border-primary/20 hover:bg-primary/10">
                  Amenities
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/90 backdrop-blur-md border-primary/20">
                {["Restrooms", "WiFi", "Coffee Shop", "Dining", "Shopping", "Parking", "Park"].map((amenity) => (
                  <DropdownMenuCheckboxItem
                    key={amenity}
                    checked={selectedAmenities.includes(amenity as AmenityType)}
                    onCheckedChange={() => toggleAmenityType(amenity as AmenityType)}
                  >
                    {amenity}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Availability Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="available"
                checked={showAvailableOnly}
                onChange={() => setShowAvailableOnly(!showAvailableOnly)}
                className="rounded border-primary/20"
              />
              <label htmlFor="available" className="text-sm font-medium">
                Show available only
              </label>
            </div>

            {/* Distance Filter */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Max Distance</label>
                <span className="text-sm text-muted-foreground">{maxDistance} km</span>
              </div>
              <Slider
                value={[maxDistance]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setMaxDistance(value[0])}
                className="[&>span]:bg-primary"
              />
            </div>

            {/* Applied filters */}
            <div className="flex flex-wrap gap-2">
              {selectedTypes.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="flex items-center gap-1 bg-primary/10 border-primary/20"
                >
                  {type}
                  <button
                    onClick={() => toggleStationType(type)}
                    className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedConnectors.map((connector) => (
                <Badge
                  key={connector}
                  variant="secondary"
                  className="flex items-center gap-1 bg-primary/10 border-primary/20"
                >
                  {connector}
                  <button
                    onClick={() => toggleConnectorType(connector)}
                    className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedAmenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="flex items-center gap-1 bg-primary/10 border-primary/20"
                >
                  {amenity}
                  <button
                    onClick={() => toggleAmenityType(amenity)}
                    className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {showAvailableOnly && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-primary/10 border-primary/20">
                  Available Only
                  <button
                    onClick={() => setShowAvailableOnly(false)}
                    className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>

          {/* Station list */}
          <div className="p-4 border-t border-primary/20">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-1">
              <Zap className="h-4 w-4 text-primary" />
              Stations ({filteredStations.length})
            </h2>
            <StationList
              stations={filteredStations}
              onStationSelect={handleStationSelect}
              selectedStationId={selectedStation?.id}
              onBookStation={handleBookStation}
              onViewDetails={handleOpenStationDetails}
            />
          </div>
        </div>

        {/* Mobile sidebar */}
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-primary-foreground/20 text-primary-foreground fixed bottom-4 right-4 z-10 md:hidden bg-primary/90 backdrop-blur-sm shadow-lg hover:bg-primary/80"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[85%] sm:w-[350px] p-0 bg-background/90 backdrop-blur-md border-primary/20"
          >
            <div className="p-4 border-b border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-1">
                  <Filter className="h-4 w-4 text-primary" />
                  Filters
                </h2>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="hover:bg-primary/10">
                  Reset All
                </Button>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search stations or addresses..."
                  className="pl-9 bg-background/50 border-primary/20 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-10rem)] p-4">
              <div className="space-y-6">
                {/* Station Type Filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Station Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Fast Charger", "Level 2", "Supercharger"].map((type) => (
                      <Badge
                        key={type}
                        variant={selectedTypes.includes(type as StationType) ? "default" : "outline"}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => toggleStationType(type as StationType)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Connector Type Filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Connector Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {["CCS", "CHAdeMO", "Type 2", "J1772", "Tesla"].map((connector) => (
                      <Badge
                        key={connector}
                        variant={selectedConnectors.includes(connector as ConnectorType) ? "default" : "outline"}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => toggleConnectorType(connector as ConnectorType)}
                      >
                        {connector}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Restrooms", "WiFi", "Coffee Shop", "Dining", "Shopping", "Parking", "Park"].map((amenity) => (
                      <Badge
                        key={amenity}
                        variant={selectedAmenities.includes(amenity as AmenityType) ? "default" : "outline"}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => toggleAmenityType(amenity as AmenityType)}
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="available-mobile"
                    checked={showAvailableOnly}
                    onChange={() => setShowAvailableOnly(!showAvailableOnly)}
                    className="rounded border-primary/20"
                  />
                  <label htmlFor="available-mobile" className="text-sm font-medium">
                    Show available only
                  </label>
                </div>

                {/* Distance Filter */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Max Distance</label>
                    <span className="text-sm text-muted-foreground">{maxDistance} km</span>
                  </div>
                  <Slider
                    value={[maxDistance]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(value) => setMaxDistance(value[0])}
                    className="[&>span]:bg-primary"
                  />
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
