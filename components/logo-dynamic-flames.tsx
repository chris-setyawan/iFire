interface LogoProps {
  variant?: "full" | "icon" | "compact"
  className?: string
  iconClassName?: string
  textClassName?: string
}

export function Logo({ 
  variant = "full", 
  className = "",
  iconClassName = "",
  textClassName = ""
}: LogoProps) {
  // Multi-layered Dynamic Flame (inspired by user's images)
  const DynamicFlame = ({ size = 40 }: { size?: number }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={iconClassName}
    >
      <defs>
        {/* Gradient 1 - Yellow/Amber (left flame) */}
        <linearGradient id="flame-yellow" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Gradient 2 - Orange (center flame) */}
        <linearGradient id="flame-orange" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#b91c1c', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Gradient 3 - Red/Orange (right flame) */}
        <linearGradient id="flame-red" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#7f1d1d', stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
        </linearGradient>

        {/* Gradient 4 - Yellow highlight (inner flame) */}
        <linearGradient id="flame-highlight" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
          <stop offset="60%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fde047', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Back flame (left) - Yellow/Amber */}
      <path
        d="M 30 80 Q 25 70, 20 55 Q 18 40, 22 28 Q 25 18, 28 10 Q 30 5, 32 8 Q 35 15, 36 25 Q 38 40, 40 55 Q 42 68, 38 78 Q 35 82, 30 80 Z"
        fill="url(#flame-yellow)"
        opacity="0.9"
      />
      
      {/* Center flame - Orange (main) */}
      <path
        d="M 50 85 Q 42 75, 38 60 Q 35 45, 38 30 Q 40 18, 45 8 Q 48 2, 52 5 Q 56 12, 58 25 Q 60 40, 62 55 Q 64 70, 60 80 Q 56 86, 50 85 Z"
        fill="url(#flame-orange)"
      />
      
      {/* Right flame - Red/Orange */}
      <path
        d="M 70 80 Q 68 70, 66 55 Q 64 40, 66 28 Q 68 18, 72 10 Q 74 5, 76 8 Q 78 15, 78 25 Q 78 40, 76 55 Q 74 68, 72 78 Q 70 82, 70 80 Z"
        fill="url(#flame-red)"
        opacity="0.85"
      />
      
      {/* Inner highlight flame - Yellow */}
      <path
        d="M 50 75 Q 46 65, 44 52 Q 43 40, 45 30 Q 47 22, 50 15 Q 52 12, 54 15 Q 56 22, 56 32 Q 56 45, 55 58 Q 54 68, 52 74 Q 50 76, 50 75 Z"
        fill="url(#flame-highlight)"
        opacity="0.7"
      />
      
      {/* Small accent flames */}
      <path
        d="M 35 70 Q 33 60, 34 50 Q 35 42, 38 35 Q 40 32, 42 36 Q 43 42, 42 50 Q 41 60, 39 68 Q 37 71, 35 70 Z"
        fill="url(#flame-highlight)"
        opacity="0.5"
      />
      
      <path
        d="M 65 70 Q 63 60, 64 50 Q 65 42, 67 35 Q 68 32, 70 36 Q 71 42, 70 50 Q 69 60, 67 68 Q 65 71, 65 70 Z"
        fill="url(#flame-highlight)"
        opacity="0.5"
      />
    </svg>
  )

  if (variant === "icon") {
    return (
      <div className={`relative ${className}`}>
        <DynamicFlame size={40} />
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative">
          <DynamicFlame size={32} />
        </div>
        <span className={`text-xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 bg-clip-text text-transparent ${textClassName}`}>
          iFire
        </span>
      </div>
    )
  }

  // Full variant (default)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <DynamicFlame size={48} />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 bg-clip-text text-transparent leading-none">
          iFire
        </span>
        <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
          Fire Detection AI
        </span>
      </div>
    </div>
  )
}

