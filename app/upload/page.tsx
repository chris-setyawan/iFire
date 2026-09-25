"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, AlertCircle, Loader2, CheckCircle2, Flame, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import ImageUploadCard from "@/components/image-upload-card"
import DetectionResult from "@/components/detection-result"
import QuickStartGuide from "@/components/quick-start-guide"
import UploadGuidelines from "@/components/upload-guidelines"
import RecentUploads from "@/components/recent-uploads"
import DetectionTips from "@/components/detection-tips"
import AIExplanationPanel from "@/components/ai-explanation-panel"
import { useFireDetection } from "@/hooks/use-fire-detection"

export default function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [detectionResult, setDetectionResult] = useState<any>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { detectFire, isModelLoading, isDetecting, modelReady } = useFireDetection()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid File", {
          description: "Please upload an image file (PNG, JPG, GIF)",
        })
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File Too Large", {
          description: "Please upload an image smaller than 10MB",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setUploadedImage(imageUrl)
        setDetectionResult(null)

        const img = new Image()
        img.onload = () => {
          setImageElement(img)
        }
        img.src = imageUrl
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRunDetection = async () => {
    if (!imageElement) {
      toast.error("No Image", {
        description: "Please upload an image first",
      })
      return
    }

    if (!modelReady) {
      toast.error("Model Loading", {
        description: "AI model is still loading. Please wait...",
      })
      return
    }

    try {
      const result = await detectFire(imageElement)
      setDetectionResult(result)

      toast.success("Detection Complete", {
        description: result.fireDetected
          ? `Fire detected with ${result.confidence}% confidence`
          : "No fire detected in image",
      })
    } catch (error) {
      console.error("Detection error:", error)
      toast.error("Detection Failed", {
        description: "An error occurred during detection. Please try again.",
      })
    }
  }

  const handleClearImage = () => {
    setUploadedImage(null)
    setDetectionResult(null)
    setImageElement(null)
  }

  const handleAnalyzeAnother = () => {
    setUploadedImage(null)
    setDetectionResult(null)
    setImageElement(null)
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Professional Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Fire Detection</h1>
              <p className="text-slate-600">AI-Powered Image Analysis</p>
            </div>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">
            Upload an image to detect potential fire and smoke using our advanced AI model powered by TensorFlow.js and YOLOv8 object detection.
          </p>
          
          {/* Professional Model Status */}
          <div className="mt-6 flex items-center gap-4">
            {isModelLoading && (
              <Badge className="px-4 py-2 bg-orange-100 text-orange-800 border border-orange-200">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="font-medium">Loading AI Model...</span>
              </Badge>
            )}
            {modelReady && (
              <Badge className="px-4 py-2 bg-green-50 text-green-700 border border-green-200">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
                <span className="font-medium">AI Model Ready</span>
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Zap className="w-4 h-4 text-orange-600" />
              <span>Sub-2 second detection time</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Shield className="w-4 h-4 text-orange-600" />
              <span>80%+ accuracy</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 space-y-6">
            <ImageUploadCard
              uploadedImage={uploadedImage}
              onUpload={() => fileInputRef.current?.click()}
              isDetecting={isDetecting}
              onClear={uploadedImage ? handleClearImage : undefined}
              boundingBoxes={detectionResult?.boundingBoxes || []}
              imageSize={imageElement ? { width: imageElement.width, height: imageElement.height } : undefined}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {uploadedImage && (
              <Button
                onClick={handleRunDetection}
                disabled={isDetecting || !modelReady || isModelLoading}
                size="lg"
                className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white font-semibold shadow-lg"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : isModelLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Model...
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 mr-2" />
                    Run AI Detection
                  </>
                )}
              </Button>
            )}

            {uploadedImage && !isDetecting && modelReady && (
              <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-orange-900 mb-1">Ready to Analyze</p>
                    <p className="text-xs text-orange-800">
                      Click "Run AI Detection" to analyze this image for fire and smoke patterns using advanced computer vision.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {detectionResult ? (
              <>
                <DetectionResult result={detectionResult} onAnalyzeAnother={handleAnalyzeAnother} />
                <AIExplanationPanel
                  fireDetected={detectionResult.fireDetected}
                  smokeDetected={detectionResult.smokeDetected}
                  confidence={detectionResult.confidence}
                  detectionType={detectionResult.detectionType}
                />

                {detectionResult.detectedObjects?.length > 0 && (
                  <Card className="p-6 bg-white border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg text-slate-900">Detected Objects</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detectionResult.detectedObjects.map((obj: string, idx: number) => (
                        <Badge
                          key={idx}
                          className="px-3 py-1.5 bg-orange-100 text-orange-800 border border-orange-200 font-medium"
                        >
                          {obj}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            ) : uploadedImage ? (
              <Card className="p-8 border-2 border-dashed border-slate-300 flex items-center justify-center min-h-96 bg-slate-50">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
                    <AlertCircle className="w-10 h-10 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-slate-900 mb-2">Ready to Analyze</p>
                    <p className="text-slate-600">
                      {isModelLoading
                        ? "AI model is loading... Please wait."
                        : 'Click "Run AI Detection" to analyze the image'}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 border-2 border-dashed border-slate-300 flex items-center justify-center min-h-64 bg-slate-50">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto">
                    <Upload className="w-10 h-10 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-slate-900 mb-2">No Image Uploaded</p>
                    <p className="text-slate-600">Upload an image to get started with AI detection</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Professional Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Real-time Detection</h3>
                <p className="text-sm text-slate-600">Instant fire and smoke pattern recognition using advanced neural networks</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">High Accuracy</h3>
                <p className="text-sm text-slate-600">80%+ detection accuracy with continuous model improvements</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Secure Processing</h3>
                <p className="text-sm text-slate-600">Client-side AI processing ensures your data privacy and security</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-16 space-y-8">
          <QuickStartGuide />
          <UploadGuidelines />
          <div className="grid lg:grid-cols-2 gap-6">
            <RecentUploads />
            <DetectionTips />
          </div>
        </div>
      </div>
    </div>
  )
}