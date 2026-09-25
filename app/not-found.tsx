import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-orange-50/30 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Page Not Found</h2>
        
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white font-semibold">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  )
}
