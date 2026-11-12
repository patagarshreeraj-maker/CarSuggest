import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ALL_CAR_BRANDS, BrandInfo } from '../data/brands';

interface BrandLogosScrollProps {
  onExploreCars?: () => void;
  onSelectBrand?: (brand: string) => void;
}

const BrandLogoCard: React.FC<{
  brand: BrandInfo;
  onClick?: () => void;
}> = ({ brand, onClick }) => {
  const [imgSrc, setImgSrc] = useState(brand.logo);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative flex shrink-0 cursor-pointer items-center gap-4 rounded-2xl border border-slate-200/90 bg-white/95 px-5 py-3.5 shadow-xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-white hover:shadow-md hover:shadow-emerald-500/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
    >
      {/* Brand Logo Container */}
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2 border border-slate-100 transition-transform duration-300 group-hover:scale-105 group-hover:border-emerald-200 group-hover:bg-emerald-50/30">
        {!imgError ? (
          <img
            src={imgSrc}
            alt={`${brand.name} logo`}
            loading="lazy"
            onError={() => {
              if (imgSrc !== brand.fallbackLogo) {
                setImgSrc(brand.fallbackLogo);
              } else {
                setImgError(true);
              }
            }}
            className="h-full w-full object-contain filter drop-shadow-xs transition-transform duration-300 group-hover:drop-shadow-sm"
          />
        ) : (
          <span className="font-['Manrope'] text-sm font-bold text-slate-700">
            {brand.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Brand Info */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span className="font-['Manrope'] text-sm font-bold text-slate-900 transition-colors duration-300 group-hover:text-emerald-700">
            {brand.name}
          </span>
          {brand.origin && (
            <span className="hidden text-[10px] text-slate-400 sm:inline">
              • {brand.origin}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium text-slate-500 transition-colors duration-300 group-hover:text-slate-700">
          {brand.tag}
        </span>
      </div>
    </div>
  );
};

export const BrandLogosScroll: React.FC<BrandLogosScrollProps> = ({
  onExploreCars,
  onSelectBrand
}) => {
  // Split 35 brands into 2 rows for a rich, dynamic multi-tier horizontal scroll
  const half = Math.ceil(ALL_CAR_BRANDS.length / 2);
  const row1 = ALL_CAR_BRANDS.slice(0, half);
  const row2 = ALL_CAR_BRANDS.slice(half);

  // Duplicate each row for continuous seamless looping
  const duplicatedRow1 = [...row1, ...row1];
  const duplicatedRow2 = [...row2, ...row2];

  const handleBrandClick = (brandName: string) => {
    if (onSelectBrand) {
      onSelectBrand(brandName);
    } else if (onExploreCars) {
      onExploreCars();
    }
  };

  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 py-20">
      {/* Background radial accent */}
      <div className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

      {/* Section Header */}
      <div className="mx-auto mb-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>All 35 Car Brands in India</span>
            </div>
            <h2 className="heading-2 mt-4 text-slate-900">
              Every automotive brand, in one continuous scroll
            </h2>
            <p className="body-3 mt-3">
              Explore India's entire automotive landscape. Hover any logo to pause the animation, or click to explore vehicles by manufacturer.
            </p>
          </div>

          {onExploreCars && (
            <button
              onClick={onExploreCars}
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all duration-300 hover:border-emerald-600/40 hover:text-emerald-700 hover:shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Open car catalogue
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrolling Tracks */}
      <div className="relative flex flex-col gap-5 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
        {/* Track 1: Moving left */}
        <div className="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused]">
          {duplicatedRow1.map((brand, i) => (
            <BrandLogoCard
              key={`row1-${brand.slug}-${i}`}
              brand={brand}
              onClick={() => handleBrandClick(brand.name)}
            />
          ))}
        </div>

        {/* Track 2: Moving right (reverse) */}
        <div className="flex w-max animate-marquee-reverse gap-5 hover:[animation-play-state:paused]">
          {duplicatedRow2.map((brand, i) => (
            <BrandLogoCard
              key={`row2-${brand.slug}-${i}`}
              brand={brand}
              onClick={() => handleBrandClick(brand.name)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="mx-auto mt-8 flex max-w-7xl items-center justify-between px-4 text-xs text-slate-500 sm:px-6 lg:px-8">
        <span>✨ 35 official manufacturer emblems with real-time looping</span>
        <span>Hover any brand to pause • Click to browse</span>
      </div>
    </section>
  );
};
