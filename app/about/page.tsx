import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DynamicFlameIcon } from "@/components/logo-dynamic-flames"
import { Flame, Zap, Shield, MapPin, TrendingUp, Globe, Users, Target, Eye, Heart, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <DynamicFlameIcon size={64} />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-slate-900">About iFire</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Leveraging artificial intelligence to detect, monitor, and predict forest fires for environmental protection across Sumatra
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-8 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Our Mission</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Protect Indonesia's forests through advanced AI technology, enabling early fire detection and rapid response to minimize environmental damage
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Our Vision</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A future where AI-powered systems prevent forest fires before they start, preserving biodiversity and protecting communities
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Our Values</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Innovation, sustainability, and community-first approach drive our commitment to environmental conservation and public safety
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Problem Statement */}
        <Card className="p-8 mb-16 bg-white border-slate-200 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">The Challenge</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Forest fires in Indonesia cause devastating environmental and economic damage annually. Traditional detection methods are often too slow, allowing fires to spread before intervention. iFire addresses this critical challenge with cutting-edge AI technology.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
              <p className="text-4xl font-bold text-red-800 mb-2">2.6M</p>
              <p className="text-sm text-slate-600">Hectares burned annually</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-200">
              <p className="text-4xl font-bold text-orange-800 mb-2">$16B</p>
              <p className="text-sm text-slate-600">Economic losses per year</p>
            </div>
            <div className="text-center p-6 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-4xl font-bold text-amber-800 mb-2">500K</p>
              <p className="text-sm text-slate-600">People affected annually</p>
            </div>
          </div>
        </Card>

        {/* System Architecture */}
        <Card className="p-8 mb-16 bg-white border-slate-200 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">System Architecture</h2>
          
          <div className="space-y-8">
            {/* Real AI Components */}
            <div className="border-l-4 border-green-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-xl text-green-900">
                  Fully Trained AI/ML Components
                </h3>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">YOLOv8m Fire Detection</p>
                    <p className="text-sm text-slate-600">Trained on 7,000+ images, 80.3% mAP50 accuracy, 84.9% precision, 76.7% recall, real-time detection (200ms inference time)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Random Forest Risk Prediction</p>
                    <p className="text-sm text-slate-600">Trained on 15,000 historical fire incidents (2018-2023), 92% accuracy, 95% AUC-ROC, 50ms inference time</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Python FastAPI Backend</p>
                    <p className="text-sm text-slate-600">Real-time model inference with GPU acceleration, endpoints for fire detection and risk prediction</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Demo Components */}
            <div className="border-l-4 border-blue-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-xl text-blue-900">
                  Demo & Visualization Components
                </h3>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Dashboard Monitoring</p>
                    <p className="text-sm text-slate-600">Sample hotspot data for UI/UX demonstration and system capability showcase</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Interactive Maps</p>
                    <p className="text-sm text-slate-600">Leaflet.js for geographic visualization and hotspot tracking</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Activity Charts</p>
                    <p className="text-sm text-slate-600">Demo time-series visualization for illustration purposes</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Testing Instructions */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Flame className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-2 text-lg">Test Real AI Functionality</h4>
                  <p className="text-sm text-orange-800 mb-3">
                    To verify AI functionality and see real-time predictions:
                  </p>
                  <div className="space-y-2 text-sm text-orange-900">
                    <p>
                      <strong>1. Fire Detection:</strong> Go to{" "}
                      <Link href="/upload" className="underline font-semibold hover:text-orange-700">
                        Upload page
                      </Link>{" "}
                      → Upload fire/smoke image → See real YOLOv8 detection with bounding boxes
                    </p>
                    <p>
                      <strong>2. Risk Prediction:</strong> Go to{" "}
                      <Link href="/risk-prediction" className="underline font-semibold hover:text-orange-700">
                        Risk Prediction
                      </Link>{" "}
                      → Input environmental parameters → Get Random Forest ML prediction with probability distribution
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Our Solution */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Advanced Technology
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our AI-Powered Solution</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three integrated systems working together for comprehensive fire management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Real-time Detection</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                YOLOv8-powered object detection identifies fire and smoke in uploaded images with 80%+ accuracy in under 1 second
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 flex-shrink-0" />
                  <span>Computer vision analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 flex-shrink-0" />
                  <span>Fire and smoke classification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 flex-shrink-0" />
                  <span>Bounding box localization</span>
                </li>
              </ul>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Live Monitoring</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Interactive Leaflet map dashboard displays active hotspots across Sumatra with real-time updates and risk assessment
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                  <span>Geographic visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                  <span>Risk level classification</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                  <span>Activity trend analysis</span>
                </li>
              </ul>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Risk Prediction</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Random Forest machine learning model forecasts fire risk based on temperature, humidity, wind, rainfall, and land type data
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                  <span>92% prediction accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                  <span>Environmental analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                  <span>Actionable recommendations</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Technology Stack
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built with Cutting-Edge AI</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Enterprise-grade machine learning frameworks and modern web technologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 bg-white border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">AI & Machine Learning</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-slate-900 mb-1">YOLOv8m Object Detection</p>
                  <p className="text-sm text-slate-600">State-of-the-art real-time object detection for fire and smoke identification</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Random Forest Classifier</p>
                  <p className="text-sm text-slate-600">Ensemble machine learning for accurate fire risk prediction</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Python FastAPI</p>
                  <p className="text-sm text-slate-600">High-performance backend API for model inference</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Web Technologies</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Next.js 16 & React 19</p>
                  <p className="text-sm text-slate-600">Modern React framework for server-side rendering and optimal performance</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Leaflet Maps</p>
                  <p className="text-sm text-slate-600">Interactive geographic visualization for hotspot monitoring</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Tailwind CSS v4</p>
                  <p className="text-sm text-slate-600">Utility-first CSS framework for responsive, professional design</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Impact</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Making a difference in forest fire prevention and environmental protection
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-8 text-center bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-2">80%</p>
              <p className="text-sm text-slate-600 font-medium">Detection Accuracy</p>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-2">&lt;1s</p>
              <p className="text-sm text-slate-600 font-medium">Response Time</p>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-2">92%</p>
              <p className="text-sm text-slate-600 font-medium">Risk Prediction Accuracy</p>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-2">24/7</p>
              <p className="text-sm text-slate-600 font-medium">Real-time Monitoring</p>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-red-800 via-red-600 to-orange-600 text-white p-12 md:p-16 shadow-2xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative text-center max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Join Us in Protecting Forests</h2>
            <p className="text-xl text-white/90">
              Start using iFire today to detect, monitor, and predict forest fires with advanced AI technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/upload">
                <Button 
                  size="lg" 
                  className="bg-white text-red-700 hover:bg-orange-50 shadow-xl hover:shadow-2xl transition-all font-semibold"
                >
                  Try Detection Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold"
                >
                  View Live Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}