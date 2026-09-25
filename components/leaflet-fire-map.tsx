"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Fix Leaflet default icon issue
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  })
}

interface Hotspot {
  id: number
  location: string
  confidence: number
  detectionTime: string
  riskLevel: "Low" | "Medium" | "High"
  latitude: number
  longitude: number
  region: string
  detectionType?: "Fire" | "Smoke" | "No Fire"
}

interface LeafletFireMapProps {
  hotspots: Hotspot[]
  selectedHotspot: Hotspot | null
  onHotspotSelect: (hotspot: Hotspot) => void
  zoomTrigger?: number
}

// Component to handle map zoom
function MapController({ selectedHotspot, zoomTrigger }: { selectedHotspot: Hotspot | null; zoomTrigger: number }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedHotspot && zoomTrigger > 0) {
      // Small delay to ensure map is ready
      setTimeout(() => {
        try {
          map.flyTo(
            [selectedHotspot.latitude, selectedHotspot.longitude],
            13,
            {
              animate: true,
              duration: 1.5,
            }
          )
        } catch (error) {
          console.log("Map animation error:", error)
        }
      }, 100)
    }
  }, [selectedHotspot, zoomTrigger, map])
  
  return null
}

// Custom marker icons
const createCustomIcon = (riskLevel: string, isSelected: boolean) => {
  const colors = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#10b981",
  }
  
  const color = colors[riskLevel as keyof typeof colors] || "#64748b"
  const size = isSelected ? 32 : 24
  const pulseSize = isSelected ? 48 : 36
  
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        ${isSelected ? `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${pulseSize}px;
            height: ${pulseSize}px;
            background-color: ${color};
            border-radius: 50%;
            opacity: 0.3;
            animation: pulse 1.5s ease-out infinite;
          "></div>
        ` : ''}
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          ${isSelected ? 'animation: bounce 0.5s ease-out;' : ''}
        ">
          <div style="
            width: ${size / 3}px;
            height: ${size / 3}px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  })
}

export default function LeafletFireMap({
  hotspots,
  selectedHotspot,
  onHotspotSelect,
  zoomTrigger = 0,
}: LeafletFireMapProps) {
  const [isClient, setIsClient] = useState(false)
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove()
          mapRef.current = null
        } catch (error) {
          console.log("Map cleanup error:", error)
        }
      }
    }
  }, [])

  if (!isClient) {
    return (
      <Card className="h-[500px] w-full flex items-center justify-center bg-slate-50 border-slate-200">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading map...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-slate-200 shadow-lg">
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        
        .leaflet-container {
          z-index: 0;
        }
      `}</style>
      
      <div ref={containerRef}>
        <MapContainer
          center={[0.5, 101.0]}
          zoom={8}
          style={{ height: "500px", width: "100%" }}
          scrollWheelZoom={true}
          className="z-0"
          ref={mapRef}
          whenCreated={(map) => {
            mapRef.current = map
          }}
        >
          <MapController selectedHotspot={selectedHotspot} zoomTrigger={zoomTrigger} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hotspots.map((hotspot) => {
            const isSelected = selectedHotspot?.id === hotspot.id
            
            return (
              <Marker
                key={`marker-${hotspot.id}`}
                position={[hotspot.latitude, hotspot.longitude]}
                icon={createCustomIcon(hotspot.riskLevel, isSelected)}
                eventHandlers={{
                  click: () => {
                    onHotspotSelect(hotspot)
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-2">{hotspot.location}</h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Type:</span>
                        <Badge 
                          className="text-xs" 
                          variant={hotspot.detectionType === "Fire" ? "destructive" : "secondary"}
                        >
                          {hotspot.detectionType || "N/A"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Risk:</span>
                        <span className="font-semibold">{hotspot.riskLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Confidence:</span>
                        <span className="font-semibold">{hotspot.confidence}%</span>
                      </div>
                      <div className="text-slate-500 mt-2">{hotspot.detectionTime}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    </Card>
  )
}