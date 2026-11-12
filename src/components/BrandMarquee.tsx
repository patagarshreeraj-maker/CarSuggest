import React, { useState } from 'react';
import { ALL_CAR_BRANDS, BrandInfo } from '../data/brands';

export const BrandMarquee: React.FC<{
  onSelectBrand?: (brand: string) => void;
}> = ({ onSelectBrand }) => {
  // Duplicate for seamless infinite marquee loop
  const row = [...ALL_CAR_BRANDS, ...ALL_CAR_BRANDS];

  return (
    <div className="relative overflow-hidden border-y border-slate-200 bg-slate-50/80 py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
        Every major car brand in the Indian market
      </p>
      <div className="flex w-max animate-marquee gap-8 hover:[animation-play-state:paused]">
        {row.map((brand, i) => (
          <BrandMarqueeItem
            key={`${brand.slug}-${i}`}
            brand={brand}
            onClick={() => onSelectBrand?.(brand.name)}
          />
        ))}
      </div>
    </div>
  );
};

const BrandMarqueeItem: React.FC<{
  brand: BrandInfo;
  onClick?: () => void;
}> = ({ brand, onClick }) => {
  const [imgSrc, setImgSrc] = useState(brand.logo);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`flex shrink-0 items-center gap-3 rounded-full border border-slate-200/80 bg-white px-4 py-2 shadow-2xs transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xs ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
        {!hasError ? (
          <img
            src={imgSrc}
            alt={brand.name}
            loading="lazy"
            onError={() => {
              if (imgSrc !== brand.fallbackLogo) {
                setImgSrc(brand.fallbackLogo);
              } else {
                setHasError(true);
              }
            }}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-[10px] font-bold text-slate-600">
            {brand.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <span className="font-['Manrope'] text-xs font-bold text-slate-800">
        {brand.name}
      </span>
      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
        {brand.tag.split(' ')[0]}
      </span>
    </div>
  );
};
