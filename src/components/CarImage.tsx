import React, { useState } from 'react';
import { Zap } from 'lucide-react';

interface CarImageProps {
  src?: string;
  alt: string;
  brand?: string;
  model?: string;
  bodyType?: string;
  isEV?: boolean;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
}

export const CarImage: React.FC<CarImageProps> = ({
  src,
  alt,
  brand,
  model,
  bodyType = 'SUV',
  isEV = false,
  className = '',
  containerClassName = '',
  onClick,
  loading = 'lazy'
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const displayName = brand && model ? `${brand} ${model}` : alt;

  // Render SVG Vehicle Silhouette based on body type
  const renderVehicleSilhouette = () => {
    const type = (bodyType || '').toLowerCase();
    
    if (type.includes('sedan')) {
      return (
        <svg viewBox="0 0 240 100" className="w-4/5 h-auto text-emerald-600/80 opacity-90 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Sedan Silhouette */}
          <path d="M 20 70 L 45 70 M 75 70 L 165 70 M 195 70 L 225 70" />
          <path d="M 20 70 C 20 62, 35 58, 50 56 L 80 54 L 110 32 L 160 32 L 185 54 L 215 56 C 225 58, 228 64, 225 70" />
          <path d="M 85 54 L 112 34 L 158 34 L 178 54 Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M 132 34 L 132 54" />
          {/* Wheels */}
          <circle cx="60" cy="70" r="14" strokeWidth="3" />
          <circle cx="60" cy="70" r="6" fill="currentColor" />
          <circle cx="180" cy="70" r="14" strokeWidth="3" />
          <circle cx="180" cy="70" r="6" fill="currentColor" />
        </svg>
      );
    }

    if (type.includes('hatchback')) {
      return (
        <svg viewBox="0 0 240 100" className="w-4/5 h-auto text-emerald-600/80 opacity-90 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Hatchback Silhouette */}
          <path d="M 25 70 L 45 70 M 75 70 L 165 70 M 195 70 L 220 70" />
          <path d="M 25 70 C 25 62, 38 58, 55 56 L 80 54 L 105 34 L 175 34 L 195 50 L 215 58 C 222 62, 222 66, 220 70" />
          <path d="M 85 54 L 107 36 L 170 36 L 188 52 Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M 138 36 L 138 53" />
          {/* Wheels */}
          <circle cx="60" cy="70" r="14" strokeWidth="3" />
          <circle cx="60" cy="70" r="6" fill="currentColor" />
          <circle cx="180" cy="70" r="14" strokeWidth="3" />
          <circle cx="180" cy="70" r="6" fill="currentColor" />
        </svg>
      );
    }

    if (type.includes('mpv')) {
      return (
        <svg viewBox="0 0 240 100" className="w-4/5 h-auto text-emerald-600/80 opacity-90 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* MPV Silhouette */}
          <path d="M 20 70 L 45 70 M 75 70 L 165 70 M 195 70 L 225 70" />
          <path d="M 20 70 C 20 60, 32 55, 50 52 L 80 44 L 105 28 L 190 28 L 210 50 L 225 60 C 228 65, 228 68, 225 70" />
          <path d="M 82 46 L 107 30 L 185 30 L 202 50 Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M 125 30 L 125 50" />
          <path d="M 160 30 L 160 50" />
          {/* Wheels */}
          <circle cx="60" cy="70" r="14" strokeWidth="3" />
          <circle cx="60" cy="70" r="6" fill="currentColor" />
          <circle cx="180" cy="70" r="14" strokeWidth="3" />
          <circle cx="180" cy="70" r="6" fill="currentColor" />
        </svg>
      );
    }

    // Default SUV Silhouette
    return (
      <svg viewBox="0 0 240 100" className="w-4/5 h-auto text-emerald-600/80 opacity-90 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* SUV Silhouette */}
        <path d="M 15 72 L 45 72 M 75 72 L 165 72 M 195 72 L 225 72" />
        <path d="M 15 72 C 15 60, 30 52, 50 50 L 78 46 L 100 28 L 180 28 L 205 48 L 225 54 C 228 60, 228 66, 225 72" />
        <path d="M 80 48 L 102 30 L 175 30 L 195 48 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M 135 30 L 135 48" />
        {/* Roof Rails */}
        <path d="M 110 24 L 170 24" strokeWidth="2" strokeDasharray="3 3" />
        {/* Wheels with higher ground clearance */}
        <circle cx="60" cy="72" r="15" strokeWidth="3" />
        <circle cx="60" cy="72" r="6" fill="currentColor" />
        <circle cx="180" cy="72" r="15" strokeWidth="3" />
        <circle cx="180" cy="72" r="6" fill="currentColor" />
      </svg>
    );
  };

  return (
    <div 
      className={`relative w-full h-full overflow-hidden select-none ${containerClassName}`}
      onClick={onClick}
    >
      {/* Background container */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#151923] via-[#0E121A] to-[#0A0D14]" />

      {/* Main Image if available and not errored */}
      {src && !hasError ? (
        <>
          <img
            src={src}
            alt={displayName}
            referrerPolicy="no-referrer"
            loading={loading}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`relative w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
          />
          {/* Subtle bottom shadow vignette for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11]/90 via-transparent to-transparent pointer-events-none opacity-80" />
        </>
      ) : null}

      {/* Accurate Branded Vehicle Silhouette Fallback when image is missing or failed */}
      {(!src || hasError || !isLoaded) && (
        <div className={`absolute inset-0 flex flex-col items-center justify-between p-4 bg-gradient-to-b from-[#141A26] via-[#0E121A] to-[#090C12] ${hasError || !src ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          {/* Top Model Badge */}
          <div className="w-full flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-600 flex items-center gap-1 tracking-wide">
              {brand || 'Official Model'}
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {bodyType}
            </span>
          </div>

          {/* Center Graphic */}
          <div className="my-auto flex flex-col items-center justify-center scale-95 transition-transform">
            {renderVehicleSilhouette()}
            <div className="mt-2 text-center">
              <div className="text-sm font-bold text-slate-800 font-['Manrope'] drop-shadow-sm">
                {brand} {model}
              </div>
              <div className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1 mt-0.5">
                {isEV ? (
                  <span className="text-cyan-600 font-semibold flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5" /> 100% Electric Powertrain
                  </span>
                ) : (
                  <span>Official Specification Profile</span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom subtle bar */}
          <div className="w-full flex items-center justify-center">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
              India Edition • Verified Model
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
