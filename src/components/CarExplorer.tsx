import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  ShieldCheck, 
  Zap, 
  X, 
  Sparkles,
  Fuel,
  Gauge,
  Users,
  Award,
  ArrowUpDown,
  RotateCcw,
  Check,
  Flame,
  Sun,
  Fan,
  Camera,
  Car as CarIcon,
  Heart,
  ArrowLeftRight,
  Eye,
  ChevronRight,
  BatteryCharging
} from 'lucide-react';
import { Car, BodyType, FuelType, MatchScoreBreakdown } from '../types';
import { CarCard } from './CarCard';
import { CarImage } from './CarImage';

interface CarExplorerProps {
  cars: Car[];
  matchScoresMap?: Record<string, MatchScoreBreakdown>;
  favoriteCarIds: string[];
  comparedCarIds: string[];
  onToggleFavorite: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
  onViewDetails: (car: Car) => void;
  onOpenFinder: () => void;
  initialCategoryFilter?: string;
}

export const CarExplorer: React.FC<CarExplorerProps> = ({
  cars,
  matchScoresMap,
  favoriteCarIds,
  comparedCarIds,
  onToggleFavorite,
  onToggleCompare,
  onViewDetails,
  onOpenFinder,
  initialCategoryFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('All');
  const [selectedFuel, setSelectedFuel] = useState<string>('All');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('All');

  // Dynamic price ceiling so newly added luxury/supercar models stay visible
  const MAX_PRICE_CAP = Math.max(35, Math.ceil(Math.max(...cars.map((c) => c.priceMaxLakh)) / 5) * 5);
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_CAP);
  const [selectedSeating, setSelectedSeating] = useState<string>('All');
  
  // Feature filters
  const [only5StarSafety, setOnly5StarSafety] = useState<boolean>(false);
  const [onlyADAS, setOnlyADAS] = useState<boolean>(false);
  const [onlySunroof, setOnlySunroof] = useState<boolean>(false);
  const [onlyVentilatedSeats, setOnlyVentilatedSeats] = useState<boolean>(false);
  const [only360Camera, setOnly360Camera] = useState<boolean>(false);
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  
  // View & Sort
  const [sortBy, setSortBy] = useState<'match' | 'price-asc' | 'price-desc' | 'mileage' | 'power' | 'boot' | 'safety'>('match');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('all');

  // Handle initial category filter if passed
  useEffect(() => {
    if (initialCategoryFilter) {
      if (initialCategoryFilter === 'Electric') {
        setSelectedFuel('Electric');
        setActivePreset('ev');
      } else if (initialCategoryFilter === 'Strong Hybrid') {
        setSelectedFuel('Strong Hybrid');
        setActivePreset('hybrid');
      } else if (initialCategoryFilter === '5-Star') {
        setOnly5StarSafety(true);
        setActivePreset('safety');
      } else if (initialCategoryFilter === 'ADAS') {
        setOnlyADAS(true);
        setActivePreset('adas');
      } else if (initialCategoryFilter === '7-Seater') {
        setSelectedSeating('7');
        setActivePreset('7seater');
      } else if (initialCategoryFilter === 'Under12L') {
        setMaxPrice(12);
        setActivePreset('budget');
      } else if (initialCategoryFilter === 'favorites' || initialCategoryFilter === 'Saved') {
        setOnlyFavorites(true);
        setActivePreset('favorites');
      }
    }
  }, [initialCategoryFilter]);

  // Unique brands
  const brands = useMemo(() => {
    const unique = Array.from(new Set(cars.map((c) => c.brand))).sort();
    return ['All', ...unique];
  }, [cars]);

  const bodyTypes: string[] = ['All', 'SUV', 'Compact SUV', 'Sedan', 'MPV', 'Hatchback'];
  const fuelTypes: string[] = ['All', 'Electric', 'Strong Hybrid', 'Petrol', 'Diesel', 'CNG'];
  const transmissionTypes: string[] = ['All', 'Manual', 'Automatic', 'DCT', 'CVT', 'e-CVT'];

  // Quick Preset Click Handler
  const handlePresetSelect = (presetKey: string) => {
    setActivePreset(presetKey);
    // Reset individual filters first
    setSelectedBrand('All');
    setSelectedBodyType('All');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setMaxPrice(MAX_PRICE_CAP);
    setSelectedSeating('All');
    setOnly5StarSafety(false);
    setOnlyADAS(false);
    setOnlySunroof(false);
    setOnlyVentilatedSeats(false);
    setOnly360Camera(false);
    setOnlyFavorites(false);

    switch (presetKey) {
      case 'all':
        break;
      case 'favorites':
        setOnlyFavorites(true);
        break;
      case 'ev':
        setSelectedFuel('Electric');
        break;
      case 'hybrid':
        setSelectedFuel('Strong Hybrid');
        break;
      case 'safety':
        setOnly5StarSafety(true);
        break;
      case 'adas':
        setOnlyADAS(true);
        break;
      case '7seater':
        setSelectedSeating('7');
        break;
      case 'budget':
        setMaxPrice(12);
        break;
      case 'performance':
        setSortBy('power');
        break;
      case 'sedans':
        setSelectedBodyType('Sedan');
        break;
    }
  };

  // Filter and Sort Engine
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // 0. Favorites filter
      if (onlyFavorites && !favoriteCarIds.includes(car.id)) {
        return false;
      }

      // 1. Text Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesBrand = car.brand.toLowerCase().includes(query);
        const matchesModel = car.model.toLowerCase().includes(query);
        const matchesTagline = car.tagline.toLowerCase().includes(query);
        const matchesBody = car.bodyType.toLowerCase().includes(query);
        const matchesFuel = car.fuelTypes.some(f => f.toLowerCase().includes(query));
        if (!matchesBrand && !matchesModel && !matchesTagline && !matchesBody && !matchesFuel) {
          return false;
        }
      }

      // 2. Brand Filter
      if (selectedBrand !== 'All' && car.brand !== selectedBrand) {
        return false;
      }

      // 3. Body Type
      if (selectedBodyType !== 'All' && car.bodyType !== selectedBodyType) {
        return false;
      }

      // 4. Fuel Type
      if (selectedFuel !== 'All') {
        if (!car.fuelTypes.includes(selectedFuel as FuelType)) {
          return false;
        }
      }

      // 5. Transmission
      if (selectedTransmission !== 'All') {
        const hasTransmission = car.specs.transmission.some(t => 
          t.toLowerCase().includes(selectedTransmission.toLowerCase())
        );
        if (!hasTransmission) return false;
      }

      // 6. Price Filter
      if (car.priceMinLakh > maxPrice) {
        return false;
      }

      // 7. Safety Filter
      if (only5StarSafety && car.safety.ratingStars < 5) {
        return false;
      }

      // 8. ADAS Filter
      if (onlyADAS && !car.safety.hasADAS) {
        return false;
      }

      // 9. Sunroof Filter
      if (onlySunroof && car.features.sunroof === 'None') {
        return false;
      }

      // 10. Ventilated Seats
      if (onlyVentilatedSeats && !car.features.ventilatedSeats) {
        return false;
      }

      // 11. 360 Camera
      if (only360Camera && !car.safety.has360Camera) {
        return false;
      }

      // 12. Seating Capacity Filter
      if (selectedSeating !== 'All') {
        if (selectedSeating === '7' && car.specs.seatingCapacity < 7) return false;
        if (selectedSeating === '5' && car.specs.seatingCapacity !== 5) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match') {
        const scoreA = matchScoresMap?.[a.id]?.overallScore || 70;
        const scoreB = matchScoresMap?.[b.id]?.overallScore || 70;
        return scoreB - scoreA;
      }
      if (sortBy === 'price-asc') return a.priceMinLakh - b.priceMinLakh;
      if (sortBy === 'price-desc') return b.priceMinLakh - a.priceMinLakh;
      if (sortBy === 'mileage') return b.specs.mileageKmPerLitreOrKWh - a.specs.mileageKmPerLitreOrKWh;
      if (sortBy === 'power') return b.specs.powerPS - a.specs.powerPS;
      if (sortBy === 'boot') return b.specs.bootSpaceLitres - a.specs.bootSpaceLitres;
      if (sortBy === 'safety') return b.safety.ratingStars - a.safety.ratingStars;
      return 0;
    });
  }, [
    cars,
    searchTerm,
    selectedBrand,
    selectedBodyType,
    selectedFuel,
    selectedTransmission,
    maxPrice,
    only5StarSafety,
    onlyADAS,
    onlySunroof,
    onlyVentilatedSeats,
    only360Camera,
    selectedSeating,
    sortBy,
    matchScoresMap,
    onlyFavorites,
    favoriteCarIds
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBrand('All');
    setSelectedBodyType('All');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setMaxPrice(MAX_PRICE_CAP);
    setOnly5StarSafety(false);
    setOnlyADAS(false);
    setOnlySunroof(false);
    setOnlyVentilatedSeats(false);
    setOnly360Camera(false);
    setOnlyFavorites(false);
    setSelectedSeating('All');
    setSortBy('match');
    setActivePreset('all');
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (selectedBrand !== 'All') count++;
    if (selectedBodyType !== 'All') count++;
    if (selectedFuel !== 'All') count++;
    if (selectedTransmission !== 'All') count++;
    if (maxPrice < MAX_PRICE_CAP) count++;
    if (selectedSeating !== 'All') count++;
    if (only5StarSafety) count++;
    if (onlyADAS) count++;
    if (onlySunroof) count++;
    if (onlyVentilatedSeats) count++;
    if (only360Camera) count++;
    if (onlyFavorites) count++;
    return count;
  }, [
    searchTerm,
    selectedBrand,
    selectedBodyType,
    selectedFuel,
    selectedTransmission,
    maxPrice,
    selectedSeating,
    only5StarSafety,
    onlyADAS,
    onlySunroof,
    onlyVentilatedSeats,
    only360Camera,
    onlyFavorites
  ]);

  // Average price in current selection
  const avgSelectionPrice = useMemo(() => {
    if (filteredCars.length === 0) return 0;
    const sum = filteredCars.reduce((acc, c) => acc + ((c.priceMinLakh + c.priceMaxLakh) / 2), 0);
    return (sum / filteredCars.length).toFixed(1);
  }, [filteredCars]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ff5a1f]/10 text-[#ff5a1f] border border-[#ff5a1f]/20">
              {cars.length} Verified Cars
            </span>
            <span className="text-xs text-[#556078] dark:text-[#9aa6c0]">• Indian Market 2025-2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101624] dark:text-[#eef2fb] font-['Unbounded',sans-serif] mt-1 tracking-tight">
            Explore All Vehicles
          </h2>
          <p className="text-xs text-[#556078] dark:text-[#9aa6c0] mt-0.5">
            Filter by fuel type, crash test safety rating, budget, seating, and compare real specs side-by-side.
          </p>
        </div>

        {/* Search & AI Finder CTA */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Tata, Creta, Hybrid, SUV..."
              className="w-full bg-white dark:bg-slate-900 border border-[#101624]/15 dark:border-white/15 rounded-full pl-9 pr-8 py-2 text-xs text-[#101624] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#ff5a1f] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onOpenFinder}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#101624] dark:bg-[#eef2fb] hover:bg-black dark:hover:bg-white text-white dark:text-[#101624] font-bold text-xs rounded-full transition-all cursor-pointer shrink-0 shadow-sm hover:shadow-[0_8px_20px_-4px_#ff5a1f]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff5a1f]" />
            <span className="hidden sm:inline">AI Match Finder</span>
          </button>
        </div>
      </div>

      {/* Curated Quick Collection Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => handlePresetSelect('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activePreset === 'all' && activeFiltersCount === 0
              ? 'bg-[#101624] text-white dark:bg-white dark:text-[#101624] shadow-sm font-bold'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white border border-[#101624]/10 dark:border-white/10'
          }`}
        >
          <CarIcon className="w-3.5 h-3.5 text-[#ff5a1f]" />
          <span>All Cars ({cars.length})</span>
        </button>

        {favoriteCarIds.length > 0 && (
          <button
            onClick={() => handlePresetSelect('favorites')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activePreset === 'favorites' || onlyFavorites
                ? 'bg-rose-500 text-slate-900 shadow-md shadow-rose-500/20 font-bold'
                : 'bg-white text-rose-300 hover:bg-[#F8FAFC] border border-rose-500/20'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>Saved Cars ({favoriteCarIds.length})</span>
          </button>
        )}

        <button
          onClick={() => handlePresetSelect('ev')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activePreset === 'ev' || selectedFuel === 'Electric'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold'
              : 'bg-white text-slate-600 hover:bg-[#F8FAFC] border border-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-cyan-600" />
          <span>Electric EVs</span>
        </button>

        <button
          onClick={() => handlePresetSelect('hybrid')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activePreset === 'hybrid' || selectedFuel === 'Strong Hybrid'
              ? 'bg-emerald-500 text-black shadow-md font-bold'
              : 'bg-white text-slate-600 hover:bg-[#F8FAFC] border border-slate-200'
          }`}
        >
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
          <span>Strong Hybrids</span>
        </button>

        <button
          onClick={() => handlePresetSelect('safety')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activePreset === 'safety' || only5StarSafety
              ? 'bg-emerald-500 text-black shadow-md font-bold'
              : 'bg-white text-slate-600 hover:bg-[#F8FAFC] border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>5-Star Safety Kings</span>
        </button>

        <button
          onClick={() => handlePresetSelect('adas')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activePreset === 'adas' || onlyADAS
              ? 'bg-purple-500 text-slate-900 shadow-md font-bold'
              : 'bg-white text-slate-600 hover:bg-[#F8FAFC] border border-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-purple-400" />
          <span>Level 2 ADAS</span>
        </button>

        <button
          onClick={() => handlePresetSelect('7seater')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activePreset === '7seater' || selectedSeating === '7'
              ? 'bg-amber-500 text-black shadow-md font-bold'
              : 'bg-white text-slate-600 hover:bg-[#F8FAFC] border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-600" />
          <span>7-Seater Family</span>
        </button>

        <button
          onClick={() => handlePresetSelect('budget')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activePreset === 'budget' || (maxPrice <= 12 && maxPrice > 0)
              ? 'bg-emerald-500 text-black shadow-md font-bold'
              : 'bg-white text-slate-600 hover:bg-[#F8FAFC] border border-slate-200'
          }`}
        >
          <span>Under ₹12 Lakhs</span>
        </button>

        <button
          onClick={() => handlePresetSelect('sedans')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activePreset === 'sedans' || selectedBodyType === 'Sedan'
              ? 'bg-indigo-500 text-slate-900 shadow-md font-bold'
              : 'bg-white text-slate-600 hover:bg-[#F8FAFC] border border-slate-200'
          }`}
        >
          <span>Executive Sedans</span>
        </button>
      </div>

      {/* Main Filter Deck */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl shadow-black/40">
        {/* Row 1: Body Types & Fuel Type Filter Pills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Body Types */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Body Style</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {bodyTypes.map((type) => {
                const count = type === 'All' ? cars.length : cars.filter(c => c.bodyType === type).length;
                const isSelected = selectedBodyType === type;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedBodyType(type);
                      setActivePreset('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-black shadow-sm font-bold scale-102'
                        : 'bg-white text-slate-600 hover:bg-[#F8FAFC] border border-slate-200'
                    }`}
                  >
                    {type} <span className={`text-[10px] ml-1 ${isSelected ? 'text-black/70' : 'text-slate-500'}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fuel Types */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Powertrain / Fuel</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {fuelTypes.map((fuel) => {
                const count = fuel === 'All' ? cars.length : cars.filter(c => c.fuelTypes.includes(fuel as FuelType)).length;
                const isSelected = selectedFuel === fuel;
                return (
                  <button
                    key={fuel}
                    onClick={() => {
                      setSelectedFuel(fuel);
                      setActivePreset('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500 text-black shadow-sm font-bold scale-102'
                        : 'bg-white text-slate-600 hover:bg-[#F8FAFC] border border-slate-200'
                    }`}
                  >
                    {fuel} <span className={`text-[10px] ml-1 ${isSelected ? 'text-black/70' : 'text-slate-500'}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Secondary Filters (Brand, Budget Slider, Seating, Sort) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-200 items-center">
          {/* Brand Selector */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Manufacturer / Brand:</span>
              {selectedBrand !== 'All' && (
                <button 
                  onClick={() => setSelectedBrand('All')} 
                  className="text-[11px] text-emerald-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setActivePreset('');
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand} className="bg-white text-slate-900">
                  {brand === 'All' ? 'All Brands' : brand}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Ceiling Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Max Budget:</span>
              <span className="font-bold text-emerald-600 font-['Manrope']">
                {maxPrice >= MAX_PRICE_CAP ? `Any (Up to ₹${MAX_PRICE_CAP}L)` : `Up to ₹${maxPrice} Lakhs`}
              </span>
            </div>
            <input
              type="range"
              min="6"
              max={MAX_PRICE_CAP}
              step={MAX_PRICE_CAP > 100 ? 5 : 1}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setActivePreset('');
              }}
              className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹6L</span>
              <span>₹{Math.round(MAX_PRICE_CAP * 0.2)}L</span>
              <span>₹{Math.round(MAX_PRICE_CAP * 0.5)}L</span>
              <span>₹{MAX_PRICE_CAP}L+</span>
            </div>
          </div>

          {/* Seating Capacity */}
          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-medium">Seating Capacity:</div>
            <div className="flex gap-1.5">
              {[
                { label: 'Any', value: 'All' },
                { label: '5-Seater', value: '5' },
                { label: '7-Seater', value: '7' }
              ].map((seat) => (
                <button
                  key={seat.value}
                  onClick={() => {
                    setSelectedSeating(seat.value);
                    setActivePreset('');
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedSeating === seat.value
                      ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40 font-bold'
                      : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  {seat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-medium">Sort Vehicles By:</div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="match" className="bg-white">✨ Best AI Match</option>
              <option value="price-asc" className="bg-white">💰 Price: Low to High</option>
              <option value="price-desc" className="bg-white">💎 Price: High to Low</option>
              <option value="mileage" className="bg-white">⛽ Highest Mileage / Range</option>
              <option value="power" className="bg-white">🏎️ Most Powerful (PS)</option>
              <option value="boot" className="bg-white">🧳 Largest Boot Space</option>
              <option value="safety" className="bg-white">🛡️ Highest Safety Stars</option>
            </select>
          </div>
        </div>

        {/* Row 3: Feature Checkbox Chips (Sunroof, ADAS, 5-Star, Ventilated Seats, 360 Camera) */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" /> Must-Haves:
            </span>

            {/* 5-Star Safety */}
            <button
              onClick={() => setOnly5StarSafety(!only5StarSafety)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                only5StarSafety
                  ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/50'
                  : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>5★ Safety</span>
              {only5StarSafety && <Check className="w-3 h-3 text-emerald-600" />}
            </button>

            {/* Level 2 ADAS */}
            <button
              onClick={() => setOnlyADAS(!onlyADAS)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                onlyADAS
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                  : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>Level 2 ADAS</span>
              {onlyADAS && <Check className="w-3 h-3 text-purple-400" />}
            </button>

            {/* Sunroof */}
            <button
              onClick={() => setOnlySunroof(!onlySunroof)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                onlySunroof
                  ? 'bg-amber-500/20 text-amber-600 border border-amber-500/50'
                  : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Sunroof</span>
              {onlySunroof && <Check className="w-3 h-3 text-amber-600" />}
            </button>

            {/* Ventilated Seats */}
            <button
              onClick={() => setOnlyVentilatedSeats(!onlyVentilatedSeats)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                onlyVentilatedSeats
                  ? 'bg-cyan-500/20 text-cyan-600 border border-cyan-500/50'
                  : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
              }`}
            >
              <Fan className="w-3.5 h-3.5 text-cyan-600" />
              <span>Ventilated Seats</span>
              {onlyVentilatedSeats && <Check className="w-3 h-3 text-cyan-600" />}
            </button>

            {/* 360 Camera */}
            <button
              onClick={() => setOnly360Camera(!only360Camera)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                only360Camera
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                  : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-rose-400" />
              <span>360° Camera</span>
              {only360Camera && <Check className="w-3 h-3 text-rose-400" />}
            </button>
          </div>

          {/* View Mode Toggle (Grid vs List) */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Detailed Table View"
              aria-label="Detailed Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Results Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 flex-wrap">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredCars.length}</strong> of {cars.length} cars
          </span>
          {filteredCars.length > 0 && (
            <>
              <span>•</span>
              <span>Avg. Price: <strong className="text-emerald-600">₹{avgSelectionPrice} L</strong></span>
            </>
          )}

          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full font-semibold border border-emerald-500/20">
              {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-600 font-semibold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredCars.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-500">
            <Filter className="w-7 h-7 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-['Manrope']">No matching vehicles found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No cars matched your combination of brand, fuel type, budget ceiling (₹{maxPrice}L), or feature filters.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
            <button
              onClick={onOpenFinder}
              className="px-4 py-2 bg-slate-100 hover:bg-white/20 text-slate-900 font-medium text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Ask AI Finder
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              matchScore={matchScoresMap?.[car.id]}
              isFavorite={favoriteCarIds.includes(car.id)}
              isCompared={comparedCarIds.includes(car.id)}
              onToggleFavorite={onToggleFavorite}
              onToggleCompare={onToggleCompare}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        /* DETAILED COMPARISON TABLE / LIST VIEW */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-white/70 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-3">Price Range</th>
                  <th className="py-3.5 px-3">Powertrain</th>
                  <th className="py-3.5 px-3">Mileage / Range</th>
                  <th className="py-3.5 px-3">Power & Torque</th>
                  <th className="py-3.5 px-3">Safety Rating</th>
                  <th className="py-3.5 px-3">Space & Seats</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCars.map((car) => {
                  const isFav = favoriteCarIds.includes(car.id);
                  const isComp = comparedCarIds.includes(car.id);
                  const isEV = car.fuelTypes.includes('Electric');
                  const isHybrid = car.fuelTypes.includes('Strong Hybrid');

                  return (
                    <tr 
                      key={car.id} 
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Car Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <CarImage
                              src={car.image}
                              alt={`${car.brand} ${car.model}`}
                              brand={car.brand}
                              model={car.model}
                              bodyType={car.bodyType}
                              isEV={car.fuelTypes.includes('Electric')}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors font-['Manrope']">
                              {car.brand} {car.model}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <span>{car.bodyType}</span>
                              {car.safety.hasADAS && (
                                <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">
                                  ADAS
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-emerald-600 font-['Manrope'] text-xs">
                          ₹{car.priceMinLakh.toFixed(2)} – ₹{car.priceMaxLakh.toFixed(2)} L
                        </div>
                        <div className="text-[10px] text-slate-500">Ex-Showroom</div>
                      </td>

                      {/* Fuel & Transmissions */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {car.fuelTypes.map((fuel) => (
                            <span 
                              key={fuel}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                fuel === 'Electric' 
                                  ? 'bg-cyan-500/20 text-cyan-600 border border-cyan-500/30'
                                  : fuel === 'Strong Hybrid'
                                  ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                                  : 'bg-slate-50 text-slate-600'
                              }`}
                            >
                              {fuel}
                            </span>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {car.specs.transmission.join(', ')}
                        </div>
                      </td>

                      {/* Mileage / Range */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          {isEV ? (
                            <>
                              <Zap className="w-3 h-3 text-cyan-600" />
                              <span>{car.specs.rangeKm} km Range</span>
                            </>
                          ) : (
                            <>
                              <Fuel className="w-3 h-3 text-emerald-600" />
                              <span>{car.specs.mileageKmPerLitreOrKWh} km/l</span>
                            </>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {isEV ? `${car.specs.batteryCapacityKWh} kWh Battery` : `${car.specs.fuelTankCapacityLitres}L Tank`}
                        </div>
                      </td>

                      {/* Power & Torque */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">
                          {car.specs.powerPS} PS
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {car.specs.torqueNM} Nm Torque
                        </div>
                      </td>

                      {/* Safety */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 font-bold text-emerald-600">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{car.safety.ratingStars}★ {car.safety.testingAgency}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {car.safety.airbagsCount} Airbags
                        </div>
                      </td>

                      {/* Space & Seats */}
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-medium">
                          {car.specs.seatingCapacity} Seater
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {car.specs.bootSpaceLitres}L Boot • {car.specs.groundClearanceMm}mm GC
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onToggleFavorite(car)}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${
                              isFav
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                            }`}
                            title={isFav ? 'Remove Favorite' : 'Save Car'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-400' : ''}`} />
                          </button>

                          <button
                            onClick={() => onToggleCompare(car)}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${
                              isComp
                                ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                            }`}
                            title={isComp ? 'Remove from Compare' : 'Add to Compare'}
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onViewDetails(car)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>Specs</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
