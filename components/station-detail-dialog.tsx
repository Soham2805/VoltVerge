"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Zap, MapPin, BarChart3, Clock, Info, Sparkles } from "lucide-react"
import StationAnalytics from "./station-analytics"
import { useState } from "react"

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

interface StationDetailDialogProps {
  station: Station
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookStation: (stationId: number) => void
}

export default function StationDetailDialog({ station, open, onOpenChange, onBookStation }: StationDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("details")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-md border-primary/20">
        <DialogHeader className="bg-gradient-to-r from-primary/10 to-transparent p-4 -m-4 mb-0 rounded-t-lg">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            {station.name}
          </DialogTitle>
          <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {station.address}
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 bg-background/10 backdrop-blur-sm border border-primary/20">
            <TabsTrigger value="details" className="flex items-center gap-1 data-[state=active]:bg-primary/20">
              <Info className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 data-[state=active]:bg-primary/20">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={station.available ? "success" : "destructive"}
                className={`shadow-sm ${station.available ? "shadow-green-500/20" : "shadow-red-500/20"}`}
              >
                {station.available ? "Available" : "In Use"}
              </Badge>
              <span className="text-sm">{station.type}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Power:</span>
                <span className="flex items-center">
                  {station.power}
                  <Zap className="h-3 w-3 ml-0.5 text-primary" />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Price:</span> {station.price}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Rating:</span>
                <div className="flex items-center">
                  {station.rating}
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-0.5" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Distance:</span> {station.distance} km
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                Connectors
              </h3>
              <div className="flex flex-wrap gap-1">
                {station.connectors.map((connector) => (
                  <Badge
                    key={connector}
                    variant="outline"
                    className="text-xs connector-badge border-primary/20 bg-primary/5 hover:bg-primary/10"
                  >
                    {connector}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                Amenities
              </h3>
              <div className="flex flex-wrap gap-1">
                {station.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs bg-secondary/50 hover:bg-secondary/70">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            {!station.available && (
              <div className="flex items-center gap-2 p-3 bg-destructive/5 rounded-md border border-destructive/20">
                <Clock className="h-5 w-5 text-destructive/70" />
                <div>
                  <h3 className="text-sm font-medium">Currently In Use</h3>
                  <p className="text-xs text-muted-foreground">
                    Estimated wait time: {station.id === 3 ? "25 minutes" : station.id === 7 ? "18 minutes" : "Unknown"}
                  </p>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={() => onBookStation(station.id)}
            >
              Book Now
            </Button>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <StationAnalytics stationId={station.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
