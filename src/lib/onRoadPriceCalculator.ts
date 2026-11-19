export interface StateTaxConfig {
  code: string;
  name: string;
  rtoRates: {
    petrol: { maxPriceLakh: number; ratePercent: number }[];
    diesel: { maxPriceLakh: number; ratePercent: number }[];
    cng: { maxPriceLakh: number; ratePercent: number }[];
    electric: { maxPriceLakh: number; ratePercent: number }[];
    hybrid: { maxPriceLakh: number; ratePercent: number }[];
  };
  evExemptionNote?: string;
  hybridExemptionNote?: string;
}

export const INDIAN_STATES: StateTaxConfig[] = [
  {
    code: 'KA',
    name: 'Karnataka (Bangalore)',
    rtoRates: {
      petrol: [
        { maxPriceLakh: 5, ratePercent: 14.0 },
        { maxPriceLakh: 10, ratePercent: 15.0 },
        { maxPriceLakh: 20, ratePercent: 17.0 },
        { maxPriceLakh: Infinity, ratePercent: 18.0 }
      ],
      diesel: [
        { maxPriceLakh: 5, ratePercent: 14.5 },
        { maxPriceLakh: 10, ratePercent: 15.5 },
        { maxPriceLakh: 20, ratePercent: 17.5 },
        { maxPriceLakh: Infinity, ratePercent: 18.5 }
      ],
      cng: [
        { maxPriceLakh: 10, ratePercent: 14.0 },
        { maxPriceLakh: Infinity, ratePercent: 16.0 }
      ],
      electric: [
        { maxPriceLakh: 25, ratePercent: 0.0 }, // 0% RTO up to 25L
        { maxPriceLakh: Infinity, ratePercent: 10.0 }
      ],
      hybrid: [
        { maxPriceLakh: 10, ratePercent: 15.0 },
        { maxPriceLakh: 20, ratePercent: 17.0 },
        { maxPriceLakh: Infinity, ratePercent: 18.0 }
      ]
    },
    evExemptionNote: '100% road tax waiver on EVs priced under ₹25 Lakhs.'
  },
  {
    code: 'MH',
    name: 'Maharashtra (Mumbai/Pune)',
    rtoRates: {
      petrol: [
        { maxPriceLakh: 10, ratePercent: 11.0 },
        { maxPriceLakh: 20, ratePercent: 12.0 },
        { maxPriceLakh: Infinity, ratePercent: 13.0 }
      ],
      diesel: [
        { maxPriceLakh: 10, ratePercent: 13.0 },
        { maxPriceLakh: 20, ratePercent: 14.0 },
        { maxPriceLakh: Infinity, ratePercent: 15.0 }
      ],
      cng: [
        { maxPriceLakh: 10, ratePercent: 7.0 },
        { maxPriceLakh: Infinity, ratePercent: 9.0 }
      ],
      electric: [
        { maxPriceLakh: Infinity, ratePercent: 0.0 } // 0% RTO for EVs in MH
      ],
      hybrid: [
        { maxPriceLakh: 10, ratePercent: 11.0 },
        { maxPriceLakh: 20, ratePercent: 12.0 },
        { maxPriceLakh: Infinity, ratePercent: 13.0 }
      ]
    },
    evExemptionNote: 'Complete road tax waiver and registration fee exemption for Electric Vehicles.'
  },
  {
    code: 'DL',
    name: 'Delhi NCR',
    rtoRates: {
      petrol: [
        { maxPriceLakh: 6, ratePercent: 4.0 },
        { maxPriceLakh: 10, ratePercent: 7.0 },
        { maxPriceLakh: Infinity, ratePercent: 10.0 }
      ],
      diesel: [
        { maxPriceLakh: 6, ratePercent: 5.0 },
        { maxPriceLakh: 10, ratePercent: 8.75 },
        { maxPriceLakh: Infinity, ratePercent: 12.5 }
      ],
      cng: [
        { maxPriceLakh: 6, ratePercent: 4.0 },
        { maxPriceLakh: 10, ratePercent: 7.0 },
        { maxPriceLakh: Infinity, ratePercent: 10.0 }
      ],
      electric: [
        { maxPriceLakh: Infinity, ratePercent: 0.0 } // 0% RTO for EVs under Delhi EV Policy
      ],
      hybrid: [
        { maxPriceLakh: 10, ratePercent: 7.0 },
        { maxPriceLakh: Infinity, ratePercent: 10.0 }
      ]
    },
    evExemptionNote: 'Delhi EV Policy provides 100% waiver on RTO registration.'
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh (Noida/Lucknow)',
    rtoRates: {
      petrol: [
        { maxPriceLakh: 10, ratePercent: 8.0 },
        { maxPriceLakh: Infinity, ratePercent: 10.0 }
      ],
      diesel: [
        { maxPriceLakh: 10, ratePercent: 8.5 },
        { maxPriceLakh: Infinity, ratePercent: 10.5 }
      ],
      cng: [
        { maxPriceLakh: 10, ratePercent: 8.0 },
        { maxPriceLakh: Infinity, ratePercent: 10.0 }
      ],
      electric: [
        { maxPriceLakh: Infinity, ratePercent: 0.0 } // 100% waiver
      ],
      hybrid: [
        { maxPriceLakh: Infinity, ratePercent: 0.0 } // 100% waiver on Strong Hybrids in UP!
      ]
    },
    evExemptionNote: '100% waiver on road tax for all Electric Vehicles.',
    hybridExemptionNote: 'UP Government policy waives 100% road tax on Strong Hybrid vehicles!'
  },
  {
    code: 'GJ',
    name: 'Gujarat (Ahmedabad/Surat)',
    rtoRates: {
      petrol: [{ maxPriceLakh: Infinity, ratePercent: 6.0 }],
      diesel: [{ maxPriceLakh: Infinity, ratePercent: 6.0 }],
      cng: [{ maxPriceLakh: Infinity, ratePercent: 6.0 }],
      electric: [{ maxPriceLakh: Infinity, ratePercent: 0.0 }],
      hybrid: [{ maxPriceLakh: Infinity, ratePercent: 6.0 }]
    },
    evExemptionNote: '0% registration fee and full road tax exemption on EVs.'
  },
  {
    code: 'TN',
    name: 'Tamil Nadu (Chennai)',
    rtoRates: {
      petrol: [
        { maxPriceLakh: 10, ratePercent: 10.0 },
        { maxPriceLakh: 20, ratePercent: 13.0 },
        { maxPriceLakh: Infinity, ratePercent: 15.0 }
      ],
      diesel: [
        { maxPriceLakh: 10, ratePercent: 11.0 },
        { maxPriceLakh: 20, ratePercent: 14.0 },
        { maxPriceLakh: Infinity, ratePercent: 16.0 }
      ],
      cng: [
        { maxPriceLakh: 10, ratePercent: 10.0 },
        { maxPriceLakh: Infinity, ratePercent: 13.0 }
      ],
      electric: [
        { maxPriceLakh: Infinity, ratePercent: 0.0 } // 100% exemption in TN
      ],
      hybrid: [
        { maxPriceLakh: 10, ratePercent: 10.0 },
        { maxPriceLakh: Infinity, ratePercent: 13.0 }
      ]
    },
    evExemptionNote: 'Tamil Nadu provides 100% road tax waiver for electric vehicles.'
  },
  {
    code: 'TS',
    name: 'Telangana (Hyderabad)',
    rtoRates: {
      petrol: [
        { maxPriceLakh: 10, ratePercent: 12.0 },
        { maxPriceLakh: Infinity, ratePercent: 14.0 }
      ],
      diesel: [
        { maxPriceLakh: 10, ratePercent: 12.0 },
        { maxPriceLakh: Infinity, ratePercent: 14.0 }
      ],
      cng: [{ maxPriceLakh: Infinity, ratePercent: 12.0 }],
      electric: [{ maxPriceLakh: Infinity, ratePercent: 0.0 }], // Full waiver policy
      hybrid: [{ maxPriceLakh: Infinity, ratePercent: 13.0 }]
    },
    evExemptionNote: 'Telangana EV policy provides complete lifetime road tax waiver.'
  },
  {
    code: 'HR',
    name: 'Haryana (Gurugram/Faridabad)',
    rtoRates: {
      petrol: [
        { maxPriceLakh: 6, ratePercent: 5.0 },
        { maxPriceLakh: 20, ratePercent: 8.0 },
        { maxPriceLakh: Infinity, ratePercent: 10.0 }
      ],
      diesel: [
        { maxPriceLakh: 6, ratePercent: 6.0 },
        { maxPriceLakh: 20, ratePercent: 9.0 },
        { maxPriceLakh: Infinity, ratePercent: 11.0 }
      ],
      cng: [
        { maxPriceLakh: 6, ratePercent: 5.0 },
        { maxPriceLakh: Infinity, ratePercent: 8.0 }
      ],
      electric: [{ maxPriceLakh: Infinity, ratePercent: 0.0 }],
      hybrid: [{ maxPriceLakh: Infinity, ratePercent: 8.0 }]
    },
    evExemptionNote: 'Full registration waiver for pure electric models.'
  },
  {
    code: 'KL',
    name: 'Kerala (Kochi/Trivandrum)',
    rtoRates: {
      petrol: [
        { maxPriceLakh: 5, ratePercent: 6.0 },
        { maxPriceLakh: 10, ratePercent: 8.0 },
        { maxPriceLakh: 15, ratePercent: 10.0 },
        { maxPriceLakh: 20, ratePercent: 15.0 },
        { maxPriceLakh: Infinity, ratePercent: 20.0 }
      ],
      diesel: [
        { maxPriceLakh: 5, ratePercent: 7.0 },
        { maxPriceLakh: 10, ratePercent: 9.0 },
        { maxPriceLakh: 15, ratePercent: 11.0 },
        { maxPriceLakh: 20, ratePercent: 16.0 },
        { maxPriceLakh: Infinity, ratePercent: 21.0 }
      ],
      cng: [
        { maxPriceLakh: 10, ratePercent: 8.0 },
        { maxPriceLakh: Infinity, ratePercent: 12.0 }
      ],
      electric: [{ maxPriceLakh: Infinity, ratePercent: 5.0 }], // Kerala has 5% concession
      hybrid: [
        { maxPriceLakh: 10, ratePercent: 8.0 },
        { maxPriceLakh: Infinity, ratePercent: 12.0 }
      ]
    },
    evExemptionNote: 'Concessional 5% lifetime tax on Electric Vehicles in Kerala.'
  }
];

