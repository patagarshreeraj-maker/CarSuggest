import { Car, UserPreferences, ScoredCar, MatchScoreBreakdown } from '../types';

export function calculateMatchScore(car: Car, prefs: UserPreferences): MatchScoreBreakdown {
  // 1. Budget Score (0 - 100)
  let budgetScore = 50;
  const avgCarPrice = (car.priceMinLakh + car.priceMaxLakh) / 2;
  const userMin = prefs.budgetMinLakh || 5;
  const userMax = prefs.budgetMaxLakh || 25;

  if (car.priceMinLakh <= userMax && car.priceMaxLakh >= userMin) {
    if (avgCarPrice >= userMin && avgCarPrice <= userMax) {
      budgetScore = 96;
    } else if (car.priceMinLakh <= userMax && avgCarPrice > userMax) {
      // Base/mid variant fits
      const excess = avgCarPrice - userMax;
      budgetScore = Math.max(70, 92 - excess * 5);
    } else {
      budgetScore = 85;
    }
  } else if (car.priceMinLakh > userMax) {
    const diff = car.priceMinLakh - userMax;
    budgetScore = Math.max(15, 65 - diff * 12);
  } else {
    budgetScore = 75;
  }

  // 2. Safety Score (0 - 100)
  let safetyScore = car.safety.ratingStars === 5 ? 96 : car.safety.ratingStars === 4 ? 82 : 65;
  if (car.safety.hasADAS) safetyScore += 3;
  if (car.safety.airbagsCount >= 6) safetyScore += 1;
  safetyScore = Math.min(100, safetyScore);

  // 3. Mileage & Running Cost Score (0 - 100)
  let mileageScore = 70;
  const isEV = car.fuelTypes.includes('Electric');
  const isHybrid = car.fuelTypes.includes('Strong Hybrid');
  
  if (isEV) {
    // If user drives heavily (>1200 km/mo) EV is ultra efficient
    mileageScore = prefs.monthlyKm >= 1000 ? 98 : 92;
  } else if (isHybrid) {
    mileageScore = 95;
  } else if (car.specs.mileageKmPerLitreOrKWh >= 20) {
    mileageScore = 88;
  } else if (car.specs.mileageKmPerLitreOrKWh >= 16) {
    mileageScore = 80;
  } else {
    mileageScore = 65;
  }

  // 4. Comfort & Space Score (0 - 100)
  let comfortSpaceScore = 75;
  if (prefs.familySize > 5) {
    comfortSpaceScore = car.specs.seatingCapacity >= 7 ? 98 : 30; // heavy penalty if family of 6+ won't fit
  } else if (prefs.familySize === 5) {
    comfortSpaceScore = car.specs.seatingCapacity >= 5 ? 90 : 70;
  } else {
    comfortSpaceScore = 88;
  }
  if (car.features.ventilatedSeats) comfortSpaceScore += 3;
  if (car.features.sunroof === 'Panoramic') comfortSpaceScore += 3;
  if (car.specs.bootSpaceLitres >= 450) comfortSpaceScore += 4;
  comfortSpaceScore = Math.min(100, comfortSpaceScore);

  // 5. Performance Score (0 - 100)
  let performanceScore = 60;
  if (car.specs.powerPS >= 170 || car.specs.acceleration0to100 <= 9.0) {
    performanceScore = 95;
  } else if (car.specs.powerPS >= 130) {
    performanceScore = 84;
  } else if (car.specs.powerPS >= 110) {
    performanceScore = 75;
  } else {
    performanceScore = 65;
  }

  // 6. Maintenance & Running Score (0 - 100)
  let maintenanceScore = 75;
  if (car.ownership.avgAnnualMaintenance <= 6500 || isEV) {
    maintenanceScore = 95;
  } else if (car.ownership.avgAnnualMaintenance <= 8500) {
    maintenanceScore = 86;
  } else if (car.ownership.avgAnnualMaintenance <= 10000) {
    maintenanceScore = 78;
  } else {
    maintenanceScore = 68;
  }

  // Body type preference adjustment
  let bodyTypeBonus = 0;
  if (prefs.preferredBodyTypes && prefs.preferredBodyTypes.length > 0) {
    if (prefs.preferredBodyTypes.includes(car.bodyType)) {
      bodyTypeBonus = 5;
    } else {
      bodyTypeBonus = -8;
    }
  }

  // Fuel preference adjustment
  let fuelBonus = 0;
  if (prefs.preferredFuel && prefs.preferredFuel.length > 0) {
    const hasFuelMatch = car.fuelTypes.some(f => prefs.preferredFuel.includes(f));
    if (hasFuelMatch) {
      fuelBonus = 5;
    } else {
      fuelBonus = -12;
    }
  }

  // Calculate weights based on user priorities (1 to 5)
  const p = prefs.priorities;
  const totalWeight = p.safety + p.mileage + p.performance + p.comfortSpace + p.lowMaintenance + p.featuresTech + 2; // +2 for base budget
  
  const wBudget = 2 / totalWeight;
  const wSafety = p.safety / totalWeight;
  const wMileage = p.mileage / totalWeight;
  const wComfort = p.comfortSpace / totalWeight;
  const wPerf = p.performance / totalWeight;
  const wMaint = p.lowMaintenance / totalWeight;
  const wTech = p.featuresTech / totalWeight;

  const techScore = (car.features.infotainmentScreenInch >= 10 ? 40 : 25) +
                    (car.safety.hasADAS ? 30 : 15) +
                    (car.features.connectedCarTech ? 15 : 5) +
                    (car.features.wirelessCharging ? 15 : 5);

  let rawOverall = (budgetScore * wBudget) +
                   (safetyScore * wSafety) +
                   (mileageScore * wMileage) +
                   (comfortSpaceScore * wComfort) +
                   (performanceScore * wPerf) +
                   (maintenanceScore * wMaint) +
                   (techScore * wTech) +
                   bodyTypeBonus +
                   fuelBonus;

  const overallScore = Math.max(40, Math.min(99, Math.round(rawOverall)));

  // Generate highlights and potential compromises
  const matchHighlights: string[] = [];
  const compromises: string[] = [];

  if (car.safety.ratingStars === 5) matchHighlights.push('5-Star Crash Test Certified');
  if (car.safety.hasADAS) matchHighlights.push('Level 2 Active ADAS Suite');
  if (isEV) matchHighlights.push(`Sub-₹1.2/km Running Cost (~${car.specs.rangeKm}km Range)`);
  if (isHybrid) matchHighlights.push('27+ km/l Self-Charging Hybrid Efficiency');
  if (car.specs.powerPS >= 160) matchHighlights.push(`${car.specs.powerPS}PS High-Performance Output`);
  if (car.specs.seatingCapacity >= 7) matchHighlights.push('Spacious 7-Seater Cabin Layout');
  if (car.features.sunroof === 'Panoramic') matchHighlights.push('Panoramic Skyroof');

  if (avgCarPrice > userMax) compromises.push(`Top variants exceed ₹${userMax}L budget`);
  if (prefs.familySize > 5 && car.specs.seatingCapacity < 7) compromises.push('Only 5 seats available');
  if (isEV && prefs.primaryUsage === 'Highway Trips') compromises.push('Highway fast-charging stops required on 400km+ routes');
  if (car.ownership.avgAnnualMaintenance > 10000) compromises.push('Slightly higher periodic maintenance costs');

  return {
    overallScore,
    budgetScore: Math.round(budgetScore),
    safetyScore: Math.round(safetyScore),
    mileageScore: Math.round(mileageScore),
    comfortSpaceScore: Math.round(comfortSpaceScore),
    performanceScore: Math.round(performanceScore),
    maintenanceScore: Math.round(maintenanceScore),
    matchHighlights: matchHighlights.slice(0, 3),
    compromises: compromises.slice(0, 2)
  };
}

export function rankCarsForUser(cars: Car[], prefs: UserPreferences): ScoredCar[] {
  const scored = cars.map(car => ({
    car,
    scores: calculateMatchScore(car, prefs)
  }));

  // Sort descending by overall match score
  return scored.sort((a, b) => b.scores.overallScore - a.scores.overallScore);
}

export const calculateRecommendations = (prefs: UserPreferences, cars: Car[]): ScoredCar[] => {
  return rankCarsForUser(cars, prefs);
};
