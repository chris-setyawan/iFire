"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, TrendingUp, Globe, Clock, AlertTriangle, Flame, Download, Upload, X, Zap, Shield, Image as ImageIcon, Loader2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { toast } from "sonner"
import EnvironmentalInfo from "@/components/environmental-info"
import AIForecastGauge from "@/components/ai-forecast-gauge"
import RecentAlertsLog from "@/components/recent-alerts-log"
import { useFireDetection } from "@/hooks/use-fire-detection"

const LeafletFireMap = dynamic(
  () => import("@/components/leaflet-fire-map"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full flex items-center justify-center bg-slate-50 border-2 border-slate-200 rounded-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading map...</p>
        </div>
      </div>
    )
  }
)

interface Hotspot {
  id: number
  location: string
  confidence: number
  detectionTime: string
  riskLevel: "Low" | "Medium" | "High"
  latitude: number
  longitude: number
  region: string
  detectionType?: "Fire" | "Smoke" | "Fire & Smoke" | "No Fire" // Added "Fire & Smoke"
}

const mockHotspots: Hotspot[] = [
  {
    id: 1,
    location: "Riau Province, Sumatra",
    confidence: 94,
    detectionTime: "2 hours ago",
    riskLevel: "High",
    latitude: 0.5,
    longitude: 101.5,
    region: "Riau",
    detectionType: "Fire",
  },
  {
    id: 2,
    location: "Jambi Province, Sumatra",
    confidence: 76,
    detectionTime: "6 hours ago",
    riskLevel: "Medium",
    latitude: -1.6,
    longitude: 103.6,
    region: "Jambi",
    detectionType: "Smoke",
  },
  {
    id: 3,
    location: "North Sumatra",
    confidence: 58,
    detectionTime: "12 hours ago",
    riskLevel: "Low",
    latitude: 2.1,
    longitude: 99.8,
    region: "North Sumatra",
    detectionType: "Smoke",
  },
]

const activityData = [
  { time: "00:00", detections: 4 },
  { time: "04:00", detections: 3 },
  { time: "08:00", detections: 7 },
  { time: "12:00", detections: 8 },
  { time: "16:00", detections: 6 },
  { time: "20:00", detections: 5 },
]