export interface OnRoadPriceBreakdown {
  exShowroomRupees: number;
  exShowroomLakh: number;
  stateCode: string;
  stateName: string;
  fuelCategory: 'Petrol' | 'Diesel' | 'Electric' | 'Strong Hybrid' | 'CNG';
  
  // Tax & Fees
  rtoRatePercent: number;
  rtoAmountRupees: number;
  insuranceAmountRupees: number;
  tcsAmountRupees: number;
  fastagAndRegFees: number;
  
  // Totals
  totalOnRoadRupees: number;
  totalOnRoadLakh: number;
  
  // Savings / Notes
  savingsNote?: string;
  taxDifferentialVsKA: number; // Compare vs highest tax state
}

export function calculateOnRoadPrice(params: {
  exShowroomLakh: number;
  stateCode?: string;
  fuelType?: string;
  includeAccessories?: boolean;
}): OnRoadPriceBreakdown {
  const {
    exShowroomLakh,
    stateCode = 'DL',
    fuelType = 'Petrol',
    includeAccessories = false
  } = params;

  const state = INDIAN_STATES.find((s) => s.code === stateCode) || INDIAN_STATES[0];
  const exShowroomRupees = Math.round(exShowroomLakh * 100000);

  // Determine fuel category
  let fuelCat: 'Petrol' | 'Diesel' | 'Electric' | 'Strong Hybrid' | 'CNG' = 'Petrol';
  if (fuelType.toLowerCase().includes('electric')) fuelCat = 'Electric';
  else if (fuelType.toLowerCase().includes('hybrid')) fuelCat = 'Strong Hybrid';
  else if (fuelType.toLowerCase().includes('diesel')) fuelCat = 'Diesel';
  else if (fuelType.toLowerCase().includes('cng')) fuelCat = 'CNG';

  // Find RTO rate
  let ratesList = state.rtoRates.petrol;
  if (fuelCat === 'Diesel') ratesList = state.rtoRates.diesel;
  else if (fuelCat === 'Electric') ratesList = state.rtoRates.electric;
  else if (fuelCat === 'Strong Hybrid') ratesList = state.rtoRates.hybrid;
  else if (fuelCat === 'CNG') ratesList = state.rtoRates.cng;

  const matchTier = ratesList.find((tier) => exShowroomLakh <= tier.maxPriceLakh) || ratesList[ratesList.length - 1];
  const rtoRatePercent = matchTier ? matchTier.ratePercent : 10.0;
  const rtoAmountRupees = Math.round((exShowroomRupees * rtoRatePercent) / 100);

  // Insurance calculation (1-yr Own Damage + 3-yr Mandatory Third Party + 18% GST)
  // Typically ~3.2% - 4.2% of ex-showroom value for new cars
  const baseInsuranceRate = fuelCat === 'Electric' ? 0.032 : 0.038;
  const insuranceAmountRupees = Math.round(exShowroomRupees * baseInsuranceRate + 3200);

  // 1% TCS if ex-showroom exceeds ₹10 Lakhs
  const tcsAmountRupees = exShowroomLakh >= 10.0 ? Math.round(exShowroomRupees * 0.01) : 0;

  // Standard RTO Smart Card, Registration & FASTag
  const standardFees = 2800 + (includeAccessories ? 15000 : 0);

  // Total On-Road Price
  const totalOnRoadRupees = exShowroomRupees + rtoAmountRupees + insuranceAmountRupees + tcsAmountRupees + standardFees;
  const totalOnRoadLakh = parseFloat((totalOnRoadRupees / 100000).toFixed(2));

  // Compare against Karnataka (KA - highest tax)
  const kaState = INDIAN_STATES.find((s) => s.code === 'KA');
  let kaRtoAmt = Math.round(exShowroomRupees * 0.17);
  if (kaState) {
    const kaRates = fuelCat === 'Electric' ? kaState.rtoRates.electric : kaState.rtoRates.petrol;
    const kaTier = kaRates.find((t) => exShowroomLakh <= t.maxPriceLakh) || kaRates[kaRates.length - 1];
    kaRtoAmt = Math.round((exShowroomRupees * (kaTier?.ratePercent || 17)) / 100);
  }
  const taxDifferentialVsKA = Math.max(0, kaRtoAmt - rtoAmountRupees);

  // Special Savings Note
  let savingsNote = undefined;
  if (fuelCat === 'Electric' && state.evExemptionNote) {
    savingsNote = state.evExemptionNote;
  } else if (fuelCat === 'Strong Hybrid' && state.hybridExemptionNote) {
    savingsNote = state.hybridExemptionNote;
  } else if (taxDifferentialVsKA > 20000) {
    savingsNote = `Registering in ${state.name.split(' ')[0]} saves approximately ₹${Math.round(taxDifferentialVsKA).toLocaleString('en-IN')} in road tax compared to Karnataka.`;
  }

  return {
    exShowroomRupees,
    exShowroomLakh,
    stateCode: state.code,
    stateName: state.name,
    fuelCategory: fuelCat,
    rtoRatePercent,
    rtoAmountRupees,
    insuranceAmountRupees,
    tcsAmountRupees,
    fastagAndRegFees: standardFees,
    totalOnRoadRupees,
    totalOnRoadLakh,
    savingsNote,
    taxDifferentialVsKA
  };
}
