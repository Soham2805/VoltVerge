"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Zap, MapPin, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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

interface StationListProps {
  stations: Station[]
  onStationSelect?: (station: Station) => void
  selectedStationId?: number | null
  onBookStation?: (stationId: number) => void
  onViewDetails?: (station: Station) => void
}

export default function StationList({
  stations,
  onStationSelect,
  selectedStationId,
  onBookStation,
  onViewDetails,
}: StationListProps) {
  return (
    <div className="space-y-3 pb-4">
      {stations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No stations found matching your criteria.</div>
      ) : (
        stations.map((station) => (
          <Card
            key={station.id}
            className={cn(
              "station-card transition-all cursor-pointer animate-fade-in backdrop-blur-sm",
              station.available
                ? "station-card-available bg-gradient-to-r from-background to-primary/5"
                : "station-card-unavailable bg-gradient-to-r from-background to-destructive/5",
              selectedStationId === station.id ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md",
            )}
            onClick={() => onStationSelect?.(station)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium flex items-center gap-1">
                    <Zap className="h-4 w-4 text-primary" />
                    {station.name}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <MapPin className="h-3 w-3" />
                    {station.address}
                  </div>
                </div>
                <Badge
                  variant={station.available ? "success" : "destructive"}
                  className={cn("ml-2 shadow-sm", station.available ? "shadow-green-500/20" : "shadow-red-500/20")}
                >
                  {station.available ? "Available" : "In Use"}
                </Badge>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Type:</span> {station.type}
                </div>
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
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {station.connectors.map((connector) => (
                  <Badge
                    key={connector}
                    variant="outline"
                    className="text-xs connector-badge border-primary/20 bg-primary/5"
                  >
                    {connector}
                  </Badge>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {station.amenities.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs bg-secondary/50">
                    {amenity}
                  </Badge>
                ))}
                {station.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-secondary/50">
                    +{station.amenities.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-muted-foreground">{station.distance} km away</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-primary/20 hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewDetails?.(station)
                    }}
                  >
                    <BarChart3 className="h-3 w-3" />
                    Details
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    onClick={(e) => {
                      e.stopPropagation()
                      onBookStation?.(station.id)
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
