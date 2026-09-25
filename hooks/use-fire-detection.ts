import { useState } from "react"

interface DetectionResult {
  fireDetected: boolean
  smokeDetected?: boolean
  confidence: number
  detectedObjects?: string[]
  boundingBoxes?: Array<{
    x: number
    y: number
    width: number
    height: number
    class: string
    score: number
  }>
  inferredType?: "Fire" | "Smoke" | "Fire & Smoke" | "No Fire"
  riskLevel?: "Low" | "Medium" | "High" | "Critical"
}

export function useFireDetection() {
  const [isDetecting, setIsDetecting] = useState(false)
  const [modelReady] = useState(true)

  const detectFire = async (imageElement: HTMLImageElement): Promise<DetectionResult> => {
    setIsDetecting(true)

    try {
      const canvas = document.createElement('canvas')
      canvas.width = imageElement.width
      canvas.height = imageElement.height
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        throw new Error("Canvas context not available")
      }
      
      ctx.drawImage(imageElement, 0, 0)
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b)
          else reject(new Error("Failed to convert to blob"))
        }, 'image/jpeg', 0.95)
      })

      const formData = new FormData()
      formData.append('file', blob, 'image.jpg')

      const response = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      console.log('API Response:', data)

      // Get class names from API
      const detectedClasses = (data.detections || []).map((d: any) => 
        (d.class || '').toLowerCase()
      )

      const boundingBoxes = (data.detections || []).map((det: any) => {
        const bbox = det.bbox || { x1: 0, y1: 0, x2: 0, y2: 0 }
        
        return {
          x: Math.round(bbox.x1 || 0),
          y: Math.round(bbox.y1 || 0),
          width: Math.round((bbox.x2 || 0) - (bbox.x1 || 0)),
          height: Math.round((bbox.y2 || 0) - (bbox.y1 || 0)),
          class: det.class || 'unknown',
          score: det.confidence || 0,
        }
      }).filter((box: any) => box.width > 0 && box.height > 0)

      const detectedObjects = (data.detections || []).map((d: any) => d.class).filter(Boolean)
      const maxConfidence = data.summary?.maxConfidence || 0

      // Use API class names directly
      const hasFire = detectedClasses.some(cls => cls.includes('fire') || cls === '火')
      const hasSmoke = detectedClasses.some(cls => cls.includes('smoke') || cls === '烟')

      let inferredType: "Fire" | "Smoke" | "Fire & Smoke" | "No Fire"
      
      if (hasFire && hasSmoke) {
        inferredType = "Fire & Smoke"
      } else if (hasFire) {
        inferredType = "Fire"
      } else if (hasSmoke) {
        inferredType = "Smoke"
      } else if (boundingBoxes.length > 0) {
        // Fallback to smart inference
        inferredType = inferDetectionType(boundingBoxes, maxConfidence)
      } else {
        inferredType = "No Fire"
      }

      const riskLevel = calculateRiskLevel(maxConfidence, inferredType)

      const result: DetectionResult = {
        fireDetected: data.fireDetected,
        smokeDetected: data.smokeDetected,
        confidence: Math.round(maxConfidence * 100),
        detectedObjects,
        boundingBoxes,
        inferredType,
        riskLevel,
      }

      console.log('Transformed Result:', result)

      setIsDetecting(false)
      return result

    } catch (error) {
      console.error("Detection error:", error)
      setIsDetecting(false)
      
      return {
        fireDetected: false,
        confidence: 0,
        detectedObjects: [],
        boundingBoxes: [],
        inferredType: "No Fire",
        riskLevel: "Low",
      }
    }
  }

  return {
    detectFire,
    isModelLoading: false,
    isDetecting,
    modelReady,
  }
}

function inferDetectionType(
  boundingBoxes: any[], 
  confidence: number
): "Fire" | "Smoke" | "Fire & Smoke" | "No Fire" {
  
  if (!boundingBoxes || boundingBoxes.length === 0) {
    return "No Fire"
  }

  // Calculate metrics
  const avgBoxSize = boundingBoxes.reduce((sum, box) => {
    const area = (box.width * box.height) / (640 * 640)
    return sum + area
  }, 0) / boundingBoxes.length

  const totalCoverage = boundingBoxes.reduce((sum, box) => {
    const area = (box.width * box.height) / (640 * 640)
    return sum + area
  }, 0)

  const isVeryHighConfidence = confidence > 0.88  // Fire threshold
  const isHighConfidence = confidence > 0.80       // Borderline
  const isMediumConfidence = confidence >= 0.70    // Smoke threshold
  
  const isVeryCompact = avgBoxSize < 0.10   // Very small boxes = fire
  const isCompact = avgBoxSize < 0.20       // Small boxes = likely fire
  const isDiffuse = avgBoxSize >= 0.20      // Large boxes = likely smoke
  const isVeryDiffuse = avgBoxSize >= 0.35  // Very large boxes = definitely smoke

  const fewDetections = boundingBoxes.length <= 2
  const manyDetections = boundingBoxes.length > 2

  const highCoverage = totalCoverage > 0.4  // Covers >40% of image = smoke

  // Decision tree (refined)
  
  // DEFINITE FIRE: Very high confidence + compact
  if (isVeryHighConfidence && isVeryCompact) {
    return "Fire"
  }
  
  // DEFINITE SMOKE: Large diffuse boxes regardless of confidence
  if (isVeryDiffuse) {
    return "Smoke"
  }
  
  // SMOKE: High coverage or diffuse + medium-high confidence
  if (highCoverage || (isDiffuse && isMediumConfidence)) {
    return "Smoke"
  }
  
  // FIRE & SMOKE: High conf + many detections + mixed sizes
  if (isHighConfidence && manyDetections && !isVeryDiffuse) {
    return "Fire & Smoke"
  }
  
  // FIRE: High confidence + compact
  if ((isVeryHighConfidence || isHighConfidence) && isCompact) {
    return "Fire"
  }
  
  // SMOKE: Medium confidence + not very compact
  if (isMediumConfidence && !isVeryCompact) {
    return "Smoke"
  }

  // Default based on box size (most reliable indicator)
  if (avgBoxSize >= 0.25) {
    return "Smoke"  // Large boxes = smoke
  } else if (avgBoxSize < 0.15) {
    return "Fire"   // Small boxes = fire
  }
  
  // Final fallback based on confidence
  if (confidence >= 0.85) {
    return "Fire"
  } else {
    return "Smoke"
  }
}

function calculateRiskLevel(
  confidence: number,
  detectionType: string
): "Low" | "Medium" | "High" | "Critical" {
  
  if (detectionType === "No Fire") {
    return "Low"
  }

  // Fire is more dangerous than smoke
  if (detectionType === "Fire" || detectionType === "Fire & Smoke") {
    if (confidence >= 0.80) return "Critical"
    if (confidence >= 0.60) return "High"
    if (confidence >= 0.40) return "Medium"
    return "Low"
  }

  // Smoke only
  if (detectionType === "Smoke") {
    if (confidence >= 0.85) return "High"
    if (confidence >= 0.70) return "Medium"
    if (confidence >= 0.50) return "Medium"
    return "Low"
  }

  return "Medium"
}