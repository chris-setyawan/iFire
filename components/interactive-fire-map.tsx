"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

interface Hotspot {
  id: number
  location: string
  confidence: number
  detectionTime: string
  riskLevel: "Low" | "Medium" | "High"
  latitude: number
  longitude: number
  region: string
}

interface InteractiveFireMapProps {
  hotspots: Hotspot[]
  selectedHotspot: Hotspot | null
  onHotspotSelect: (hotspot: Hotspot) => void
  zoomTrigger?: number
}

export default function InteractiveFireMap({
  hotspots,
  selectedHotspot,
  onHotspotSelect,
  zoomTrigger = 0,
}: InteractiveFireMapProps) {
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragPan, setDragPan] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (zoomTrigger > 0 && selectedHotspot) {
      setZoom(1.8)
      // Center on the marker with adjusted pan values
      const x = lonToX(selectedHotspot.longitude)
      const y = latToY(selectedHotspot.latitude)
      setPan({
        x: 250 - x * 0.8,
        y: 150 - y * 0.8,
      })
    }
  }, [zoomTrigger, selectedHotspot])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "#ef4444" // red
      case "Medium":
        return "#f59e0b" // yellow/orange
      case "Low":
        return "#10b981" // green
      default:
        return "#6b7280" // gray
    }
  }

  const latToY = (lat: number) => {
    return 200 - (lat / 3) * 100
  }

  const lonToX = (lon: number) => {
    return ((lon - 95) / 10) * 300 + 300
  }

  const heatmapPoints = hotspots.flatMap((hotspot) => {
    const intensity = hotspot.riskLevel === "High" ? 0.8 : hotspot.riskLevel === "Medium" ? 0.5 : 0.3
    const points = []

    // Main hotspot
    points.push({
      x: lonToX(hotspot.longitude),
      y: latToY(hotspot.latitude),
      intensity,
      id: `heat-${hotspot.id}-main`,
    })

    const offset = 0.3
    ;[
      [hotspot.latitude + offset, hotspot.longitude + offset],
      [hotspot.latitude - offset, hotspot.longitude - offset],
      [hotspot.latitude + offset * 0.5, hotspot.longitude - offset],
      [hotspot.latitude - offset * 0.5, hotspot.longitude + offset],
    ].forEach((point, i) => {
      points.push({
        x: lonToX(point[1]),
        y: latToY(point[0]),
        intensity: intensity * (0.7 - i * 0.1),
        id: `heat-${hotspot.id}-${i}`,
      })
    })

    return points
  })

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => (direction === "in" ? Math.min(prev + 0.5, 3) : Math.max(prev - 0.5, 1)))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setDragPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    setDragPan({
      x: deltaX / zoom,
      y: deltaY / zoom,
    })
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      setPan({
        x: pan.x + dragPan.x,
        y: pan.y + dragPan.y,
      })
      setDragPan({ x: 0, y: 0 })
    }
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      setPan({
        x: pan.x + dragPan.x,
        y: pan.y + dragPan.y,
      })
      setDragPan({ x: 0, y: 0 })
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return
    e.preventDefault()

    const direction = e.deltaY > 0 ? "out" : "in"
    setZoom((prev) => (direction === "in" ? Math.min(prev + 0.3, 3) : Math.max(prev - 0.3, 1)))
  }

  return (
    <Card className="overflow-hidden bg-white border-slate-200 shadow-sm">
      <div
        className={`relative w-full h-[480px] bg-slate-100 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        {/* SVG Map Container */}
        <svg
          ref={svgRef}
          className="w-full h-full pointer-events-none"
          viewBox={`0 0 600 400`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: `scale(${zoom}) translate(${pan.x + dragPan.x}px, ${pan.y + dragPan.y}px)`,
            transformOrigin: "center",
            transition: isDragging ? "none" : "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* Map background with Sumatra-like shape */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Heatmap gradients */}
            <radialGradient id="heatGradient1" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#991b1b" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ocean/background */}
          <rect width="600" height="400" fill="#e0f2fe" />

          {/* Heatmap circles (if enabled) */}
          {showHeatmap &&
            heatmapPoints.map((point) => (
              <circle
                key={point.id}
                cx={point.x}
                cy={point.y}
                r={30 * point.intensity}
                fill={`rgba(${point.intensity > 0.6 ? "239, 68, 68" : point.intensity > 0.3 ? "245, 158, 11" : "16, 185, 129"}, ${point.intensity * 0.4})`}
                filter="url(#glow)"
                className="pointer-events-none"
              />
            ))}

          {/* Sumatra island simplified outline */}
          <path
            d="M 350 80 Q 360 100 365 150 Q 370 180 368 220 Q 370 260 365 300 Q 360 350 355 380 L 340 380 Q 345 350 345 300 Q 343 250 340 200 Q 338 150 335 100 Z"
            fill="#d1fae5"
            stroke="#059669"
            strokeWidth="1.5"
          />

          {/* Markers for hotspots */}
          {hotspots.map((hotspot) => {
            const x = lonToX(hotspot.longitude)
            const y = latToY(hotspot.latitude)
            const isSelected = selectedHotspot?.id === hotspot.id
            const color = getRiskColor(hotspot.riskLevel)
            const size = isSelected ? 16 : 12

            return (
              <g key={hotspot.id} onClick={() => onHotspotSelect(hotspot)} className="cursor-pointer">
                {/* Outer glow ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={size + 6}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity={isSelected ? 0.6 : 0.3}
                  className="transition-all"
                />

                {/* Main marker circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  filter="url(#glow)"
                  className={`transition-all ${isSelected ? "drop-shadow-lg" : ""}`}
                />

                {/* Icon inside marker */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dy="0.3em"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {hotspot.riskLevel === "High" ? "!" : "•"}
                </text>

                {/* Tooltip on hover - visible on selected */}
                {isSelected && (
                  <g>
                    {x > 450 ? (
                      // Tooltip on LEFT side for markers near right edge
                      <>
                        <rect
                          x={x - 160}
                          y={y - 40}
                          width="140"
                          height="80"
                          rx="6"
                          fill="white"
                          stroke={color}
                          strokeWidth="1.5"
                          filter="url(#glow)"
                        />
                        <text x={x - 150} y={y - 25} fontSize="11" fontWeight="bold" fill="#1e293b">
                          {hotspot.location.split(",")[0]}
                        </text>
                        <text x={x - 150} y={y - 10} fontSize="9" fill="#64748b">
                          Risk: {hotspot.riskLevel}
                        </text>
                        <text x={x - 150} y={y + 5} fontSize="9" fill="#64748b">
                          Conf: {hotspot.confidence}%
                        </text>
                        <text x={x - 150} y={y + 20} fontSize="8" fill="#94a3b8">
                          {hotspot.detectionTime}
                        </text>
                      </>
                    ) : (
                      // Tooltip on RIGHT side for other markers
                      <>
                        <rect
                          x={x + 20}
                          y={y - 40}
                          width="140"
                          height="80"
                          rx="6"
                          fill="white"
                          stroke={color}
                          strokeWidth="1.5"
                          filter="url(#glow)"
                        />
                        <text x={x + 30} y={y - 25} fontSize="11" fontWeight="bold" fill="#1e293b">
                          {hotspot.location.split(",")[0]}
                        </text>
                        <text x={x + 30} y={y - 10} fontSize="9" fill="#64748b">
                          Risk: {hotspot.riskLevel}
                        </text>
                        <text x={x + 30} y={y + 5} fontSize="9" fill="#64748b">
                          Conf: {hotspot.confidence}%
                        </text>
                        <text x={x + 30} y={y + 20} fontSize="8" fill="#94a3b8">
                          {hotspot.detectionTime}
                        </text>
                      </>
                    )}
                  </g>
                )}
              </g>
            )
          })}

          {/* Map labels */}
          <text x="280" y="30" fontSize="14" fontWeight="bold" fill="#1e293b" textAnchor="middle">
            Sumatra Region
          </text>

          {/* Region labels */}
          <text x="290" y="100" fontSize="10" fill="#64748b" opacity="0.7">
            N. Sumatra
          </text>
          <text x="290" y="160" fontSize="10" fill="#64748b" opacity="0.7">
            Riau
          </text>
          <text x="290" y="250" fontSize="10" fill="#64748b" opacity="0.7">
            Jambi
          </text>
        </svg>

        {/* Controls */}
        <div className="absolute top-4 right-4 z-50 bg-white/95 backdrop-blur border border-slate-200 rounded-lg shadow-md p-2 flex gap-2 pointer-events-auto">
          <button
            onClick={() => handleZoom("in")}
            className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-700 font-bold"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={() => handleZoom("out")}
            className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-700 font-bold"
            title="Zoom out"
          >
            −
          </button>
          <div className="w-px bg-slate-200" />
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-2 rounded transition-all flex items-center gap-2 text-sm font-medium ${
              showHeatmap
                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            title="Toggle Risk Heatmap Overlay"
          >
            {showHeatmap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">Heatmap</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 hover:bg-slate-100 rounded transition-colors text-slate-700 text-sm font-medium"
            title="Reset view"
          >
            ↺
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur border border-slate-200 rounded-lg p-4 text-sm text-slate-900 shadow-md z-40 pointer-events-auto">
          <p className="font-semibold mb-3 text-slate-900">Risk Levels</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: getRiskColor("High") }}
              />
              <span className="text-xs text-slate-600">High Risk</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: getRiskColor("Medium") }}
              />
              <span className="text-xs text-slate-600">Medium Risk</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: getRiskColor("Low") }}
              />
              <span className="text-xs text-slate-600">Low Risk</span>
            </div>
          </div>

          {showHeatmap && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-2">Heatmap Intensity</p>
              <div className="h-3 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-700" />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Info Footer */}
      <div className="px-4 py-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 max-h-fit">
        <p className="text-sm text-slate-600 whitespace-normal">
          Sumatra Region • {hotspots.length} active hotspots detected • Click markers or list items to select
        </p>
      </div>
    </Card>
  )
}