// Variant untuk dark background
export function LogoLight({ 
  variant = "full", 
  className = "",
}: LogoProps) {
  const DynamicFlame = ({ size = 40 }: { size?: number }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="flame-light-yellow" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fde047', stopOpacity: 1 }} />
        </linearGradient>
        
        <linearGradient id="flame-light-orange" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
        </linearGradient>
        
        <linearGradient id="flame-light-red" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#b91c1c', stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
        </linearGradient>

        <linearGradient id="flame-light-highlight" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
          <stop offset="60%" style={{ stopColor: '#fde047', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fef08a', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      <path
        d="M 30 80 Q 25 70, 20 55 Q 18 40, 22 28 Q 25 18, 28 10 Q 30 5, 32 8 Q 35 15, 36 25 Q 38 40, 40 55 Q 42 68, 38 78 Q 35 82, 30 80 Z"
        fill="url(#flame-light-yellow)"
        opacity="0.9"
      />
      
      <path
        d="M 50 85 Q 42 75, 38 60 Q 35 45, 38 30 Q 40 18, 45 8 Q 48 2, 52 5 Q 56 12, 58 25 Q 60 40, 62 55 Q 64 70, 60 80 Q 56 86, 50 85 Z"
        fill="url(#flame-light-orange)"
      />
      
      <path
        d="M 70 80 Q 68 70, 66 55 Q 64 40, 66 28 Q 68 18, 72 10 Q 74 5, 76 8 Q 78 15, 78 25 Q 78 40, 76 55 Q 74 68, 72 78 Q 70 82, 70 80 Z"
        fill="url(#flame-light-red)"
        opacity="0.85"
      />
      
      <path
        d="M 50 75 Q 46 65, 44 52 Q 43 40, 45 30 Q 47 22, 50 15 Q 52 12, 54 15 Q 56 22, 56 32 Q 56 45, 55 58 Q 54 68, 52 74 Q 50 76, 50 75 Z"
        fill="url(#flame-light-highlight)"
        opacity="0.7"
      />
      
      <path
        d="M 35 70 Q 33 60, 34 50 Q 35 42, 38 35 Q 40 32, 42 36 Q 43 42, 42 50 Q 41 60, 39 68 Q 37 71, 35 70 Z"
        fill="url(#flame-light-highlight)"
        opacity="0.5"
      />
      
      <path
        d="M 65 70 Q 63 60, 64 50 Q 65 42, 67 35 Q 68 32, 70 36 Q 71 42, 70 50 Q 69 60, 67 68 Q 65 71, 65 70 Z"
        fill="url(#flame-light-highlight)"
        opacity="0.5"
      />
    </svg>
  )

  if (variant === "icon") {
    return (
      <div className={`relative ${className}`}>
        <DynamicFlame size={40} />
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative">
          <DynamicFlame size={32} />
        </div>
        <span className="text-xl font-bold text-white">
          iFire
        </span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <DynamicFlame size={48} />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white leading-none">
          iFire
        </span>
        <span className="text-[10px] text-white/70 font-medium tracking-wider uppercase">
          Fire Detection AI
        </span>
      </div>
    </div>
  )
}

// Export standalone dynamic flame icon
export function DynamicFlameIcon({ 
  size = 40, 
  className = "" 
}: { 
  size?: number
  className?: string 
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`flame-dyn-yellow-${size}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
        </linearGradient>
        
        <linearGradient id={`flame-dyn-orange-${size}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#b91c1c', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
        </linearGradient>
        
        <linearGradient id={`flame-dyn-red-${size}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#7f1d1d', stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
        </linearGradient>

        <linearGradient id={`flame-dyn-highlight-${size}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
          <stop offset="60%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fde047', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      <path
        d="M 30 80 Q 25 70, 20 55 Q 18 40, 22 28 Q 25 18, 28 10 Q 30 5, 32 8 Q 35 15, 36 25 Q 38 40, 40 55 Q 42 68, 38 78 Q 35 82, 30 80 Z"
        fill={`url(#flame-dyn-yellow-${size})`}
        opacity="0.9"
      />
      
      <path
        d="M 50 85 Q 42 75, 38 60 Q 35 45, 38 30 Q 40 18, 45 8 Q 48 2, 52 5 Q 56 12, 58 25 Q 60 40, 62 55 Q 64 70, 60 80 Q 56 86, 50 85 Z"
        fill={`url(#flame-dyn-orange-${size})`}
      />
      
      <path
        d="M 70 80 Q 68 70, 66 55 Q 64 40, 66 28 Q 68 18, 72 10 Q 74 5, 76 8 Q 78 15, 78 25 Q 78 40, 76 55 Q 74 68, 72 78 Q 70 82, 70 80 Z"
        fill={`url(#flame-dyn-red-${size})`}
        opacity="0.85"
      />
      
      <path
        d="M 50 75 Q 46 65, 44 52 Q 43 40, 45 30 Q 47 22, 50 15 Q 52 12, 54 15 Q 56 22, 56 32 Q 56 45, 55 58 Q 54 68, 52 74 Q 50 76, 50 75 Z"
        fill={`url(#flame-dyn-highlight-${size})`}
        opacity="0.7"
      />
      
      <path
        d="M 35 70 Q 33 60, 34 50 Q 35 42, 38 35 Q 40 32, 42 36 Q 43 42, 42 50 Q 41 60, 39 68 Q 37 71, 35 70 Z"
        fill={`url(#flame-dyn-highlight-${size})`}
        opacity="0.5"
      />
      
      <path
        d="M 65 70 Q 63 60, 64 50 Q 65 42, 67 35 Q 68 32, 70 36 Q 71 42, 70 50 Q 69 60, 67 68 Q 65 71, 65 70 Z"
        fill={`url(#flame-dyn-highlight-${size})`}
        opacity="0.5"
      />
    </svg>
  )
}