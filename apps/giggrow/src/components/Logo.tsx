import React, { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8", showText = true }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('giggrow_4k_logo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  if (logoUrl) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img 
          src={logoUrl} 
          alt="GIGGROW Logo" 
          className="h-full w-auto rounded-sm object-contain"
          referrerPolicy="no-referrer"
          onError={() => {
            localStorage.removeItem('giggrow_4k_logo');
            setLogoUrl(null);
          }}
        />
        {showText && (
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black italic tracking-tighter text-ml-accent drop-shadow-[0_0_15px_rgba(88,166,255,0.8)]">
              GIG<span className="text-white">GROW</span>
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-ml-sub opacity-80">
              Marketplace OS
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Outer Circle / Shield Base */}
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" className="text-ml-accent/20" />
        
        {/* Lightning Bolt */}
        <path
          d="M55 20L35 50H50L40 80L65 45H50L60 20H55Z"
          fill="url(#logo-gradient)"
          className="drop-shadow-[0_0_8px_rgba(88,166,255,0.6)]"
        />
        
        {/* Stylized 'G' / Growth Symbol */}
        <path
          d="M75 50C75 63.8071 63.8071 75 50 75C36.1929 75 25 63.8071 25 50C25 36.1929 36.1929 25 50 25C58.2843 25 65.7843 29.4772 70 36.5"
          stroke="url(#logo-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.5"
        />
        
        {/* Accent Dot */}
        <circle cx="75" cy="50" r="4" fill="var(--ml-accent)" className="animate-pulse" />

        <defs>
          <linearGradient id="logo-gradient" x1="25" y1="25" x2="75" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--ml-accent)" />
            <stop offset="1" stopColor="var(--ml-accent-2)" />
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-2xl font-black italic tracking-tighter text-ml-accent drop-shadow-[0_0_15px_rgba(88,166,255,0.8)]">
            GIG<span className="text-white">GROW</span>
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-ml-sub opacity-80">
            Marketplace OS
          </span>
        </div>
      )}
    </div>
  );
};
