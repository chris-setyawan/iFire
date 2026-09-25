"use client"

import { Card } from "@/components/ui/card"

export default function UploadGuidelines() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Supported Formats */}
      <Card className="p-6 border-border bg-card">
        <h3 className="font-semibold text-lg mb-4 text-foreground">Supported Formats</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2 text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Image: PNG, JPG, GIF, WebP</span>
          </li>
          <li className="flex items-center gap-2 text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Max File Size: 10MB</span>
          </li>
          <li className="flex items-center gap-2 text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Resolution: 640x480 or higher</span>
          </li>
        </ul>
      </Card>

      {/* Best Practices */}
      <Card className="p-6 border-border bg-card">
        <h3 className="font-semibold text-lg mb-4 text-foreground">Best Practices</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2 text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Use clear, daytime images</span>
          </li>
          <li className="flex items-center gap-2 text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Avoid blurry or low-light photos</span>
          </li>
          <li className="flex items-center gap-2 text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Include forest area in frame</span>
          </li>
          <li className="flex items-center gap-2 text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Multiple angles improve accuracy</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