export default function DashboardPage() {
  const [hotspots, setHotspots] = useState<Hotspot[]>(mockHotspots)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [filter, setFilter] = useState<"All" | "High" | "Medium" | "Low">("All")
  const [zoomTrigger, setZoomTrigger] = useState(0)
  const [showAddHotspotDialog, setShowAddHotspotDialog] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectionResult, setDetectionResult] = useState<any>(null) // Store full detection result
  const [isAIDetected, setIsAIDetected] = useState(false) // Track if AI detected
  const [newHotspot, setNewHotspot] = useState({
    location: "",
    latitude: "",
    longitude: "",
    riskLevel: "Medium" as "Low" | "Medium" | "High",
    confidence: "85",
    detectionType: "Fire" as "Fire" | "Smoke" | "Fire & Smoke" | "No Fire", // updated
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dialogFileInputRef = useRef<HTMLInputElement>(null)
  const { detectFire } = useFireDetection()

  const filteredHotspots = filter === "All" ? hotspots : hotspots.filter((h) => h.riskLevel === filter)
  const highRiskCount = hotspots.filter((h) => h.riskLevel === "High").length

  const handleHotspotSelect = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot)
    setZoomTrigger((prev) => prev + 1)
  }

  const handleImageUploadInDialog = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", { description: "Please upload an image file" })
      return
    }

    setIsAnalyzing(true)
    
    const reader = new FileReader()
    reader.onload = async (event) => {
      const imageUrl = event.target?.result as string
      setUploadedImage(imageUrl)

      const img = new Image()
      img.onload = async () => {
        try {
          const result = await detectFire(img)
          setDetectionResult(result)
          
          console.log('Detection Result:', result)
          
          if (result.fireDetected && result.boundingBoxes && result.boundingBoxes.length > 0) {
            setIsAIDetected(true)
            
            const detectedType = result.inferredType || "Fire"
            const riskLevel = result.riskLevel || (result.confidence > 80 ? "High" : result.confidence > 60 ? "Medium" : "Low")
            
            setNewHotspot({
              ...newHotspot,
              confidence: result.confidence.toString(),
              riskLevel: riskLevel,
              detectionType: detectedType as any,
            })
            
            toast.success(`${detectedType} detected!`, { 
              description: `Confidence: ${result.confidence}%, Risk: ${riskLevel} - Now add location & coordinates` 
            })
          } else {
            // No fire detected
            setIsAIDetected(false)
            setNewHotspot({
              ...newHotspot,
              confidence: "0",
              riskLevel: "Low",
              detectionType: "No Fire",
            })
            
            toast.info("No fire detected", { 
              description: "You can still mark this location manually if needed" 
            })
          }
        } catch (error) {
          console.error('Detection error:', error)
          setIsAIDetected(false)
          toast.error("Detection failed", { description: "Please fill form manually" })
        } finally {
          setIsAnalyzing(false)
        }
      }
      img.onerror = () => {
        setIsAnalyzing(false)
        toast.error("Failed to load image")
      }
      img.src = imageUrl
    }
    reader.readAsDataURL(file)
  }

  const handleAddHotspot = () => {
    // Validate inputs
    if (!newHotspot.location.trim()) {
      toast.error("Location name is required")
      return
    }
    if (!newHotspot.latitude || !newHotspot.longitude) {
      toast.error("Coordinates are required")
      return
    }

    const lat = parseFloat(newHotspot.latitude)
    const lng = parseFloat(newHotspot.longitude)

    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Invalid coordinates")
      return
    }

    if (lat < -90 || lat > 90) {
      toast.error("Latitude must be between -90 and 90")
      return
    }
    if (lng < -180 || lng > 180) {
      toast.error("Longitude must be between -180 and 180")
      return
    }

    // Create new hotspot
    const newEntry: Hotspot = {
      id: hotspots.length + 1,
      location: newHotspot.location.trim(),
      confidence: parseInt(newHotspot.confidence) || 0,
      detectionTime: "Just now",
      riskLevel: newHotspot.riskLevel,
      latitude: lat,
      longitude: lng,
      region: isAIDetected ? "AI Detection" : "Manual Entry",
      detectionType: newHotspot.detectionType,
    }

    setHotspots([newEntry, ...hotspots])
    handleCloseDialog()

    // Zoom to new hotspot
    setSelectedHotspot(newEntry)
    setZoomTrigger(prev => prev + 1)

    toast.success("Hotspot added successfully!", {
      description: `${newEntry.location} at (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    })
  }

  const handleCloseDialog = () => {
    setShowAddHotspotDialog(false)
    setUploadedImage(null)
    setDetectionResult(null)
    setIsAnalyzing(false)
    setIsAIDetected(false)
    setNewHotspot({
      location: "",
      latitude: "",
      longitude: "",
      riskLevel: "Medium",
      confidence: "85",
      detectionType: "Fire",
    })
  }

  const handleExportData = () => {
    const headers = ["ID", "Location", "Region", "Detection Type", "Confidence (%)", "Risk Level", "Detection Time", "Latitude", "Longitude"]
    const csvData = hotspots.map(h => [
      h.id,
      h.location,
      h.region,
      h.detectionType || "N/A",
      h.confidence,
      h.riskLevel,
      h.detectionTime,
      h.latitude.toFixed(4),
      h.longitude.toFixed(4)
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", `ifire-hotspots-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success("Data exported successfully!", {
      description: `${hotspots.length} hotspots exported to CSV`,
    })
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Low":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  // Helper function to get badge color for detection type
  const getDetectionTypeBadgeColor = (type?: string) => {
    switch (type) {
      case "Fire":
      case "Fire & Smoke":
        return "bg-red-100 text-red-700 border-red-200"
      case "Smoke":
        return "bg-slate-100 text-slate-700 border-slate-200"
      case "No Fire":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Fire Hotspots Dashboard</h1>
                <p className="text-slate-600">Real-time monitoring of detected fire hotspots in Sumatra</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowAddHotspotDialog(true)}
                className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white font-semibold shadow-lg"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Add Hotspot
              </Button>
              <Button variant="outline" className="border-2" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Demo Mode Banner */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Demo Mode - Sample Data</h3>
              <p className="text-sm text-blue-800">
                Dashboard showing <strong>sample hotspots</strong> for system demonstration. 
                Core AI systems (Fire Detection & Risk Prediction) are <strong>fully trained and operational</strong>. 
                Test real detection on the <Link href="/upload" className="underline font-semibold">Upload page</Link>.
              </p>
            </div>
          </div>
        </Card>

        {/* Professional Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center shadow-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-red-100 text-red-700 border-red-200">Total</Badge>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1 font-medium">Total Detections</p>
              <p className="text-3xl font-bold text-slate-900">{hotspots.length}</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">Active</Badge>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1 font-medium">Active Hotspots</p>
              <p className="text-3xl font-bold text-slate-900">{filteredHotspots.length}</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">High Risk</Badge>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1 font-medium">High-Risk Areas</p>
              <p className="text-3xl font-bold text-slate-900">{highRiskCount}</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-500 flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1 font-medium">Last Updated</p>
              <p className="text-3xl font-bold text-slate-900">2m ago</p>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Map */}
          <div className="lg:col-span-2 space-y-6">
            <LeafletFireMap
              hotspots={hotspots}
              selectedHotspot={selectedHotspot}
              onHotspotSelect={handleHotspotSelect}
              zoomTrigger={zoomTrigger}
            />

            {/* Activity Chart */}
            <Card className="p-6 bg-white border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">Detection Activity</h3>
                  <p className="text-sm text-slate-600">Last 24 hours</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="detections" 
                    stroke="#ea580c" 
                    strokeWidth={2}
                    dot={{ fill: '#ea580c', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Right Column - Hotspots List */}
          <div className="space-y-6">
            {/* Filter Buttons */}
            <Card className="p-4 bg-white border-slate-200 shadow-sm">
              <p className="text-sm font-semibold text-slate-900 mb-3">Filter by Risk</p>
              <div className="flex flex-wrap gap-2">
                {["All", "High", "Medium", "Low"].map((level) => (
                  <Button
                    key={level}
                    onClick={() => setFilter(level as typeof filter)}
                    variant={filter === level ? "default" : "outline"}
                    size="sm"
                    className={filter === level 
                      ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white" 
                      : "border-2"
                    }
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Detected Hotspots */}
            <Card className="p-4 bg-white border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-slate-900">Detected Hotspots</h3>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  {filteredHotspots.length} active
                </Badge>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredHotspots.map((hotspot) => (
                  <Card
                    key={hotspot.id}
                    onClick={() => handleHotspotSelect(hotspot)}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      selectedHotspot?.id === hotspot.id
                        ? "border-orange-500 bg-orange-50 shadow-md"
                        : "border-slate-200 hover:border-orange-300 hover:shadow-sm bg-white"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0 animate-pulse" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-900 mb-1">{hotspot.location}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              {hotspot.detectionTime}
                            </div>
                            {/* Detection type badge */}
                            {hotspot.detectionType && (
                              <Badge 
                                className={`mt-2 text-xs border ${getDetectionTypeBadgeColor(hotspot.detectionType)}`}
                              >
                                <Flame className="w-3 h-3 mr-1" />
                                {hotspot.detectionType}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge className={`${getRiskColor(hotspot.riskLevel)} border font-semibold`}>
                          {hotspot.riskLevel}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500 font-medium">Confidence</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                              style={{ width: `${hotspot.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-900">{hotspot.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Selected Hotspot Details */}
            {selectedHotspot && (
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Selected Location</h4>
                      <p className="text-sm text-slate-600">{selectedHotspot.location}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedHotspot(null)}
                    className="hover:bg-orange-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">Risk Level:</span>
                    <Badge className={`${getRiskColor(selectedHotspot.riskLevel)} border font-semibold`}>
                      {selectedHotspot.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">Confidence:</span>
                    <span className="text-sm font-bold text-slate-900">{selectedHotspot.confidence}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">Detection Time:</span>
                    <span className="text-sm font-semibold text-slate-900">{selectedHotspot.detectionTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">Coordinates:</span>
                    <span className="text-sm font-mono text-slate-900">
                      {selectedHotspot.latitude.toFixed(3)}, {selectedHotspot.longitude.toFixed(3)}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          <EnvironmentalInfo />
          <AIForecastGauge />
          <RecentAlertsLog />
        </div>

        {/* Add Hotspot Dialog with AI auto-fill */}
        <Dialog open={showAddHotspotDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                Add Fire Hotspot
              </DialogTitle>
              <DialogDescription>
                Upload an image for AI detection OR manually enter hotspot details with precise coordinates
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Image Upload Section */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image Upload (Optional)
                </Label>
                
                {!uploadedImage ? (
                  <div 
                    className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-colors"
                    onClick={() => dialogFileInputRef.current?.click()}
                  >
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700 mb-1">Click to upload image</p>
                    <p className="text-xs text-slate-500">AI will auto-detect fire/smoke and fill details</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-slate-200"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setUploadedImage(null)
                        setDetectionResult(null)
                        setIsAIDetected(false)
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                          <p className="text-sm font-medium">Analyzing with AI...</p>
                        </div>
                      </div>
                    )}
                    {/* Show correct detection type */}
                    {detectionResult && !isAnalyzing && (
                      <Badge className={`absolute bottom-2 left-2 ${
                        detectionResult.fireDetected 
                          ? getDetectionTypeBadgeColor(detectionResult.inferredType)
                          : "bg-green-600 text-white"
                      }`}>
                        {detectionResult.fireDetected 
                          ? `${detectionResult.inferredType}: ${detectionResult.confidence}%`
                          : "No Fire Detected"
                        }
                      </Badge>
                    )}
                  </div>
                )}
                
                <input
                  ref={dialogFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUploadInDialog}
                  className="hidden"
                />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500 font-semibold">Location Details (Required)</span>
                </div>
              </div>

              {/* Location Name */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold">
                  Location Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Riau Province, Sumatra"
                  value={newHotspot.location}
                  onChange={(e) => setNewHotspot({ ...newHotspot, location: e.target.value })}
                  className="border-2"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-sm font-semibold">
                    Latitude <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.0001"
                    placeholder="e.g., 0.5000"
                    value={newHotspot.latitude}
                    onChange={(e) => setNewHotspot({ ...newHotspot, latitude: e.target.value })}
                    className="border-2"
                  />
                  <p className="text-xs text-slate-500">Range: -90 to 90</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-sm font-semibold">
                    Longitude <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.0001"
                    placeholder="e.g., 101.5000"
                    value={newHotspot.longitude}
                    onChange={(e) => setNewHotspot({ ...newHotspot, longitude: e.target.value })}
                    className="border-2"
                  />
                  <p className="text-xs text-slate-500">Range: -180 to 180</p>
                </div>
              </div>

              {/* Detection Type & Risk Level with read-only state */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="detectionType" className="text-sm font-semibold">
                    Detection Type
                  </Label>
                  <Select
                    value={newHotspot.detectionType}
                    onValueChange={(value: any) => 
                      setNewHotspot({ ...newHotspot, detectionType: value })
                    }
                    disabled={isAIDetected} // Read-only if AI detected
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fire">Fire</SelectItem>
                      <SelectItem value="Smoke">Smoke</SelectItem>
                      <SelectItem value="Fire & Smoke">Fire & Smoke</SelectItem>
                      <SelectItem value="No Fire">No Fire</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Show auto-fill indicator */}
                  {isAIDetected && (
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Auto-filled from AI detection
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskLevel" className="text-sm font-semibold">
                    Risk Level
                  </Label>
                  <Select
                    value={newHotspot.riskLevel}
                    onValueChange={(value: "Low" | "Medium" | "High") => 
                      setNewHotspot({ ...newHotspot, riskLevel: value })
                    }
                    disabled={isAIDetected} // Read-only if AI detected
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Show auto-calculated indicator */}
                  {isAIDetected && (
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Auto-calculated from confidence
                    </p>
                  )}
                </div>
              </div>

              {/* Confidence with read-only state */}
              <div className="space-y-2">
                <Label htmlFor="confidence" className="text-sm font-semibold">
                  Confidence (%)
                </Label>
                <Input
                  id="confidence"
                  type="number"
                  min="0"
                  max="100"
                  value={newHotspot.confidence}
                  onChange={(e) => setNewHotspot({ ...newHotspot, confidence: e.target.value })}
                  className="border-2"
                  disabled={isAIDetected} // Read-only if AI detected
                />
                <p className="text-xs text-slate-500">
                  {isAIDetected
                    ? "✓ Auto-filled from AI detection" 
                    : "Manual confidence estimate (0-100)"
                  }
                </p>
              </div>

              {/* Info Box */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-2">How it works:</p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li><strong>With Image:</strong> Upload → AI detects → Auto-fills type, risk & confidence → You add location</li>
                      <li><strong>Without Image:</strong> Enter all details manually</li>
                      <li><strong>Coordinates:</strong> Use decimal degrees (e.g., 0.5000, 101.5000)</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                className="border-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddHotspot}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Add Hotspot
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}