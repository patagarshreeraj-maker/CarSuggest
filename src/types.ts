export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Strong Hybrid' | 'Hybrid' | 'CNG';
export type BodyType = 'SUV' | 'Compact SUV' | 'Sedan' | 'Hatchback' | 'MPV' | 'Coupe' | 'Convertible' | 'Supercar' | 'Pickup';
export type TransmissionType = 'Manual' | 'Automatic' | 'iMT' | 'DCT' | 'CVT' | 'e-CVT' | 'AMT' | 'DSG' | 'IVT';
export type DriveTerrain = 'City Commute' | 'Highway Trips' | 'Mixed Daily' | 'Rough Roads / Hills';

export interface CarVariant {
  name: string;
  priceLakh: number; // in ₹ Lakhs (Ex-Showroom)
  transmission: string;
  fuel: FuelType;
  keyFeatures: string[];
}

export interface CarSpecs {
  engineDisplacement: string; // e.g. "1498 cc" or "Electric Motor 45 kWh"
  powerPS: number;
  torqueNM: number;
  transmission: TransmissionType[];
  mileageKmPerLitreOrKWh: number; // km/l or km/charge for EV
  rangeKm?: number; // for EVs
  topSpeedKmH: number;
  acceleration0to100?: number; // in seconds
  bootSpaceLitres: number;
  groundClearanceMm?: number;
  groundClearanceMM?: number;
  seatingCapacity: number;
  fuelTankCapacityLitres?: number;
  batteryCapacityKWh?: number;
  chargingTimeHours?: number; // fast charging 10-80% in min or standard hrs
}

export interface CarSafety {
  ratingStars?: number; // 0 to 5
  globalNcapStars?: number; // 0 to 5
  testingAgency?: string;
  crashTestAgency?: string;
  airbagsCount: number;
  hasADAS?: boolean;
  adasLevel?: number;
  hasESP?: boolean;
  esp?: boolean;
  absWithEbd?: boolean;
  has360Camera?: boolean;
  hasIsofix?: boolean;
  keySafetyFeatures?: string[];
}

export interface CarOwnership {
  avgAnnualMaintenance: number; // in ₹
  estimatedYearlyInsurance: number; // in ₹
  warrantyYears: number;
  warrantyKm: number;
  batteryWarrantyYears?: number;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  tagline: string;
  priceMinLakh: number; // in ₹ Lakhs
  priceMaxLakh: number; // in ₹ Lakhs
  bodyType: BodyType;
  fuelTypes: FuelType[];
  image: string;
  galleryImages: string[];
  specs: CarSpecs;
  safety: CarSafety;
  features: {
    touchscreen?: boolean;
    comfort?: string[];
    technology?: string[];
    infotainmentScreenInch: number;
    sunroof: 'None' | 'Single Pane' | 'Panoramic';
    ventilatedSeats: boolean;
    wirelessCharging: boolean;
    connectedCarTech: boolean;
  };
  ownership: CarOwnership;
  variants: CarVariant[];
  pros: string[];
  cons: string[];
  bestSuitedFor: string[];
  popularCityRanking?: number;
}

export interface UserPreferences {
  budgetMinLakh: number;
  budgetMaxLakh: number;
  familySize: number;
  primaryUsage: DriveTerrain;
  monthlyKm: number;
  preferredFuel: FuelType[];
  preferredBodyTypes: BodyType[];
  preferredTransmission?: 'Any' | 'Manual' | 'Automatic';
  priorities: {
    safety: number; // 1 to 5 weight
    mileage: number; // 1 to 5 weight
    performance: number; // 1 to 5 weight
    comfortSpace: number; // 1 to 5 weight
    lowMaintenance: number; // 1 to 5 weight
    featuresTech: number; // 1 to 5 weight
  };
}

export interface MatchScoreBreakdown {
  overallScore: number; // 0 to 100
  budgetScore: number;
  safetyScore: number;
  mileageScore: number;
  comfortSpaceScore: number;
  performanceScore: number;
  maintenanceScore: number;
  aiExplanation?: string;
  matchHighlights: string[];
  compromises: string[];
}

export interface ScoredCar {
  car: Car;
  scores: MatchScoreBreakdown;
}

export interface AIRecommendationResponse {
  topPickId: string;
  topPickReasoning: string;
  prosForUser: string[];
  tradeOffs: string[];
  runnerUps: {
    carId: string;
    reason: string;
  }[];
  expertAdvice: string;
}

export interface AIComparisonResponse {
  verdict: string;
  bestOverallCarId: string;
  bestMileageCarId: string;
  bestPerformanceCarId: string;
  bestValueForMoneyCarId: string;
  bestFamilyCarId: string;
  keyDifferentiators: {
    category: string;
    description: string;
    winnerCarId: string;
  }[];
  finalAdvice: string;
}

export interface OwnershipCalculation {
  onRoadPrice: number;
  loanAmount: number;
  downPaymentAmount: number;
  monthlyEMI: number;
  totalInterestPaid: number;
  monthlyFuelCost: number;
  yearlyFuelCost: number;
  fiveYearFuelCost: number;
  yearlyInsuranceCost: number;
  fiveYearInsuranceCost: number;
  yearlyMaintenanceCost: number;
  fiveYearMaintenanceCost: number;
  total5YearCost: number;
  monthlyTotalRunningWithEMI: number;
  estimatedResaleValue: number;
  netCostOfOwnership: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedActions?: string[];
  referencedCarIds?: string[];
}

export interface UserProfile {
  id: string;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

