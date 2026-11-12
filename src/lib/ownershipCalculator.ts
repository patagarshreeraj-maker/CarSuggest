import { Car, OwnershipCalculation } from '../types';

export interface OwnershipCalculationParams {
  car: Car;
  selectedPriceLakh: number;
  downPaymentPercent: number; // e.g. 20%
  loanTenureYears: number; // e.g. 5
  interestRatePercent: number; // e.g. 9.0%
  monthlyDrivingKm: number; // e.g. 1200 km
  fuelPricePerLitre?: number; // Petrol: 96, Diesel: 88, CNG: 80
  electricityCostPerKWh?: number; // EV: 8.5
}

export function calculateOwnershipCost(params: OwnershipCalculationParams): OwnershipCalculation {
  const {
    car,
    selectedPriceLakh,
    downPaymentPercent,
    loanTenureYears,
    interestRatePercent,
    monthlyDrivingKm,
    fuelPricePerLitre = 96,
    electricityCostPerKWh = 8.5
  } = params;

  const exShowroomRupees = selectedPriceLakh * 100000;
  // Estimate RTO taxes (EVs usually ~0-5%, ICE ~8-12%)
  const isEV = car.fuelTypes.includes('Electric');
  const rtoTaxRate = isEV ? 0.04 : 0.10;
  const rtoTax = exShowroomRupees * rtoTaxRate;
  const initialInsurance = car.ownership.estimatedYearlyInsurance;
  const registrationAndCharges = 15000;

  const onRoadPrice = exShowroomRupees + rtoTax + initialInsurance + registrationAndCharges;

  // Loan & EMI calculations
  const downPaymentAmount = Math.round(onRoadPrice * (downPaymentPercent / 100));
  const loanAmount = Math.max(0, onRoadPrice - downPaymentAmount);
  
  const monthlyInterestRate = (interestRatePercent / 100) / 12;
  const totalMonths = loanTenureYears * 12;

  let monthlyEMI = 0;
  if (loanAmount > 0 && monthlyInterestRate > 0) {
    monthlyEMI = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
                 (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
  }
  monthlyEMI = Math.round(monthlyEMI);
  const totalLoanRepayment = monthlyEMI * totalMonths;
  const totalInterestPaid = Math.max(0, totalLoanRepayment - loanAmount);

  // Fuel / Energy Cost
  let monthlyFuelCost = 0;
  if (isEV) {
    // Real world efficiency: approx 0.13 kWh/km
    const costPerKm = (electricityCostPerKWh * 45) / (car.specs.rangeKm ? car.specs.rangeKm * 0.82 : 320);
    monthlyFuelCost = Math.round(monthlyDrivingKm * costPerKm);
  } else {
    // Real world mileage ~85% of ARAI
    const activeFuelPrice = car.fuelTypes.includes('Diesel') ? 88 : car.fuelTypes.includes('CNG') ? 80 : fuelPricePerLitre;
    const realMileage = Math.max(8, car.specs.mileageKmPerLitreOrKWh * 0.85);
    const litresNeeded = monthlyDrivingKm / realMileage;
    monthlyFuelCost = Math.round(litresNeeded * activeFuelPrice);
  }

  const yearlyFuelCost = monthlyFuelCost * 12;
  const fiveYearFuelCost = yearlyFuelCost * 5;

  const yearlyInsuranceCost = car.ownership.estimatedYearlyInsurance;
  const fiveYearInsuranceCost = Math.round(yearlyInsuranceCost * 4.2);

  const yearlyMaintenanceCost = car.ownership.avgAnnualMaintenance;
  const fiveYearMaintenanceCost = Math.round(yearlyMaintenanceCost * 5.4);

  const total5YearCost = onRoadPrice + totalInterestPaid + fiveYearFuelCost + (fiveYearInsuranceCost - initialInsurance) + fiveYearMaintenanceCost;
  const monthlyTotalRunningWithEMI = Math.round(monthlyEMI + monthlyFuelCost + (yearlyMaintenanceCost / 12) + (yearlyInsuranceCost / 12));

  // Estimated 5-year resale value (~50-60% for Japanese/Toyota, ~45-55% for Hyundai/Mahindra, ~40-50% for EVs)
  let resaleRate = 0.50;
  if (car.brand === 'Toyota' || car.brand === 'Maruti Suzuki') resaleRate = 0.58;
  else if (car.brand === 'Hyundai' || car.brand === 'Mahindra') resaleRate = 0.52;
  else if (isEV) resaleRate = 0.46;

  const estimatedResaleValue = Math.round(exShowroomRupees * resaleRate);
  const netCostOfOwnership = Math.round(total5YearCost - estimatedResaleValue);

  return {
    onRoadPrice: Math.round(onRoadPrice),
    loanAmount: Math.round(loanAmount),
    downPaymentAmount,
    monthlyEMI,
    totalInterestPaid: Math.round(totalInterestPaid),
    monthlyFuelCost,
    yearlyFuelCost,
    fiveYearFuelCost,
    yearlyInsuranceCost,
    fiveYearInsuranceCost,
    yearlyMaintenanceCost,
    fiveYearMaintenanceCost,
    total5YearCost: Math.round(total5YearCost),
    monthlyTotalRunningWithEMI,
    estimatedResaleValue,
    netCostOfOwnership
  };
}

export function compareOwnershipCosts(
  car1Params: OwnershipCalculationParams,
  car2Params: OwnershipCalculationParams
) {
  const tco1 = calculateOwnershipCost(car1Params);
  const tco2 = calculateOwnershipCost(car2Params);

  const fuelSavings = tco2.fiveYearFuelCost - tco1.fiveYearFuelCost;
  const netCostDifference = tco1.netCostOfOwnership - tco2.netCostOfOwnership;

  return {
    tco1,
    tco2,
    fuelSavings,
    netCostDifference
  };
}
