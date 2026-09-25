import Link from "next/link"
import { ArrowRightIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Flame, MapPin, TrendingUp, Shield, Zap, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-orange-50/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              <Flame className="w-4 h-4" />
              <span>AI-Powered Forest Protection</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance">
                Protect Forests with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  Artificial Intelligence
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Advanced wildfire detection and monitoring powered by machine learning. 
                Real-time protection for Sumatra's vital ecosystems using computer vision and neural networks.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/upload">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Flame className="w-4 h-4 mr-2" />
                  Try Detection Now
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 hover:bg-orange-50 transition-all"
                >
                  View Live Dashboard
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              {[
                { label: "Detection and Prediction Accuracy", value: "80-92%", icon: TrendingUp },
                { label: "Response Time", value: "<1s", icon: Zap },
                { label: "Coverage", value: "Sumatra", icon: Globe },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2 group cursor-default">
                  <div className="flex items-center gap-2">
                    <stat.icon className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {stat.value}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Professional Warm Palette Cards */}
          <div className="relative h-96 md:h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl animate-pulse-slow" />
            <div className="relative h-full rounded-3xl border-2 border-orange-200 bg-white/80 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Feature Cards with Professional Warm Palette */}
              <div className="absolute inset-0 p-8 flex flex-col justify-center gap-4">
                {/* Card 1: Dark Maroon/Red - Fire Detection */}
                <Link href="/upload">
                  <Card className="p-6 bg-gradient-to-r from-red-800 to-red-600 text-white transform hover:scale-105 transition-all shadow-xl animate-float cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Flame className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">Fire Detection</p>
                        <p className="text-sm text-white/80">Real-time AI analysis</p>
                      </div>
                    </div>
                  </Card>
                </Link>

                {/* Card 2: Bright Orange - Live Monitoring */}
                <Link href="/dashboard">
                  <Card className="p-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white transform hover:scale-105 transition-all shadow-xl animate-float cursor-pointer group" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">Live Monitoring</p>
                        <p className="text-sm text-white/80">Interactive dashboard</p>
                      </div>
                    </div>
                  </Card>
                </Link>

                {/* Card 3: Golden Orange - Risk Prediction */}
                <Link href="/risk-prediction">
                  <Card className="p-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white transform hover:scale-105 transition-all shadow-xl animate-float cursor-pointer group" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">Risk Prediction</p>
                        <p className="text-sm text-white/80">ML-powered forecasting</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Professional Warm Palette */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-white/50 backdrop-blur-sm">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Powered by Advanced AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              iFire?
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Combining YOLOv8 object detection with TensorFlow.js neural networks for comprehensive fire monitoring
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Early Detection",
              description: "Identify fires at their earliest stages using computer vision and color-based analysis before they spread",
              icon: Flame,
              gradient: "from-red-800 to-red-600", // Dark maroon
              href: "/upload",
            },
            {
              title: "Real-time Monitoring",
              description: "Continuous surveillance of high-risk forest areas with interactive Leaflet map integration",
              icon: MapPin,
              gradient: "from-orange-600 to-orange-500", // Bright orange
              href: "/dashboard",
            },
            {
              title: "Risk Prediction",
              description: "Predict fire risk using neural networks based on weather, humidity, and vegetation data",
              icon: TrendingUp,
              gradient: "from-orange-500 to-amber-500", // Golden orange
              href: "/risk-prediction",
            },
          ].map((feature) => (
            <Link key={feature.title} href={feature.href} className="block">
              <Card
                className="group relative p-8 h-full hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-orange-200 animate-fade-in cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center text-orange-600 font-medium group-hover:gap-2 transition-all">
                    <span>Learn more</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Card className="relative overflow-hidden bg-gradient-to-r from-red-800 via-red-600 to-orange-600 text-white p-12 md:p-16 shadow-2xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative text-center max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Protect Our Forests?
            </h2>
            <p className="text-xl text-white/90">
              Start detecting and monitoring forest fires with AI-powered technology today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/upload">
                <Button 
                  size="lg" 
                  className="bg-white text-red-700 hover:bg-orange-50 shadow-xl hover:shadow-2xl transition-all font-semibold"
                >
                  Get Started Free
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}