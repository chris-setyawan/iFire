"use client"
import { Upload, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

interface BoundingBox {
  class: string
  score: number
  x: number
  y: number
  width: number
  height: number
}

interface ImageUploadCardProps {
  uploadedImage: string | null
  onUpload: () => void
  isDetecting: boolean
  onClear?: () => void
  boundingBoxes?: BoundingBox[]
  imageSize?: { width: number; height: number }
}

export default function ImageUploadCard({ 
  uploadedImage, 
  onUpload, 
  isDetecting, 
  onClear,
  boundingBoxes = [],
  imageSize
}: ImageUploadCardProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 })
  const imageContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!imageContainerRef.current || !uploadedImage) return
    
    const updateSize = () => {
      const container = imageContainerRef.current
      if (!container) return
      
      const img = container.querySelector('img')
      if (img) {
        setRenderedSize({
          width: img.clientWidth,
          height: img.clientHeight
        })
      }
    }
    
    const img = imageContainerRef.current.querySelector('img')
    if (img) {
      if (img.complete) {
        updateSize()
      } else {
        img.addEventListener('load', updateSize)
      }
    }
    
    window.addEventListener('resize', updateSize)
    
    return () => {
      window.removeEventListener('resize', updateSize)
      if (img) {
        img.removeEventListener('load', updateSize)
      }
    }
  }, [uploadedImage])
  
  const handleUploadClick = () => {
    if (!uploadedImage) {
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 30
        })
      }, 200)
    }
    onUpload()
  }

  const getBoxStyle = (box: any) => {
    if (!imageSize || !renderedSize.width || !renderedSize.height) {
      return { 
        left: "0px", 
        top: "0px", 
        width: "0px", 
        height: "0px" 
      }
    }
    
    let x, y, width, height
    
    if (Array.isArray(box)) {
      [x, y, width, height] = box
    } else if (box.bbox && Array.isArray(box.bbox)) {
      [x, y, width, height] = box.bbox
    } else {
      x = box.x || 0
      y = box.y || 0
      width = box.width || 0
      height = box.height || 0
    }
    
    const scaleX = renderedSize.width / imageSize.width
    const scaleY = renderedSize.height / imageSize.height
    
    const scaledX = x * scaleX
    const scaledY = y * scaleY
    const scaledWidth = width * scaleX
    const scaledHeight = height * scaleY
    
    const container = imageContainerRef.current
    if (!container) {
      return { 
        left: `${scaledX}px`, 
        top: `${scaledY}px`, 
        width: `${scaledWidth}px`, 
        height: `${scaledHeight}px` 
      }
    }
    
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    
    const offsetX = (containerWidth - renderedSize.width) / 2
    const offsetY = (containerHeight - renderedSize.height) / 2
    
    return {
      left: `${scaledX + offsetX}px`,
      top: `${scaledY + offsetY}px`,
      width: `${scaledWidth}px`,
      height: `${scaledHeight}px`
    }
  }

  const getBoxColor = (className: string) => {
    if (className === "fire" || className === "Fire") return "#F44336"
    if (className === "smoke" || className === "Smoke") return "#FF9800"
    return "#F44336"
  }

  return (
    <Card
      onClick={!uploadedImage ? handleUploadClick : undefined}
      className={`relative overflow-hidden border-2 border-dashed transition-all ${
        uploadedImage
          ? "border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5"
          : "border-border hover:border-primary/50 cursor-pointer hover:bg-muted/50"
      }`}
    >
      {uploadedImage ? (
        <div ref={imageContainerRef} className="relative w-full h-96">
          <Image 
            src={uploadedImage || "/placeholder.svg"} 
            alt="Uploaded image" 
            fill 
            className="object-contain" 
          />
          
          {!isDetecting && boundingBoxes.length > 0 && renderedSize.width > 0 && (
            <>
              {boundingBoxes.map((box, idx) => {
                const style = getBoxStyle(box)
                return (
                  <div
                    key={idx}
                    className="absolute pointer-events-none"
                    style={{
                      left: style.left,
                      top: style.top,
                      width: style.width,
                      height: style.height,
                      border: `3px solid ${getBoxColor(box.class)}`,
                      opacity: 0.9,
                      boxShadow: `0 0 10px ${getBoxColor(box.class)}`,
                    }}
                  >
                    <div 
                      className="absolute -top-7 left-0 px-2 py-1 text-xs font-bold text-white rounded shadow-lg whitespace-nowrap"
                      style={{ backgroundColor: getBoxColor(box.class) }}
                    >
                      {box.class} {Math.round(box.score * 100)}%
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {isDetecting && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex gap-2 z-30">
            {onClear && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setUploadProgress(0)
                  onClear()
                }}
                className="p-2 rounded-lg bg-background/80 hover:bg-background transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleUploadClick()
              }}
              className="p-2 rounded-lg bg-background/80 hover:bg-background transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold mb-2">Click to upload image</p>
          <p className="text-sm text-muted-foreground">or drag and drop</p>
          <p className="text-xs text-muted-foreground mt-4">PNG, JPG, GIF up to 10MB</p>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-6 space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% uploaded</p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}