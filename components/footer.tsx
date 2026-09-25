import Link from "next/link"
import { Logo } from "./logo-dynamic-flames"
import { Github, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Logo variant="compact" />
            <p className="text-sm text-slate-600 leading-relaxed">
              AI-powered forest fire detection and monitoring system for Sumatra.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/upload", label: "Detection" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/risk-prediction", label: "Risk Prediction" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-600 hover:text-red-700 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Contact</h3>
            <div className="space-y-3">
              <a
                href="mailto:contact@ifire.ai"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@ifire.ai
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-700 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            © {currentYear} iFire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}