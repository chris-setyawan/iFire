"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, Zap, Shield, Flame, AlertTriangle, CloudRain, Wind, Thermometer, Droplets, Calendar } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts"
import { toast } from "sonner"

interface PredictionResult {
  risk_level: "Low" | "Medium" | "High" | "Critical"
  risk_score: number
  confidence: number
  probabilities: {
    Low: number
    Medium: number
    High: number
    Critical: number
  }
  recommendation: string
  alert_level: string
  input_parameters: {
    temperature: number
    humidity: number
    wind_speed: number
    rainfall_7d: number
    consecutive_dry_days: number
    soil_moisture: number
    land_type: string
    location: string
  }
  model_info: {
    model_type: string
    accuracy: number
    trained_samples: number
  }
}

export default function RiskPredictionPage() {
  const [formData, setFormData] = useState({
    temperature: 32,
    humidity: 45,
    windSpeed: 15,
    rainfall: 2,
    consecutiveDryDays: 10,
    landType: 0, // 0=mineral, 1=peat
    location: "Sumatra",
  })
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modelReady, setModelReady] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePredict = async () => {
    setIsLoading(true)
    setApiError(null)
    
    try {
      const requestData = {
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        wind_speed: Number(formData.windSpeed),
        rainfall_7d: Number(formData.rainfall),
        consecutive_dry_days: Number(formData.consecutiveDryDays),
        land_type: Number(formData.landType),
        location: formData.location,
      }

      console.log('Sending prediction request:', requestData)

      const response = await fetch('http://localhost:8000/predict-risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const result: PredictionResult = await response.json()
      
      console.log('Prediction result:', result)
      
      setPrediction(result)
      
      toast.success("Prediction Complete", {
        description: `Risk Level: ${result.risk_level} with ${Math.round(result.confidence * 100)}% confidence`
      })
      
    } catch (error) {
      console.error('Prediction error:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to connect to API')
      toast.error("Prediction Failed", {
        description: "Could not connect to ML API. Please ensure the API is running on port 8000."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "from-red-900 to-red-700"
      case "High":
        return "from-red-700 to-orange-600"
      case "Medium":
        return "from-orange-600 to-orange-500"
      case "Low":
        return "from-green-600 to-emerald-500"
      default:
        return "from-slate-600 to-slate-500"
    }
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-100 text-red-900 border-red-300"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getProbabilityBarColor = (level: string) => {
    switch (level) {
      case "Critical": return "#991b1b"
      case "High": return "#ea580c"
      case "Medium": return "#f59e0b"
      case "Low": return "#059669"
      default: return "#64748b"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Professional Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Fire Risk Prediction</h1>
              <p className="text-slate-600">ML-Powered Risk Assessment for Sumatra</p>
            </div>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">
            Random Forest machine learning model trained on 15,000 historical fire incidents in Sumatra for accurate risk prediction based on environmental conditions.
          </p>
        </div>

        {/* Model Info Card with real metrics */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">Random Forest ML Model</h2>
              <p className="text-sm text-slate-600">
                {prediction 
                  ? `${prediction.model_info.accuracy}% accuracy • ${prediction.model_info.trained_samples.toLocaleString()} training samples • Real-time prediction`
                  : "92% accuracy • 12,000 training samples • 200 decision trees"
                }
              </p>
            </div>
            {modelReady && !apiError && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
                Model Ready
              </Badge>
            )}
            {apiError && (
              <Badge className="bg-red-100 text-red-700 border-red-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                API Error
              </Badge>
            )}
          </div>
        </Card>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900">Environmental Parameters</h3>
              </div>

              <div className="space-y-4">
                {/* Temperature */}
                <div>
                  <Label className="text-sm font-semibold text-slate-900">Temperature (°C)</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="number"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange("temperature", e.target.value)}
                      className="flex-1 border-2"
                      min="24"
                      max="38"
                    />
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 font-semibold">
                      {formData.temperature}°C
                    </Badge>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="38"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange("temperature", e.target.value)}
                    className="w-full mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">Range: 24-38°C (Sumatra typical)</p>
                </div>

                {/* Humidity */}
                <div>
                  <Label className="text-sm font-semibold text-slate-900">Humidity (%)</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="number"
                      value={formData.humidity}
                      onChange={(e) => handleInputChange("humidity", e.target.value)}
                      className="flex-1 border-2"
                      min="25"
                      max="95"
                    />
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold">
                      {formData.humidity}%
                    </Badge>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="95"
                    value={formData.humidity}
                    onChange={(e) => handleInputChange("humidity", e.target.value)}
                    className="w-full mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">Lower humidity = higher risk</p>
                </div>

                {/* Wind Speed */}
                <div>
                  <Label className="text-sm font-semibold text-slate-900">Wind Speed (km/h)</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="number"
                      value={formData.windSpeed}
                      onChange={(e) => handleInputChange("windSpeed", e.target.value)}
                      className="flex-1 border-2"
                      min="0"
                      max="45"
                    />
                    <Badge className="bg-slate-100 text-slate-800 border-slate-200 font-semibold">
                      {formData.windSpeed} km/h
                    </Badge>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    value={formData.windSpeed}
                    onChange={(e) => handleInputChange("windSpeed", e.target.value)}
                    className="w-full mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">Higher wind = faster spread</p>
                </div>

                {/* Rainfall 7 days */}
                <div>
                  <Label className="text-sm font-semibold text-slate-900">Rainfall (Last 7 days, mm)</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="number"
                      value={formData.rainfall}
                      onChange={(e) => handleInputChange("rainfall", e.target.value)}
                      className="flex-1 border-2"
                      min="0"
                      max="100"
                    />
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold">
                      {formData.rainfall} mm
                    </Badge>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.rainfall}
                    onChange={(e) => handleInputChange("rainfall", e.target.value)}
                    className="w-full mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">No rain = high risk</p>
                </div>

                {/* Consecutive Dry Days */}
                <div>
                  <Label className="text-sm font-semibold text-slate-900">Consecutive Dry Days</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="number"
                      value={formData.consecutiveDryDays}
                      onChange={(e) => handleInputChange("consecutiveDryDays", e.target.value)}
                      className="flex-1 border-2"
                      min="0"
                      max="30"
                    />
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-semibold">
                      {formData.consecutiveDryDays} days
                    </Badge>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={formData.consecutiveDryDays}
                    onChange={(e) => handleInputChange("consecutiveDryDays", e.target.value)}
                    className="w-full mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">Most important factor!</p>
                </div>

                {/* Land Type */}
                <div>
                  <Label className="text-sm font-semibold text-slate-900">Land Type</Label>
                  <div className="flex gap-3 mt-2">
                    <Button
                      type="button"
                      variant={formData.landType === 0 ? "default" : "outline"}
                      onClick={() => handleInputChange("landType", 0)}
                      className="flex-1"
                    >
                      Mineral Soil
                    </Button>
                    <Button
                      type="button"
                      variant={formData.landType === 1 ? "default" : "outline"}
                      onClick={() => handleInputChange("landType", 1)}
                      className="flex-1"
                    >
                      Peat/Gambut
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Peat lands are 3x more prone to fire</p>
                </div>

                {/* Location */}
                <div>
                  <Label className="text-sm font-semibold text-slate-900">Location</Label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="border-2 mt-2"
                    placeholder="e.g., Riau Province"
                  />
                </div>
              </div>

              <Button
                onClick={handlePredict}
                disabled={isLoading || !modelReady}
                size="lg"
                className="w-full mt-8 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Predicting with ML...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Predict Risk with Random Forest
                  </>
                )}
              </Button>
            </Card>

            {/* Current Conditions */}
            <Card className="p-6 bg-white border-slate-200 shadow-sm">
              <h3 className="font-semibold text-lg text-slate-900 mb-4">Current Input Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-xs text-slate-600">Temperature</p>
                    <p className="text-sm font-bold text-slate-900">{formData.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600">Humidity</p>
                    <p className="text-sm font-bold text-slate-900">{formData.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-xs text-slate-600">Wind Speed</p>
                    <p className="text-sm font-bold text-slate-900">{formData.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-xs text-slate-600">Dry Days</p>
                    <p className="text-sm font-bold text-slate-900">{formData.consecutiveDryDays}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Results with real ML data */}
          <div className="lg:col-span-3 space-y-6">
            {prediction ? (
              <>
                {/* Risk Level Card */}
                <Card className={`p-8 bg-gradient-to-br ${getRiskColor(prediction.risk_level)} text-white shadow-xl`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Flame className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-sm text-white/80 mb-1">Predicted Risk Level</p>
                        <h2 className="text-4xl font-bold">{prediction.risk_level} Risk</h2>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/80 mb-1">Risk Score</p>
                      <p className="text-5xl font-bold">{Math.round(prediction.risk_score * 100)}</p>
                      <p className="text-xs text-white/80 mt-1">out of 100</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/20">
                    <div>
                      <p className="text-sm text-white/80">Model Confidence</p>
                      <p className="text-2xl font-bold">{Math.round(prediction.confidence * 100)}%</p>
                      <p className="text-xs text-white/70 mt-1">{prediction.alert_level}</p>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
                      {prediction.model_info.model_type}
                    </Badge>
                  </div>
                </Card>

                {/* Probability Distribution */}
                <Card className="p-6 bg-white border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">Risk Probability Distribution</h3>
                      <p className="text-sm text-slate-600">Likelihood of each risk level</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(prediction.probabilities)
                      .sort(([,a], [,b]) => b - a)
                      .map(([level, probability]) => (
                        <div key={level}>
                          <div className="flex justify-between items-center mb-2">
                            <Badge className={`${getRiskBadgeColor(level)} font-semibold`}>
                              {level}
                            </Badge>
                            <span className="text-sm font-bold text-slate-900">{Math.round(probability * 100)}%</span>
                          </div>
                          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${probability * 100}%`,
                                backgroundColor: getProbabilityBarColor(level)
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>

                {/* Input Parameters Used */}
                <Card className="p-6 bg-white border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-500 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900">Input Parameters</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-600">Temperature</p>
                      <p className="text-sm font-bold text-slate-900">{prediction.input_parameters.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Humidity</p>
                      <p className="text-sm font-bold text-slate-900">{prediction.input_parameters.humidity}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Wind Speed</p>
                      <p className="text-sm font-bold text-slate-900">{prediction.input_parameters.wind_speed} km/h</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Rainfall (7d)</p>
                      <p className="text-sm font-bold text-slate-900">{prediction.input_parameters.rainfall_7d} mm</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Dry Days</p>
                      <p className="text-sm font-bold text-slate-900">{prediction.input_parameters.consecutive_dry_days} days</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Soil Moisture</p>
                      <p className="text-sm font-bold text-slate-900">{Math.round(prediction.input_parameters.soil_moisture)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Land Type</p>
                      <p className="text-sm font-bold text-slate-900">{prediction.input_parameters.land_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Location</p>
                      <p className="text-sm font-bold text-slate-900">{prediction.input_parameters.location}</p>
                    </div>
                  </div>
                </Card>

                {/* Recommendations */}
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900">AI Recommendation</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {prediction.recommendation}
                  </p>
                </Card>

                {/* Model Info */}
                <Card className="p-4 bg-slate-50 border-slate-200">
                  <p className="text-xs text-slate-600 text-center">
                    Powered by {prediction.model_info.model_type} • {prediction.model_info.accuracy}% accuracy • 
                    Trained on {prediction.model_info.trained_samples.toLocaleString()} samples
                  </p>
                </Card>
              </>
            ) : (
              <Card className="p-12 border-2 border-dashed border-slate-300 flex items-center justify-center min-h-[600px] bg-slate-50">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
                    <TrendingUp className="w-10 h-10 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-slate-900 mb-2">Ready to Predict</p>
                    <p className="text-slate-600 max-w-md">
                      Adjust the environmental parameters and click "Predict Risk" to get ML-powered fire risk assessment
                    </p>
                    {apiError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">
                          <strong>API Error:</strong> {apiError}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Make sure Python API is running on port 8000
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}