import React from 'react';

interface BrandItem {
  name: string;
  tag: string;
}

const BRANDS: BrandItem[] = [
  { name: 'Maruti Suzuki', tag: 'Mileage' },
  { name: 'Hyundai', tag: 'ADAS' },
  { name: 'Tata', tag: '5★ BNCAP' },
  { name: 'Mahindra', tag: 'EV Range' },
  { name: 'Toyota', tag: 'Hybrid' },
  { name: 'Kia', tag: 'Design' },
  { name: 'Honda', tag: 'Reliability' },
  { name: 'MG', tag: 'Smart EV' },
  { name: 'Renault', tag: 'Value' },
  { name: 'Nissan', tag: 'Turbo' },
  { name: 'Volkswagen', tag: 'German Build' },
  { name: 'Skoda', tag: '1.5 TSI' },
  { name: 'Jeep', tag: 'Off-Road' },
  { name: 'Citroën', tag: 'Comfort' },
  { name: 'Force Motors', tag: '4x4' },
  { name: 'Isuzu', tag: 'Diesel' },
  { name: 'BYD', tag: 'Blade EV' },
  { name: 'Volvo', tag: 'Safety' },
  { name: 'BMW', tag: 'Driving' },
  { name: 'Mercedes-Benz', tag: 'Luxury' },
  { name: 'Audi', tag: 'Quattro' },
  { name: 'Lexus', tag: 'Craft' },
  { name: 'Land Rover', tag: 'Capability' },
  { name: 'Jaguar', tag: 'Style' },
  { name: 'MINI', tag: 'Fun' },
  { name: 'Porsche', tag: 'Precision' },
  { name: 'Lamborghini', tag: 'V12' },
  { name: 'Ferrari', tag: 'V6 Hybrid' },
  { name: 'Maserati', tag: 'Italian' },
  { name: 'McLaren', tag: 'Race' },
  { name: 'Aston Martin', tag: 'GT' },
  { name: 'Bentley', tag: 'Handcrafted' },
  { name: 'Rolls-Royce', tag: 'Bespoke' },
  { name: 'Tesla', tag: 'Electric' },
  { name: 'VinFast', tag: 'New Entrant' }
];

export const BrandMarquee: React.FC = () => {
  // Duplicate the row so the -50% translate loops seamlessly
  const row = [...BRANDS, ...BRANDS];

  return (
    <div className="relative overflow-hidden py-7 border-y border-slate-200 bg-slate-50 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 text-center mb-4">
        Every major brand in the Indian market
      </p>
      <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
        {row.map((brand, i) => (
          <div key={i} className="flex items-center gap-2.5 shrink-0">
            <span className="text-sm font-bold text-slate-500 font-['Manrope']">{brand.name}</span>
            <span className="text-[10px] font-semibold text-emerald-600/90 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {brand.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
