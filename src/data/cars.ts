import { Car } from '../types';
import { FULL_LINEUP } from './fullLineup';

// Real Studio Images for all verified Indian Market Cars
import tataNexonEvImg from '../assets/images/tata_nexon_ev_1786801037580.jpg';
import tataNexonInteriorImg from '../assets/images/tata_nexon_interior_1786801209846.jpg';
import tataPunchImg from '../assets/images/tata_punch_1786801088689.jpg';
import tataHarrierImg from '../assets/images/tata_harrier_suv_1786812207217.jpg';
import tataSafariImg from '../assets/images/tata_safari_suv_1786812957821.jpg';
import tataCurvvImg from '../assets/images/tata_curvv_ev_1786812945864.jpg';

import hyundaiCretaImg from '../assets/images/hyundai_creta_1786801050358.jpg';
import hyundaiCretaInteriorImg from '../assets/images/hyundai_creta_interior_1786801222372.jpg';
import hyundaiVenueImg from '../assets/images/hyundai_venue_suv_1786812980715.jpg';
import hyundaiVernaImg from '../assets/images/hyundai_verna_sedan_1786812968933.jpg';
import hyundaiExterImg from '../assets/images/hyundai_exter_suv_1786812993450.jpg';

import marutiGrandVitaraImg from '../assets/images/maruti_grand_vitara_1786801062029.jpg';
import marutiSwiftImg from '../assets/images/maruti_swift_hatchback_1786812182033.jpg';
import marutiBrezzaImg from '../assets/images/maruti_brezza_suv_1786812931965.jpg';

import mahindraXuv700Img from '../assets/images/mahindra_xuv700_1786801074717.jpg';
import mahindraXuv700InteriorImg from '../assets/images/mahindra_xuv700_interior_1786801233909.jpg';
import mahindraScorpioNImg from '../assets/images/mahindra_scorpio_n_1786812194290.jpg';
import mahindraTharRoxxImg from '../assets/images/mahindra_thar_roxx_1786801126165.jpg';
import mahindraXuv3xoImg from '../assets/images/mahindra_xuv_3xo_1786801197191.jpg';

import kiaSeltosImg from '../assets/images/kia_seltos_1786801160782.jpg';
import kiaSonetImg from '../assets/images/kia_sonet_suv_1786813005760.jpg';
import kiaCarensImg from '../assets/images/kia_carens_mpv_1786813018728.jpg';

import hondaElevateImg from '../assets/images/honda_elevate_1786801148810.jpg';
import hondaCityImg from '../assets/images/honda_city_sedan_1786813031333.jpg';

import toyotaInnovaHycrossImg from '../assets/images/toyota_innova_hycross_1786801114342.jpg';
import toyotaInnovaInteriorImg from '../assets/images/toyota_innova_interior_1786801245153.jpg';
import toyotaFortunerImg from '../assets/images/toyota_fortuner_suv_1786812221535.jpg';

import skodaSlaviaImg from '../assets/images/skoda_slavia_1786801101176.jpg';
import volkswagenVirtusImg from '../assets/images/volkswagen_virtus_1786801172308.jpg';
import mgWindsorEvImg from '../assets/images/mg_windsor_ev_1786801137177.jpg';
import bydAtto3Img from '../assets/images/byd_atto_3_1786801184665.jpg';

const BASE_CARS: Car[] = [
  {
    "id": "tata-nexon-ev",
    "brand": "Tata",
    "model": "Nexon.ev",
    "tagline": "India’s #1 Electric SUV with 465 km Range & 5-Star BNCAP Safety",
    "priceMinLakh": 12.49,
    "priceMaxLakh": 17.19,
    "bodyType": "Compact SUV",
    "fuelTypes": [
      "Electric"
    ],
    "image": tataNexonEvImg,
    "galleryImages": [
      tataNexonEvImg,
      tataNexonInteriorImg
    ],
    "specs": {
      "engineDisplacement": "Permanent Magnet Synchronous Motor",
      "powerPS": 145,
      "torqueNM": 215,
      "transmission": [
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 465,
      "rangeKm": 465,
      "topSpeedKmH": 150,
      "acceleration0to100": 8.9,
      "bootSpaceLitres": 350,
      "groundClearanceMm": 205,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 0,
      "batteryCapacityKWh": 45
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "BNCAP",
      "airbagsCount": 6,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 12.3,
      "sunroof": "Single Pane",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "12.3\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 6000,
      "estimatedYearlyInsurance": 32000,
      "warrantyYears": 3,
      "warrantyKm": 125000,
      "batteryWarrantyYears": 8
    },
    "variants": [
      {
        "name": "Creative+ (Medium Range)",
        "priceLakh": 12.49,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "6 Airbags",
          "10.25\" Screen",
          "Paddle Shifters",
          "ESP"
        ]
      },
      {
        "name": "Fearless+ Long Range (45 kWh)",
        "priceLakh": 14.99,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "465km Range",
          "12.3\" Cinematic Screen",
          "Wireless Android Auto/Apple CarPlay",
          "Fast 60kW DC Charging"
        ]
      },
      {
        "name": "Empowered+ 45 Red Dark Edition",
        "priceLakh": 17.19,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "V2V & V2L Charging",
          "Ventilated Front Seats",
          "360 HD Camera with Blind View",
          "JBL 9-Speaker Audio"
        ]
      }
    ],
    "pros": [
      "Ultra-low running cost (₹1.1/km)",
      "Instant electric torque and responsive city drive",
      "Standard 6 airbags with 5-star BNCAP safety rating",
      "Vehicle-to-Vehicle (V2V) and Vehicle-to-Load (V2L) capability"
    ],
    "cons": [
      "Real-world highway range drops to ~300-330 km with AC",
      "Public DC charging infrastructure still expanding in tier-3 towns"
    ],
    "bestSuitedFor": [
      "Daily city commuters traveling 40-100 km",
      "Tech-forward families wanting 5-star crash protection",
      "Buyers seeking zero-emission convenience"
    ]
  },
  {
    "id": "tata-punch",
    "brand": "Tata",
    "model": "Punch",
    "tagline": "5-Star Safety Micro-SUV with SUV Stance and Twin-Cylinder iCNG",
    "priceMinLakh": 6.13,
    "priceMaxLakh": 10.2,
    "bodyType": "Hatchback",
    "fuelTypes": [
      "Petrol",
      "CNG"
    ],
    "image": tataPunchImg,
    "galleryImages": [
      tataPunchImg
    ],
    "specs": {
      "engineDisplacement": "1.2L Revotron 3-Cyl Petrol / iCNG",
      "powerPS": 88,
      "torqueNM": 115,
      "transmission": [
        "Manual",
        "AMT"
      ],
      "mileageKmPerLitreOrKWh": 20.09,
      "topSpeedKmH": 150,
      "acceleration0to100": 15,
      "bootSpaceLitres": 366,
      "groundClearanceMm": 187,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 37
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "Global NCAP",
      "airbagsCount": 6,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": false,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.25,
      "sunroof": "Single Pane",
      "ventilatedSeats": false,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Automatic Climate Control",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.25\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 5500,
      "estimatedYearlyInsurance": 22000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "Pure 1.2 MT",
        "priceLakh": 6.13,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "Dual Airbags",
          "ABS with EBD",
          "Brake Sway Control",
          "90-degree Doors"
        ]
      },
      {
        "name": "Adventure Rhythm iCNG",
        "priceLakh": 7.95,
        "transmission": "Manual",
        "fuel": "CNG",
        "keyFeatures": [
          "Twin-Cylinder Tech",
          "210L Usable Boot Space",
          "7\" Harman Touchscreen"
        ]
      },
      {
        "name": "Creative Flagship Sunroof AMT",
        "priceLakh": 10.2,
        "transmission": "AMT",
        "fuel": "Petrol",
        "keyFeatures": [
          "Voice-Assisted Sunroof",
          "10.25\" Screen",
          "Wireless Charger",
          "16\" Diamond Cut Alloys"
        ]
      }
    ],
    "pros": [
      "Proven 5-Star Global NCAP safety with robust ALFA architecture",
      "187mm ground clearance tackles harsh monsoon potholes easily",
      "Patented Twin-Cylinder CNG design preserves real boot luggage space",
      "90-degree wide opening doors for elderly accessibility"
    ],
    "cons": [
      "3-cylinder petrol engine feels vocal under aggressive high-RPM acceleration",
      "AMT gearbox can have slight shift pauses during overtakes"
    ],
    "bestSuitedFor": [
      "First-time car buyers needing maximum crash safety",
      "Budget-conscious families wanting SUV road presence in compact size",
      "CNG seekers who refuse to sacrifice luggage space"
    ]
  },
  {
    "id": "tata-harrier",
    "brand": "Tata",
    "model": "Harrier",
    "tagline": "Bold OMEGARC Luxury SUV with Level 2 ADAS and 5-Star BNCAP",
    "priceMinLakh": 15.49,
    "priceMaxLakh": 26.44,
    "bodyType": "SUV",
    "fuelTypes": [
      "Diesel"
    ],
    "image": tataHarrierImg,
    "galleryImages": [
      tataHarrierImg
    ],
    "specs": {
      "engineDisplacement": "2.0L Kryotec Turbocharged Diesel",
      "powerPS": 170,
      "torqueNM": 350,
      "transmission": [
        "Manual",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 16.8,
      "topSpeedKmH": 190,
      "acceleration0to100": 10.5,
      "bootSpaceLitres": 445,
      "groundClearanceMm": 205,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 50
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "BNCAP",
      "airbagsCount": 7,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "7 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 12.3,
      "sunroof": "Panoramic",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "12.3\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 11000,
      "estimatedYearlyInsurance": 48000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "Smart 2.0L Diesel MT",
        "priceLakh": 15.49,
        "transmission": "Manual",
        "fuel": "Diesel",
        "keyFeatures": [
          "6 Airbags",
          "LED Projector Headlamps",
          "ESP",
          "All-Wheel Disc Brakes"
        ]
      },
      {
        "name": "Adventure+ AT",
        "priceLakh": 21.69,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "10.25\" Screen",
          "Panoramic Sunroof",
          "360 Camera",
          "Drive Modes"
        ]
      },
      {
        "name": "Fearless+ Dark Edition AT",
        "priceLakh": 26.44,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "Level 2 ADAS (11 features)",
          "12.3\" Screen",
          "JBL 10-Speaker Audio",
          "Memory Driver Seat"
        ]
      }
    ],
    "pros": [
      "Land Rover D8 derived OMEGARC platform with rock-solid high-speed poise",
      "Punchy 350 Nm torque with seamless Hyundai-sourced 6-speed torque converter",
      "Highest adult and child safety score in Bharat NCAP history (5 stars)",
      "Striking road presence with full-width horizon LED DRL lightbars"
    ],
    "cons": [
      "Diesel engine only (no petrol option available in current lineup)",
      "Heavy steering feel during tight low-speed parking maneuvers"
    ],
    "bestSuitedFor": [
      "Highway enthusiasts and long-distance cross-country tourers",
      "Discerning SUV buyers desiring 5-seater luxury and fortress-like safety"
    ]
  },
  {
    "id": "tata-safari",
    "brand": "Tata",
    "model": "Safari",
    "tagline": "India’s Flagship 7-Seater Luxury SUV with Ventilated Captain Seats",
    "priceMinLakh": 16.19,
    "priceMaxLakh": 27.34,
    "bodyType": "SUV",
    "fuelTypes": [
      "Diesel"
    ],
    "image": tataSafariImg,
    "galleryImages": [
      tataSafariImg
    ],
    "specs": {
      "engineDisplacement": "2.0L Kryotec Turbocharged Diesel",
      "powerPS": 170,
      "torqueNM": 350,
      "transmission": [
        "Manual",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 16.3,
      "topSpeedKmH": 185,
      "acceleration0to100": 10.8,
      "bootSpaceLitres": 420,
      "groundClearanceMm": 205,
      "seatingCapacity": 7,
      "fuelTankCapacityLitres": 50
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "BNCAP",
      "airbagsCount": 7,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "7 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 12.3,
      "sunroof": "Panoramic",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "12.3\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 12000,
      "estimatedYearlyInsurance": 52000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "Smart (7-Seater) MT",
        "priceLakh": 16.19,
        "transmission": "Manual",
        "fuel": "Diesel",
        "keyFeatures": [
          "6 Airbags",
          "Tilt & Telescopic Steering",
          "ESP",
          "All-Disc Brakes"
        ]
      },
      {
        "name": "Adventure+ AT",
        "priceLakh": 22.49,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "Panoramic Sunroof",
          "10.25\" Screen",
          "Terrain Response Modes",
          "360 Camera"
        ]
      },
      {
        "name": "Accomplished+ 6S Dark AT",
        "priceLakh": 27.34,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "Ventilated 1st & 2nd Row Captain Seats",
          "Level 2 ADAS",
          "Gesture Tailgate",
          "JBL 10-Speaker Audio"
        ]
      }
    ],
    "pros": [
      "First-in-class ventilated 2nd-row captain seats for VIP chauffeured comfort",
      "5-Star BNCAP top safety rating for adult and child occupants",
      "Panoramic sunroof with ambient mood lighting strip",
      "Plush ride quality over broken roads and expressways"
    ],
    "cons": [
      "3rd-row legroom is best suited for teenagers or children on long journeys",
      "No AWD/4x4 option available (front-wheel drive architecture)"
    ],
    "bestSuitedFor": [
      "Large families needing premium 6/7 seating versatility",
      "Chauffeur-driven executives wanting airline-style middle-row luxury"
    ]
  },
  {
    "id": "tata-curvv-ev",
    "brand": "Tata",
    "model": "Curvv.ev",
    "tagline": "India’s First Mass-Market Electric SUV Coupe with 585 km Range",
    "priceMinLakh": 17.49,
    "priceMaxLakh": 21.99,
    "bodyType": "Coupe",
    "fuelTypes": [
      "Electric"
    ],
    "image": tataCurvvImg,
    "galleryImages": [
      tataCurvvImg
    ],
    "specs": {
      "engineDisplacement": "Acti.ev Permanent Magnet Motor (55 kWh)",
      "powerPS": 167,
      "torqueNM": 215,
      "transmission": [
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 585,
      "rangeKm": 585,
      "topSpeedKmH": 160,
      "acceleration0to100": 8.6,
      "bootSpaceLitres": 500,
      "groundClearanceMm": 190,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 0,
      "batteryCapacityKWh": 55
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "BNCAP",
      "airbagsCount": 6,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 12.3,
      "sunroof": "Panoramic",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "12.3\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 6500,
      "estimatedYearlyInsurance": 38000,
      "warrantyYears": 3,
      "warrantyKm": 125000,
      "batteryWarrantyYears": 8
    },
    "variants": [
      {
        "name": "Creative 45 (45 kWh)",
        "priceLakh": 17.49,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "502km ARAI Range",
          "6 Airbags",
          "Paddle Shifters for Regen",
          "17\" Aero Alloys"
        ]
      },
      {
        "name": "Accomplished 55 (55 kWh)",
        "priceLakh": 19.25,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "585km ARAI Range",
          "12.3\" Cinematic Screen",
          "Panoramic Sunroof",
          "V2L & V2V"
        ]
      },
      {
        "name": "Empowered+ A 55",
        "priceLakh": 21.99,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "Level 2 ADAS (20+ features)",
          "Gesture Power Tailgate",
          "Ventilated Front Seats",
          "JBL Audio"
        ]
      }
    ],
    "pros": [
      "Stunning SUV Coupe silhouette with flush automated door handles",
      "Huge 500L boot + 35L front frunk for versatile family cargo",
      "Super-fast 70kW DC fast charging adds 150km range in 15 mins",
      "5-Star BNCAP certified crash safety architecture"
    ],
    "cons": [
      "Sloping coupe roofline slightly limits rear headroom for 6ft+ passengers",
      "Rear visibility through split tailgate is tighter than boxy SUVs"
    ],
    "bestSuitedFor": [
      "Style-conscious buyers wanting luxury SUV Coupe aesthetics under ₹22L",
      "Intercity EV travelers requiring genuine 400+ km real-world highway range"
    ]
  },
  {
    "id": "hyundai-creta",
    "brand": "Hyundai",
    "model": "Creta",
    "tagline": "The Undisputed King of Mid-Size SUVs with Level 2 ADAS & Dual-Zone AC",
    "priceMinLakh": 11,
    "priceMaxLakh": 20.15,
    "bodyType": "SUV",
    "fuelTypes": [
      "Petrol",
      "Diesel"
    ],
    "image": hyundaiCretaImg,
    "galleryImages": [
      hyundaiCretaImg,
      hyundaiCretaInteriorImg
    ],
    "specs": {
      "engineDisplacement": "1.5L MPi / 1.5L Turbo GDi / 1.5L CRDi Diesel",
      "powerPS": 160,
      "torqueNM": 253,
      "transmission": [
        "Manual",
        "IVT",
        "DCT",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 18.4,
      "topSpeedKmH": 190,
      "acceleration0to100": 8.9,
      "bootSpaceLitres": 433,
      "groundClearanceMm": 190,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 50
    },
    "safety": {
      "ratingStars": 4,
      "testingAgency": "Internal BNCAP Ready",
      "airbagsCount": 6,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.25,
      "sunroof": "Panoramic",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.25\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 7500,
      "estimatedYearlyInsurance": 34000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "E 1.5 Petrol MT",
        "priceLakh": 11,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags Standard",
          "All 4 Disc Brakes",
          "ESC",
          "Hill Start Assist"
        ]
      },
      {
        "name": "SX (O) 1.5 Turbo DCT",
        "priceLakh": 20,
        "transmission": "DCT",
        "fuel": "Petrol",
        "keyFeatures": [
          "160PS Turbo Engine",
          "Level 2 ADAS with 19 features",
          "Voice Panoramic Sunroof",
          "Bose 8-Speaker Audio"
        ]
      },
      {
        "name": "SX (O) 1.5 Diesel AT",
        "priceLakh": 20.15,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "Torque Converter AT",
          "Ventilated Front Seats",
          "Dual Zone Climate Control",
          "Surround View Monitor"
        ]
      }
    ],
    "pros": [
      "Ultra-refined 1.5L Turbo Petrol (160 PS) & frugal 1.5L Diesel (21.8 km/l)",
      "Seamless dual 10.25-inch integrated cockpit displays",
      "Highest resale value in the mid-size SUV category in India",
      "Bose 8-speaker audio with soothing acoustic tuning"
    ],
    "cons": [
      "Waiting period on SX(O) turbo variants can reach 2-3 months in metro hubs",
      "No AWD option available"
    ],
    "bestSuitedFor": [
      "All-round family SUV buyers who prioritize peace of mind and resale value",
      "Professionals seeking premium cabin ambience and Level 2 ADAS"
    ]
  },
  {
    "id": "hyundai-venue",
    "brand": "Hyundai",
    "model": "Venue",
    "tagline": "Feature-Packed Subcompact SUV with Dark Chrome Cascading Grille",
    "priceMinLakh": 7.94,
    "priceMaxLakh": 13.48,
    "bodyType": "Compact SUV",
    "fuelTypes": [
      "Petrol",
      "Diesel"
    ],
    "image": hyundaiVenueImg,
    "galleryImages": [
      hyundaiVenueImg
    ],
    "specs": {
      "engineDisplacement": "1.2L Kappa / 1.0L Turbo GDi / 1.5L CRDi Diesel",
      "powerPS": 120,
      "torqueNM": 172,
      "transmission": [
        "Manual",
        "DCT"
      ],
      "mileageKmPerLitreOrKWh": 18.1,
      "topSpeedKmH": 175,
      "acceleration0to100": 10.8,
      "bootSpaceLitres": 350,
      "groundClearanceMm": 195,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 45
    },
    "safety": {
      "ratingStars": 4,
      "testingAgency": "Global NCAP",
      "airbagsCount": 6,
      "hasADAS": true,
      "adasLevel": 1,
      "hasESP": true,
      "has360Camera": false,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 1 ADAS Suite (AEB, Lane Keep, ACC)",
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 8,
      "sunroof": "Single Pane",
      "ventilatedSeats": false,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Automatic Climate Control",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "8\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 6200,
      "estimatedYearlyInsurance": 26000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "E 1.2 Petrol MT",
        "priceLakh": 7.94,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags",
          "ABS with EBD",
          "ESC",
          "Central Locking"
        ]
      },
      {
        "name": "S(O) 1.0 Turbo MT",
        "priceLakh": 10,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "120PS Turbo Petrol",
          "8\" Touchscreen",
          "LED Projector Headlamps",
          "TPMS"
        ]
      },
      {
        "name": "SX (O) 1.0 Turbo DCT ADAS",
        "priceLakh": 13.48,
        "transmission": "DCT",
        "fuel": "Petrol",
        "keyFeatures": [
          "Hyundai SmartSense Level 1 ADAS",
          "Electric Sunroof",
          "Air Purifier",
          "BlueLink Connected Tech"
        ]
      }
    ],
    "pros": [
      "Refined 1.0L Turbo GDi paired with responsive 7-speed DCT gearbox",
      "SmartSense ADAS offering Forward Collision Warning and Lane Keep Assist",
      "6 airbags standard across all variant grades",
      "2-step reclining rear seats for enhanced passenger comfort"
    ],
    "cons": [
      "Rear seat space is tighter for 3 adults abreast compared to Brezza",
      "Ride is slightly firm over sharp expansion joints at high speed"
    ],
    "bestSuitedFor": [
      "Urban commuters seeking effortless automatic driving",
      "Tech-loving drivers wanting sub-4m convenience with ADAS safety"
    ]
  },
  {
    "id": "hyundai-verna",
    "brand": "Hyundai",
    "model": "Verna",
    "tagline": "5-Star Global NCAP Fastback Sedan with Class-Leading 160 PS Turbo Power",
    "priceMinLakh": 11,
    "priceMaxLakh": 17.42,
    "bodyType": "Sedan",
    "fuelTypes": [
      "Petrol"
    ],
    "image": hyundaiVernaImg,
    "galleryImages": [
      hyundaiVernaImg
    ],
    "specs": {
      "engineDisplacement": "1.5L MPi / 1.5L Turbo GDi",
      "powerPS": 160,
      "torqueNM": 253,
      "transmission": [
        "Manual",
        "IVT",
        "DCT"
      ],
      "mileageKmPerLitreOrKWh": 20.6,
      "topSpeedKmH": 210,
      "acceleration0to100": 8.1,
      "bootSpaceLitres": 528,
      "groundClearanceMm": 170,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 45
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "Global NCAP",
      "airbagsCount": 6,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.25,
      "sunroof": "Single Pane",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.25\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 7200,
      "estimatedYearlyInsurance": 32000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "EX 1.5 Petrol MT",
        "priceLakh": 11,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags",
          "All Wheel Disc Brakes",
          "ESC",
          "Height Adjustable Driver Seat"
        ]
      },
      {
        "name": "SX 1.5 Turbo MT",
        "priceLakh": 14.87,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "160PS Turbo Engine",
          "Dual Screen Setup",
          "Smart Trunk",
          "Red Brake Calipers"
        ]
      },
      {
        "name": "SX(O) 1.5 Turbo DCT ADAS",
        "priceLakh": 17.42,
        "transmission": "DCT",
        "fuel": "Petrol",
        "keyFeatures": [
          "Level 2 ADAS Suite",
          "Heated & Ventilated Front Seats",
          "Bose 8-Speaker Audio",
          "64-Color Ambient Light"
        ]
      }
    ],
    "pros": [
      "Monstrous 160 PS / 253 Nm turbo engine (0-100 km/h in 8.1s)",
      "Certified 5-Star Global NCAP safety rating for adult and child occupants",
      "Cavernous 528-litre boot space with hands-free smart electric release",
      "Heated and ventilated front seats for all-weather luxury"
    ],
    "cons": [
      "Polarizing futuristic front horizon LED bar styling",
      "Low seating posture requires bending compared to compact SUVs"
    ],
    "bestSuitedFor": [
      "Driving enthusiasts desiring sports-car-like highway acceleration",
      "Executive sedan buyers prioritizing boot space and 5-star crash safety"
    ]
  },
  {
    "id": "hyundai-exter",
    "brand": "Hyundai",
    "model": "Exter",
    "tagline": "Micro-SUV with Standard 6 Airbags, Voice Sunroof & Factory Dashcam",
    "priceMinLakh": 6.13,
    "priceMaxLakh": 10.43,
    "bodyType": "Hatchback",
    "fuelTypes": [
      "Petrol",
      "CNG"
    ],
    "image": hyundaiExterImg,
    "galleryImages": [
      hyundaiExterImg
    ],
    "specs": {
      "engineDisplacement": "1.2L Kappa 4-Cylinder Petrol / Bi-Fuel CNG",
      "powerPS": 83,
      "torqueNM": 114,
      "transmission": [
        "Manual",
        "AMT"
      ],
      "mileageKmPerLitreOrKWh": 19.4,
      "topSpeedKmH": 155,
      "acceleration0to100": 12.6,
      "bootSpaceLitres": 391,
      "groundClearanceMm": 185,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 37
    },
    "safety": {
      "ratingStars": 4,
      "testingAgency": "Internal Testing",
      "airbagsCount": 6,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": false,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 8,
      "sunroof": "Single Pane",
      "ventilatedSeats": false,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Automatic Climate Control",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "8\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 5200,
      "estimatedYearlyInsurance": 21000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "EX 1.2 MT",
        "priceLakh": 6.13,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags Standard",
          "ABS with EBD",
          "Keyless Entry",
          "Digital Cluster"
        ]
      },
      {
        "name": "S Hy-CNG Duo",
        "priceLakh": 8.43,
        "transmission": "Manual",
        "fuel": "CNG",
        "keyFeatures": [
          "Dual Cylinder CNG",
          "Usable Luggage Space",
          "8\" Touchscreen",
          "Rear AC Vents"
        ]
      },
      {
        "name": "SX (O) Connect AMT",
        "priceLakh": 10.43,
        "transmission": "AMT",
        "fuel": "Petrol",
        "keyFeatures": [
          "Dual Camera Dashcam",
          "Voice Sunroof",
          "Paddle Shifters",
          "BlueLink Connected Tech"
        ]
      }
    ],
    "pros": [
      "Ultra-smooth 4-cylinder engine with superior refinement compared to 3-cyl competitors",
      "Factory dual-camera Dashcam with smartphone wireless video download",
      "6 airbags standard across the entire model line",
      "Paddle shifters equipped on the smart AMT automatic variant"
    ],
    "cons": [
      "Boxy rear styling can divide opinions",
      "Rear suspension feels soft with full luggage load on wavy roads"
    ],
    "bestSuitedFor": [
      "City families looking for a feature-packed entry SUV under ₹10 Lakhs",
      "Commuters desiring butter-smooth 4-cylinder engine refinement"
    ]
  },
  {
    "id": "maruti-grand-vitara-hybrid",
    "brand": "Maruti Suzuki",
    "model": "Grand Vitara",
    "tagline": "Self-Charging Strong Hybrid SUV Delivering 27.97 km/l Fuel Mileage",
    "priceMinLakh": 10.99,
    "priceMaxLakh": 20.09,
    "bodyType": "SUV",
    "fuelTypes": [
      "Hybrid",
      "Petrol",
      "CNG"
    ],
    "image": marutiGrandVitaraImg,
    "galleryImages": [
      marutiGrandVitaraImg
    ],
    "specs": {
      "engineDisplacement": "1.5L Intelligent Electric Strong Hybrid / 1.5L K15C Mild Hybrid",
      "powerPS": 116,
      "torqueNM": 141,
      "transmission": [
        "e-CVT",
        "Manual",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 27.97,
      "topSpeedKmH": 170,
      "acceleration0to100": 11.5,
      "bootSpaceLitres": 256,
      "groundClearanceMm": 208,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 45
    },
    "safety": {
      "ratingStars": 4,
      "testingAgency": "Internal Testing",
      "airbagsCount": 6,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 9,
      "sunroof": "Panoramic",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "9\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 6500,
      "estimatedYearlyInsurance": 31000,
      "warrantyYears": 3,
      "warrantyKm": 100000,
      "batteryWarrantyYears": 8
    },
    "variants": [
      {
        "name": "Sigma 1.5 Mild Hybrid MT",
        "priceLakh": 10.99,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "Dual Airbags",
          "ESP with Hill Hold",
          "Keyless Push Start",
          "Auto Climate Control"
        ]
      },
      {
        "name": "Alpha 1.5 ALLGRIP 4WD MT",
        "priceLakh": 17.01,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "AllGrip Electronic AWD",
          "Auto/Sport/Snow/Lock Modes",
          "360 Camera",
          "9\" SmartPlay Pro+"
        ]
      },
      {
        "name": "Alpha+ Strong Hybrid e-CVT",
        "priceLakh": 20.09,
        "transmission": "e-CVT",
        "fuel": "Hybrid",
        "keyFeatures": [
          "27.97 km/l Strong Hybrid",
          "Panoramic Sunroof",
          "Ventilated Front Seats",
          "Head-Up Display"
        ]
      }
    ],
    "pros": [
      "Exceptional 27.97 km/l fuel economy saves ~₹60,000/year on fuel bills",
      "Silky silent pure EV mode driving at low city speeds",
      "ALLGRIP AWD variant available for muddy trails and snowy hills",
      "Maruti Suzuki’s unparalleled 4,000+ service center pan-India network"
    ],
    "cons": [
      "Hybrid battery placement reduces boot space to 256 litres",
      "3-cylinder hybrid engine gets audible under sudden heavy overtakes"
    ],
    "bestSuitedFor": [
      "High-mileage drivers traveling 1,500+ km/month seeking lowest running costs",
      "Buyers wanting green hybrid credentials without needing plug-in chargers"
    ]
  },
  {
    "id": "maruti-swift",
    "brand": "Maruti Suzuki",
    "model": "Swift",
    "tagline": "4th Gen Iconic Hatchback with 24.8 km/l Z-Series Mileage & 6 Airbags",
    "priceMinLakh": 6.49,
    "priceMaxLakh": 9.6,
    "bodyType": "Hatchback",
    "fuelTypes": [
      "Petrol",
      "CNG"
    ],
    "image": marutiSwiftImg,
    "galleryImages": [
      marutiSwiftImg
    ],
    "specs": {
      "engineDisplacement": "1.2L Z12E 3-Cylinder Dual VVT Petrol",
      "powerPS": 82,
      "torqueNM": 112,
      "transmission": [
        "Manual",
        "AMT"
      ],
      "mileageKmPerLitreOrKWh": 24.8,
      "topSpeedKmH": 165,
      "acceleration0to100": 11.9,
      "bootSpaceLitres": 265,
      "groundClearanceMm": 163,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 37
    },
    "safety": {
      "ratingStars": 4,
      "testingAgency": "Euro NCAP 3-Star / Internal 4-Star",
      "airbagsCount": 6,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": false,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 9,
      "sunroof": "None",
      "ventilatedSeats": false,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Automatic Climate Control",
        "Rear AC Vents & Armrest",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "9\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 4800,
      "estimatedYearlyInsurance": 19000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "LXi 1.2 Petrol MT",
        "priceLakh": 6.49,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags Standard",
          "ESP with Hill Hold",
          "Remote Keyless Entry",
          "Halogen Projectors"
        ]
      },
      {
        "name": "VXi (O) 1.2 AMT",
        "priceLakh": 7.9,
        "transmission": "AMT",
        "fuel": "Petrol",
        "keyFeatures": [
          "7\" Touchscreen",
          "Wireless Android Auto/CarPlay",
          "Steering Mounted Controls",
          "Rear AC Vents"
        ]
      },
      {
        "name": "ZXi+ 1.2 Dual Tone AMT",
        "priceLakh": 9.6,
        "transmission": "AMT",
        "fuel": "Petrol",
        "keyFeatures": [
          "9\" SmartPlay Pro+",
          "Arkamys Surround Sound",
          "LED DRLs & Projector Headlamps",
          "Cruise Control"
        ]
      }
    ],
    "pros": [
      "Outstanding 24.8 km/l real-world mileage with the new Z-series engine",
      "6 airbags and ESP standard from the base LXi variant",
      "Nimble handling with lightweight Heartect chassis for effortless city parking",
      "Class-leading resale value in Indian used car market"
    ],
    "cons": [
      "Boot capacity of 265 litres is smaller than Baleno and Altroz",
      "No factory sunroof option available"
    ],
    "bestSuitedFor": [
      "Daily city office commuters wanting rock-solid reliability and low fuel cost",
      "Young drivers and nuclear families seeking an easy-to-drive dynamic hatchback"
    ]
  },
  {
    "id": "maruti-brezza",
    "brand": "Maruti Suzuki",
    "model": "Brezza",
    "tagline": "India’s Favorite 1.5L Reliable SUV with Electric Sunroof & 360 Camera",
    "priceMinLakh": 8.34,
    "priceMaxLakh": 14.14,
    "bodyType": "Compact SUV",
    "fuelTypes": [
      "Petrol",
      "CNG"
    ],
    "image": marutiBrezzaImg,
    "galleryImages": [
      marutiBrezzaImg
    ],
    "specs": {
      "engineDisplacement": "1.5L K15C Smart Hybrid 4-Cylinder Petrol",
      "powerPS": 103,
      "torqueNM": 137,
      "transmission": [
        "Manual",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 19.89,
      "topSpeedKmH": 175,
      "acceleration0to100": 12,
      "bootSpaceLitres": 328,
      "groundClearanceMm": 200,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 48
    },
    "safety": {
      "ratingStars": 4,
      "testingAgency": "Global NCAP 4-Star",
      "airbagsCount": 6,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 9,
      "sunroof": "Single Pane",
      "ventilatedSeats": false,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Automatic Climate Control",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "9\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 5900,
      "estimatedYearlyInsurance": 27000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "LXi 1.5 MT",
        "priceLakh": 8.34,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "ESP with Hill Hold",
          "Dual Airbags",
          "Keyless Entry",
          "Rear AC Vents"
        ]
      },
      {
        "name": "VXi S-CNG MT",
        "priceLakh": 10.64,
        "transmission": "Manual",
        "fuel": "CNG",
        "keyFeatures": [
          "25.51 km/kg CNG Economy",
          "7\" SmartPlay Audio",
          "Auto Climate Control",
          "Rear Defogger"
        ]
      },
      {
        "name": "ZXi+ 1.5 6-Speed AT",
        "priceLakh": 14.14,
        "transmission": "Automatic",
        "fuel": "Petrol",
        "keyFeatures": [
          "Head-Up Display",
          "360 View Camera",
          "Electric Sunroof",
          "9\" SmartPlay Pro+ Audio"
        ]
      }
    ],
    "pros": [
      "Ultra-reliable 1.5L 4-cylinder naturally aspirated engine with low maintenance",
      "Proper 6-speed torque converter automatic with paddle shifters",
      "Head-Up Display (HUD) and 360-degree parking camera in top trim",
      "Generous cabin width with ample shoulder room for 3 adults in the rear"
    ],
    "cons": [
      "Lacks punchy turbo surge for enthusiastic rapid overtaking",
      "No diesel powertrain option available"
    ],
    "bestSuitedFor": [
      "Families prioritizing long-term trouble-free ownership (10+ years)",
      "Buyers seeking a comfortable, low-maintenance sub-compact SUV"
    ]
  },
  {
    "id": "mahindra-xuv700",
    "brand": "Mahindra",
    "model": "XUV700",
    "tagline": "200 PS Flagship 7-Seater SUV with Dual 10.25\" Screens & Level 2 ADAS",
    "priceMinLakh": 13.99,
    "priceMaxLakh": 26.99,
    "bodyType": "SUV",
    "fuelTypes": [
      "Petrol",
      "Diesel"
    ],
    "image": mahindraXuv700Img,
    "galleryImages": [
      mahindraXuv700Img,
      mahindraXuv700InteriorImg
    ],
    "specs": {
      "engineDisplacement": "2.0L mStallion Turbo Petrol / 2.2L mHawk Diesel",
      "powerPS": 200,
      "torqueNM": 380,
      "transmission": [
        "Manual",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 15.2,
      "topSpeedKmH": 200,
      "acceleration0to100": 8.8,
      "bootSpaceLitres": 450,
      "groundClearanceMm": 200,
      "seatingCapacity": 7,
      "fuelTankCapacityLitres": 60
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "Global NCAP",
      "airbagsCount": 7,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "7 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.25,
      "sunroof": "Panoramic",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.25\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 10500,
      "estimatedYearlyInsurance": 48000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "MX 2.0 Petrol MT (5-Seater)",
        "priceLakh": 13.99,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "200PS Engine",
          "8\" Touchscreen",
          "7\" Digital Cluster",
          "ESC"
        ]
      },
      {
        "name": "AX7 2.2 Diesel AT (7-Seater)",
        "priceLakh": 22.49,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "Level 2 ADAS",
          "Skyroof Panoramic Sunroof",
          "Dual 10.25\" Screens",
          "Memory Seat"
        ]
      },
      {
        "name": "AX7 Luxury AWD Diesel AT",
        "priceLakh": 26.99,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "All-Wheel Drive (AWD)",
          "Sony 12-Speaker 3D Audio",
          "360 Camera",
          "Blind View Monitor"
        ]
      }
    ],
    "pros": [
      "Class-leading 200 PS Turbo Petrol and 450 Nm Diesel powerhouses",
      "Segment-benchmark Sony 3D 12-speaker audio system with roof speakers",
      "Full Level 2 ADAS suite (Adaptive Cruise Control, AEB, Lane Keep)",
      "Gigantic Skyroof panoramic sunroof creating a bright, airy cabin"
    ],
    "cons": [
      "Petrol engine fuel efficiency is thirsty in bumper-to-bumper city traffic (~9-11 km/l)",
      "High demand can result in noticeable dealership waiting periods on AWD models"
    ],
    "bestSuitedFor": [
      "Enthusiast drivers wanting blistering 200PS highway performance",
      "Large families needing safe, feature-rich 7-seater touring capabilities"
    ]
  },
  {
    "id": "mahindra-scorpio-n",
    "brand": "Mahindra",
    "model": "Scorpio-N",
    "tagline": "The Big Daddy of SUVs with Body-on-Frame 4XPLOR Off-Road Prowess",
    "priceMinLakh": 13.85,
    "priceMaxLakh": 24.54,
    "bodyType": "SUV",
    "fuelTypes": [
      "Diesel",
      "Petrol"
    ],
    "image": mahindraScorpioNImg,
    "galleryImages": [
      mahindraScorpioNImg
    ],
    "specs": {
      "engineDisplacement": "2.0L mStallion Turbo / 2.2L mHawk Diesel",
      "powerPS": 203,
      "torqueNM": 400,
      "transmission": [
        "Manual",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 14.5,
      "topSpeedKmH": 185,
      "acceleration0to100": 9.8,
      "bootSpaceLitres": 460,
      "groundClearanceMm": 187,
      "seatingCapacity": 7,
      "fuelTankCapacityLitres": 57
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "Global NCAP",
      "airbagsCount": 6,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 8,
      "sunroof": "Single Pane",
      "ventilatedSeats": false,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Automatic Climate Control",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "8\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 9800,
      "estimatedYearlyInsurance": 44000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "Z2 2.2 Diesel MT",
        "priceLakh": 13.85,
        "transmission": "Manual",
        "fuel": "Diesel",
        "keyFeatures": [
          "132PS mHawk Diesel",
          "Touchscreen Infotainment",
          "All-Wheel Disc Brakes",
          "ESC"
        ]
      },
      {
        "name": "Z8 2.2 Diesel AT",
        "priceLakh": 20.95,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "175PS Diesel",
          "6-Speed Aisin AT",
          "Sunroof",
          "Dual Zone Climate Control"
        ]
      },
      {
        "name": "Z8 L 4x4 Diesel AT",
        "priceLakh": 24.54,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "4XPLOR Terrain Modes",
          "Mechanical Rear Diff Lock",
          "Sony 12-Speaker Audio",
          "Front Camera"
        ]
      }
    ],
    "pros": [
      "Authentic body-on-frame toughness that glides over broken rural roads and ruts",
      "5-Star Global NCAP safety rating for adult protection",
      "4XPLOR terrain system with low range gearbox and mechanical locking differential",
      "High commanding driving position with unhindered panoramic road view"
    ],
    "cons": [
      "Body roll is noticeable around fast mountain switchbacks compared to monocoque SUVs",
      "Single-pane sunroof rather than panoramic glass"
    ],
    "bestSuitedFor": [
      "Rural & highway tourers needing indestructible suspension durability",
      "Off-road lovers seeking real 4x4 capabilities with comfortable family seating"
    ]
  },
  {
    "id": "mahindra-thar-roxx",
    "brand": "Mahindra",
    "model": "Thar Roxx",
    "tagline": "5-Door Iconic Off-Roader with Panoramic Sunroof & Level 2 ADAS",
    "priceMinLakh": 12.99,
    "priceMaxLakh": 22.49,
    "bodyType": "SUV",
    "fuelTypes": [
      "Petrol",
      "Diesel"
    ],
    "image": mahindraTharRoxxImg,
    "galleryImages": [
      mahindraTharRoxxImg
    ],
    "specs": {
      "engineDisplacement": "2.0L mStallion Turbo / 2.2L mHawk Diesel",
      "powerPS": 177,
      "torqueNM": 380,
      "transmission": [
        "Manual",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 14.8,
      "topSpeedKmH": 170,
      "acceleration0to100": 10.2,
      "bootSpaceLitres": 447,
      "groundClearanceMm": 217,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 57
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "BNCAP",
      "airbagsCount": 6,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.25,
      "sunroof": "Panoramic",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.25\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 9500,
      "estimatedYearlyInsurance": 42000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "MX1 2.0 Petrol RWD MT",
        "priceLakh": 12.99,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags",
          "ESC",
          "162PS Engine",
          "LED Taillamps"
        ]
      },
      {
        "name": "AX5 L 2.2 Diesel RWD AT",
        "priceLakh": 18.99,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "Level 2 ADAS",
          "10.25\" Twin Screens",
          "Electronic Parking Brake",
          "Wireless Charger"
        ]
      },
      {
        "name": "AX7 L 4x4 Diesel AT",
        "priceLakh": 22.49,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "4x4 with 4XPLOR Modes",
          "Panoramic Sunroof",
          "Ventilated Seats",
          "Harman Kardon 9-Speaker Audio"
        ]
      }
    ],
    "pros": [
      "Unbeatable macho road presence with practical 5-door family usability",
      "Penta-link rear suspension delivers dramatically improved highway ride comfort",
      "5-Star Bharat NCAP safety rating with Level 2 ADAS safety tech",
      "Gigantic panoramic sunroof in a genuine ladder-frame off-roader"
    ],
    "cons": [
      "Climbing in and out requires effort due to high 217mm ground clearance",
      "White leatherette upholstery in off-road environment needs careful cleaning"
    ],
    "bestSuitedFor": [
      "Lifestyle adventurers who want Thar charm without sacrificing daily family comfort",
      "Highway and mountain road travelers who encounter severe terrain"
    ]
  },
  {
    "id": "mahindra-xuv-3xo",
    "brand": "Mahindra",
    "model": "XUV 3XO",
    "tagline": "Turbocharged Compact SUV with Skyroof & Level 2 ADAS from ₹7.79 Lakh",
    "priceMinLakh": 7.79,
    "priceMaxLakh": 15.49,
    "bodyType": "Compact SUV",
    "fuelTypes": [
      "Petrol",
      "Diesel"
    ],
    "image": mahindraXuv3xoImg,
    "galleryImages": [
      mahindraXuv3xoImg
    ],
    "specs": {
      "engineDisplacement": "1.2L mStallion TGDi (130PS) / 1.5L CRDe Diesel",
      "powerPS": 130,
      "torqueNM": 230,
      "transmission": [
        "Manual",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 20.1,
      "topSpeedKmH": 180,
      "acceleration0to100": 8.8,
      "bootSpaceLitres": 364,
      "groundClearanceMm": 201,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 42
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "Global NCAP / BNCAP",
      "airbagsCount": 6,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.25,
      "sunroof": "Panoramic",
      "ventilatedSeats": false,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Automatic Climate Control",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.25\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 6200,
      "estimatedYearlyInsurance": 27000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "MX1 1.2 Petrol MT",
        "priceLakh": 7.79,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags",
          "All 4 Disc Brakes",
          "ESC",
          "Engine Start-Stop"
        ]
      },
      {
        "name": "AX5 1.2 Petrol AT",
        "priceLakh": 12.19,
        "transmission": "Automatic",
        "fuel": "Petrol",
        "keyFeatures": [
          "Panoramic Skyroof",
          "Dual 10.25\" Screens",
          "Wireless Android Auto/CarPlay",
          "Auto Climate"
        ]
      },
      {
        "name": "AX7 L 1.2 TGDi AT",
        "priceLakh": 15.49,
        "transmission": "Automatic",
        "fuel": "Petrol",
        "keyFeatures": [
          "130PS TGDi Direct Injection Engine",
          "Level 2 ADAS",
          "Harman Kardon Audio",
          "360 Blind View Monitor"
        ]
      }
    ],
    "pros": [
      "First sub-compact SUV in India with a panoramic Skyroof sunroof",
      "130PS / 230Nm direct-injection engine offers quickest acceleration in class",
      "Level 2 ADAS with 10 intelligent driving assistance functions",
      "Widest cabin in sub-4m category accommodating 3 rear passengers comfortably"
    ],
    "cons": [
      "Firm low-speed suspension over urban speed breakers",
      "Boot capacity of 364L is measured till roofline"
    ],
    "bestSuitedFor": [
      "Enthusiast drivers seeking maximum horsepower in a compact size",
      "Buyers wanting premium segment-first features like panoramic roof and Level 2 ADAS"
    ]
  },
  {
    "id": "kia-seltos",
    "brand": "Kia",
    "model": "Seltos",
    "tagline": "Dynamic Mid-Size SUV with Dual Panoramic Displays & 160 PS Turbo Power",
    "priceMinLakh": 10.9,
    "priceMaxLakh": 20.35,
    "bodyType": "SUV",
    "fuelTypes": [
      "Petrol",
      "Diesel"
    ],
    "image": kiaSeltosImg,
    "galleryImages": [
      kiaSeltosImg
    ],
    "specs": {
      "engineDisplacement": "1.5L Smartstream Turbo Petrol / 1.5L CRDi Diesel",
      "powerPS": 160,
      "torqueNM": 253,
      "transmission": [
        "Manual",
        "iMT",
        "IVT",
        "DCT",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 17.9,
      "topSpeedKmH": 195,
      "acceleration0to100": 8.9,
      "bootSpaceLitres": 433,
      "groundClearanceMm": 190,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 50
    },
    "safety": {
      "ratingStars": 4,
      "testingAgency": "Australasian NCAP 5-Star / India 4-Star",
      "airbagsCount": 6,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.25,
      "sunroof": "Panoramic",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.25\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 7800,
      "estimatedYearlyInsurance": 35000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "HTE 1.5 Petrol MT",
        "priceLakh": 10.9,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags",
          "All Disc Brakes",
          "ESC",
          "Digital Instrument Cluster"
        ]
      },
      {
        "name": "HTX 1.5 Diesel AT",
        "priceLakh": 18.2,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "Dual Panoramic Sunroof",
          "Ventilated Front Seats",
          "17\" Alloys",
          "LED Mood Lamps"
        ]
      },
      {
        "name": "GTX+ 1.5 Turbo DCT ADAS",
        "priceLakh": 20.35,
        "transmission": "DCT",
        "fuel": "Petrol",
        "keyFeatures": [
          "160PS Turbo Engine",
          "Level 2 ADAS Suite",
          "Dual 10.25\" Displays",
          "Bose 8-Speaker Audio"
        ]
      }
    ],
    "pros": [
      "Punchy 160PS Turbo engine paired with quick 7-speed DCT gearbox",
      "Dual 10.25-inch curved display setup with sleek digital graphics",
      "Dual-pane panoramic sunroof and ventilated 8-way power front seats",
      "Bose premium 8-speaker audio system with dynamic speed compensation"
    ],
    "cons": [
      "Stiffer suspension setup geared towards handling over plush comfort",
      "DCT gearbox can heat up in extreme slow creeping stop-and-go traffic"
    ],
    "bestSuitedFor": [
      "Style-conscious urban executives seeking sporty dynamics",
      "Drivers who value tech-loaded cabins and bold Korean styling"
    ]
  },
  {
    "id": "kia-sonet",
    "brand": "Kia",
    "model": "Sonet",
    "tagline": "Aggressive Compact SUV with Level 1 ADAS & Ventilated Front Seats",
    "priceMinLakh": 7.99,
    "priceMaxLakh": 15.75,
    "bodyType": "Compact SUV",
    "fuelTypes": [
      "Petrol",
      "Diesel"
    ],
    "image": kiaSonetImg,
    "galleryImages": [
      kiaSonetImg
    ],
    "specs": {
      "engineDisplacement": "1.2L Smartstream / 1.0L Turbo GDi / 1.5L CRDi Diesel",
      "powerPS": 120,
      "torqueNM": 250,
      "transmission": [
        "Manual",
        "iMT",
        "DCT",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 18.83,
      "topSpeedKmH": 175,
      "acceleration0to100": 10.8,
      "bootSpaceLitres": 385,
      "groundClearanceMm": 205,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 45
    },
    "safety": {
      "ratingStars": 4,
      "testingAgency": "Global NCAP",
      "airbagsCount": 6,
      "hasADAS": true,
      "adasLevel": 1,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 1 ADAS Suite (AEB, Lane Keep, ACC)",
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.25,
      "sunroof": "Single Pane",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.25\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 6400,
      "estimatedYearlyInsurance": 28000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "HTE 1.2 Petrol MT",
        "priceLakh": 7.99,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags",
          "ESC",
          "Halogen Projectors",
          "Rear AC Vents"
        ]
      },
      {
        "name": "HTX 1.5 Diesel AT",
        "priceLakh": 13.1,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "116PS Diesel AT",
          "Sunroof",
          "LED Headlamps & DRLs",
          "Drive Modes"
        ]
      },
      {
        "name": "X-Line 1.0 Turbo DCT ADAS",
        "priceLakh": 15.75,
        "transmission": "DCT",
        "fuel": "Petrol",
        "keyFeatures": [
          "Matte Graphite Paint",
          "Level 1 ADAS (10 features)",
          "Ventilated Seats",
          "Bose 7-Speaker Audio"
        ]
      }
    ],
    "pros": [
      "Proper 6-speed torque converter automatic paired with punchy 1.5L diesel",
      "First-in-segment ventilated front seats for hot Indian summers",
      "Level 1 ADAS with Front Collision Warning and Lane Departure Alert",
      "Deep 385-litre boot space accommodating multiple trolley bags"
    ],
    "cons": [
      "Rear legroom is snug for tall adult passengers on extended highway drives",
      "Firm ride on rough, patchy city roads with 16-inch low-profile alloys"
    ],
    "bestSuitedFor": [
      "Solo commuters or couples seeking a premium, feature-packed compact SUV",
      "Buyers wanting the only sub-4m diesel with a refined torque converter automatic"
    ]
  },
  {
    "id": "kia-carens",
    "brand": "Kia",
    "model": "Carens",
    "tagline": "Versatile 6/7 Seater Family MPV with One-Touch Electric Tumble Seats",
    "priceMinLakh": 10.52,
    "priceMaxLakh": 19.67,
    "bodyType": "MPV",
    "fuelTypes": [
      "Petrol",
      "Diesel"
    ],
    "image": kiaCarensImg,
    "galleryImages": [
      kiaCarensImg
    ],
    "specs": {
      "engineDisplacement": "1.5L Smartstream / 1.5L Turbo Petrol / 1.5L Diesel",
      "powerPS": 160,
      "torqueNM": 253,
      "transmission": [
        "Manual",
        "iMT",
        "DCT",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 17.5,
      "topSpeedKmH": 185,
      "acceleration0to100": 9.5,
      "bootSpaceLitres": 492,
      "groundClearanceMm": 195,
      "seatingCapacity": 7,
      "fuelTankCapacityLitres": 45
    },
    "safety": {
      "ratingStars": 4,
      "testingAgency": "Global NCAP",
      "airbagsCount": 6,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.25,
      "sunroof": "Single Pane",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.25\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 7200,
      "estimatedYearlyInsurance": 33000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "Premium 1.5 Petrol MT",
        "priceLakh": 10.52,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags",
          "All-Disc Brakes",
          "ESC",
          "One-Touch Electric Tumble"
        ]
      },
      {
        "name": "Prestige Plus 1.5 Turbo iMT",
        "priceLakh": 14.75,
        "transmission": "iMT",
        "fuel": "Petrol",
        "keyFeatures": [
          "160PS Turbo Engine",
          "Keyless Push Start",
          "Auto Climate Control",
          "16\" Alloys"
        ]
      },
      {
        "name": "Luxury Plus 1.5 Diesel AT (6-Seater)",
        "priceLakh": 19.67,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "Ventilated Captain Seats",
          "Bose 8-Speaker Audio",
          "Sunroof",
          "Air Purifier"
        ]
      }
    ],
    "pros": [
      "One-touch electric tumble 2nd-row seats make 3rd-row ingress effortless for kids & seniors",
      "6 airbags and all-wheel disc brakes standard across all trims",
      "Plush ride quality with exceptional shock absorption over uneven surfaces",
      "160PS turbo petrol provides strong highway passing power with full passenger load"
    ],
    "cons": [
      "Single-pane sunroof instead of a panoramic glass roof",
      "Subtle MPV silhouette lacks aggressive butch SUV visual stance"
    ],
    "bestSuitedFor": [
      "Joint families needing comfortable, accessible 3-row seating",
      "Long-distance family vacationers seeking passenger comfort and luggage flexibility"
    ]
  },
  {
    "id": "honda-elevate",
    "brand": "Honda",
    "model": "Elevate",
    "tagline": "Reliable Japanese Engineering with 220mm Ground Clearance & Honda SENSING",
    "priceMinLakh": 11.69,
    "priceMaxLakh": 16.51,
    "bodyType": "SUV",
    "fuelTypes": [
      "Petrol"
    ],
    "image": hondaElevateImg,
    "galleryImages": [
      hondaElevateImg
    ],
    "specs": {
      "engineDisplacement": "1.5L i-VTEC DOHC 4-Cylinder Petrol",
      "powerPS": 121,
      "torqueNM": 145,
      "transmission": [
        "Manual",
        "CVT"
      ],
      "mileageKmPerLitreOrKWh": 16.92,
      "topSpeedKmH": 175,
      "acceleration0to100": 10.8,
      "bootSpaceLitres": 458,
      "groundClearanceMm": 220,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 40
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "Japan NCAP / Global Ready",
      "airbagsCount": 6,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.25,
      "sunroof": "Single Pane",
      "ventilatedSeats": false,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Automatic Climate Control",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.25\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 6800,
      "estimatedYearlyInsurance": 31000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "SV 1.5 MT",
        "priceLakh": 11.69,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "Dual Airbags",
          "ESC with VSA",
          "LED Projectors",
          "Auto Climate"
        ]
      },
      {
        "name": "V 1.5 CVT",
        "priceLakh": 13.41,
        "transmission": "CVT",
        "fuel": "Petrol",
        "keyFeatures": [
          "8\" Touchscreen",
          "Wireless CarPlay",
          "Paddle Shifters",
          "Keyless Entry"
        ]
      },
      {
        "name": "ZX 1.5 CVT Honda SENSING",
        "priceLakh": 16.51,
        "transmission": "CVT",
        "fuel": "Petrol",
        "keyFeatures": [
          "Honda SENSING ADAS Level 2",
          "10.25\" Screen",
          "LaneWatch Camera",
          "Brown Leatherette Seats"
        ]
      }
    ],
    "pros": [
      "Massive 220mm ground clearance matches full-size off-roaders",
      "Legendary 1.5L i-VTEC engine known for bulletproof 15+ year reliability",
      "Largest boot space in mid-size SUV class at 458 litres",
      "Smooth and stress-free CVT transmission for city traffic"
    ],
    "cons": [
      "No Turbo Petrol or Diesel engine options available",
      "Engine becomes audible at high revs when overtaking on steep inclines"
    ],
    "bestSuitedFor": [
      "Buyers prioritizing Japanese long-term reliability and low maintenance",
      "Drivers who frequent badly broken roads requiring high ground clearance"
    ]
  },
  {
    "id": "honda-city",
    "brand": "Honda",
    "model": "City",
    "tagline": "5th Gen Benchmark Executive Sedan with Honda SENSING & 1.5L e:HEV Hybrid",
    "priceMinLakh": 11.82,
    "priceMaxLakh": 20.55,
    "bodyType": "Sedan",
    "fuelTypes": [
      "Petrol",
      "Hybrid"
    ],
    "image": hondaCityImg,
    "galleryImages": [
      hondaCityImg
    ],
    "specs": {
      "engineDisplacement": "1.5L i-VTEC DOHC / 1.5L Atkinson Cycle Strong Hybrid",
      "powerPS": 126,
      "torqueNM": 253,
      "transmission": [
        "Manual",
        "CVT",
        "e-CVT"
      ],
      "mileageKmPerLitreOrKWh": 27.13,
      "topSpeedKmH": 190,
      "acceleration0to100": 10.2,
      "bootSpaceLitres": 506,
      "groundClearanceMm": 165,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 40
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "ASEAN NCAP 5-Star",
      "airbagsCount": 6,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 8,
      "sunroof": "Single Pane",
      "ventilatedSeats": false,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Automatic Climate Control",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "8\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 6900,
      "estimatedYearlyInsurance": 32000,
      "warrantyYears": 3,
      "warrantyKm": 100000,
      "batteryWarrantyYears": 8
    },
    "variants": [
      {
        "name": "SV 1.5 Petrol MT",
        "priceLakh": 11.82,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "4 Airbags",
          "ESC",
          "Tire Pressure Monitor",
          "Projector Headlamps"
        ]
      },
      {
        "name": "ZX 1.5 Petrol CVT SENSING",
        "priceLakh": 16.35,
        "transmission": "CVT",
        "fuel": "Petrol",
        "keyFeatures": [
          "Level 2 ADAS SENSING",
          "6 Airbags",
          "LaneWatch Camera",
          "Electric Sunroof"
        ]
      },
      {
        "name": "ZX 1.5 e:HEV Hybrid",
        "priceLakh": 20.55,
        "transmission": "e-CVT",
        "fuel": "Hybrid",
        "keyFeatures": [
          "27.13 km/l Strong Hybrid",
          "Electronic Parking Brake",
          "Full ADAS Suite",
          "LED Cabin Lights"
        ]
      }
    ],
    "pros": [
      "Iconic sedan ride comfort with sofa-like plush rear legroom",
      "Strong Hybrid variant achieves astonishing 27.13 km/l fuel economy",
      "Honda SENSING ADAS works accurately with intuitive camera system",
      "Immense 506-litre boot holds multiple large international suitcases"
    ],
    "cons": [
      "8-inch touchscreen interface feels dated compared to modern 10.25-inch screens",
      "Ground clearance of 165mm requires care over unscientific monster speed bumps"
    ],
    "bestSuitedFor": [
      "Chauffeur-driven executives and senior professionals",
      "Highway tourers seeking unmatched sofa-like rear seat comfort"
    ]
  },
  {
    "id": "toyota-innova-hycross",
    "brand": "Toyota",
    "model": "Innova Hycross",
    "tagline": "Strong Hybrid Luxury MPV with Ottoman Captain Seats & 21.1 km/l Mileage",
    "priceMinLakh": 18.92,
    "priceMaxLakh": 30.98,
    "bodyType": "MPV",
    "fuelTypes": [
      "Hybrid",
      "Petrol"
    ],
    "image": toyotaInnovaHycrossImg,
    "galleryImages": [
      toyotaInnovaHycrossImg,
      toyotaInnovaInteriorImg
    ],
    "specs": {
      "engineDisplacement": "2.0L TNGA 5th Gen Self-Charging Strong Hybrid",
      "powerPS": 186,
      "torqueNM": 206,
      "transmission": [
        "e-CVT",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 21.1,
      "topSpeedKmH": 180,
      "acceleration0to100": 9.5,
      "bootSpaceLitres": 300,
      "groundClearanceMm": 185,
      "seatingCapacity": 7,
      "fuelTankCapacityLitres": 52
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "ASEAN NCAP",
      "airbagsCount": 6,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.1,
      "sunroof": "Panoramic",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.1\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 8500,
      "estimatedYearlyInsurance": 45000,
      "warrantyYears": 3,
      "warrantyKm": 100000,
      "batteryWarrantyYears": 8
    },
    "variants": [
      {
        "name": "GX 2.0 Petrol AT (7-Seater)",
        "priceLakh": 18.92,
        "transmission": "Automatic",
        "fuel": "Petrol",
        "keyFeatures": [
          "8\" Touchscreen",
          "Apple CarPlay/Android Auto",
          "16\" Alloys",
          "Dual Airbags"
        ]
      },
      {
        "name": "VX 2.0 Strong Hybrid e-CVT",
        "priceLakh": 25.97,
        "transmission": "e-CVT",
        "fuel": "Hybrid",
        "keyFeatures": [
          "21.1 km/l Hybrid",
          "6 Airbags",
          "Paddle Shifters",
          "360 Camera"
        ]
      },
      {
        "name": "ZX (O) Strong Hybrid e-CVT",
        "priceLakh": 30.98,
        "transmission": "e-CVT",
        "fuel": "Hybrid",
        "keyFeatures": [
          "Powered Ottoman Captain Seats",
          "Toyota Safety Sense ADAS",
          "JBL 9-Speaker Audio",
          "Panoramic Sunroof"
        ]
      }
    ],
    "pros": [
      "Executive Ottoman captain seats with powered calf support and ventilation",
      "Monocoque TNGA-C platform provides car-like handling and light steering",
      "Outstanding 21.1 km/l efficiency from a large 7-seater luxury cruiser",
      "Legendary Toyota reliability with best-in-class resale retention in India"
    ],
    "cons": [
      "Waiting periods on ZX(O) hybrid trims can exceed 6 months",
      "Absence of a diesel engine option for commercial fleet buyers"
    ],
    "bestSuitedFor": [
      "High-profile families wanting first-class airline comfort on road trips",
      "Executives and VIPs who spend extensive time in chauffeured comfort"
    ]
  },
  {
    "id": "toyota-fortuner",
    "brand": "Toyota",
    "model": "Fortuner",
    "tagline": "The Undisputed King of Full-Size 4x4 SUVs with 500 Nm Diesel Muscle",
    "priceMinLakh": 33.43,
    "priceMaxLakh": 51.44,
    "bodyType": "SUV",
    "fuelTypes": [
      "Diesel",
      "Petrol"
    ],
    "image": toyotaFortunerImg,
    "galleryImages": [
      toyotaFortunerImg
    ],
    "specs": {
      "engineDisplacement": "2.8L 1GD-FTV Turbo Diesel / 2.7L Dual VVTi Petrol",
      "powerPS": 204,
      "torqueNM": 500,
      "transmission": [
        "Manual",
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 14.4,
      "topSpeedKmH": 190,
      "acceleration0to100": 9.8,
      "bootSpaceLitres": 296,
      "groundClearanceMm": 225,
      "seatingCapacity": 7,
      "fuelTankCapacityLitres": 80
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "ASEAN NCAP 5-Star",
      "airbagsCount": 7,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "7 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 8,
      "sunroof": "None",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Rear AC Vents & Armrest",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "8\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 14000,
      "estimatedYearlyInsurance": 75000,
      "warrantyYears": 3,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "4x2 2.7 Petrol MT",
        "priceLakh": 33.43,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "7 Airbags",
          "VSC with Brake Assist",
          "LED Headlamps",
          "Leatherette Seats"
        ]
      },
      {
        "name": "4x4 2.8 Diesel AT",
        "priceLakh": 42.32,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "204PS / 500Nm Diesel",
          "4x4 with High/Low Range",
          "Downhill Assist",
          "JBL 11-Speaker Audio"
        ]
      },
      {
        "name": "Legender 4x4 Diesel AT",
        "priceLakh": 47.64,
        "transmission": "Automatic",
        "fuel": "Diesel",
        "keyFeatures": [
          "Catamaran Front Grille",
          "Sequential LED Indicators",
          "Wireless Charger",
          "Kick-Sensor Power Tailgate"
        ]
      }
    ],
    "pros": [
      "Unmatched political and road commanding presence across Indian highways",
      "Monster 500 Nm torque muscle pulls through any obstacle effortlessly",
      "Rock-solid ladder frame architecture capable of surviving 5,00,000+ km",
      "Practically zero depreciation over 3-5 years in the used car market"
    ],
    "cons": [
      "Bumpy and stiff ride quality over urban potholes compared to monocoque SUVs",
      "Cabin lacks modern panoramic sunroof and Level 2 ADAS given its ₹50L price tag"
    ],
    "bestSuitedFor": [
      "VIPs, politicians, industrialists, and large estate owners desiring commanding dominance",
      "Hardcore off-roaders and cross-country tourers requiring unstoppable durability"
    ]
  },
  {
    "id": "skoda-slavia",
    "brand": "Skoda",
    "model": "Slavia",
    "tagline": "5-Star Euro Safety Premium Sedan with 150 PS 1.5 TSI & 521L Boot",
    "priceMinLakh": 10.69,
    "priceMaxLakh": 18.69,
    "bodyType": "Sedan",
    "fuelTypes": [
      "Petrol"
    ],
    "image": skodaSlaviaImg,
    "galleryImages": [
      skodaSlaviaImg
    ],
    "specs": {
      "engineDisplacement": "1.0L TSI / 1.5L TSI EVO with Active Cylinder Tech",
      "powerPS": 150,
      "torqueNM": 250,
      "transmission": [
        "Manual",
        "Automatic",
        "DSG"
      ],
      "mileageKmPerLitreOrKWh": 19.36,
      "topSpeedKmH": 205,
      "acceleration0to100": 8.8,
      "bootSpaceLitres": 521,
      "groundClearanceMm": 179,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 45
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "Global NCAP",
      "airbagsCount": 6,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10,
      "sunroof": "Single Pane",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 8200,
      "estimatedYearlyInsurance": 33000,
      "warrantyYears": 4,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "Classic 1.0 TSI MT",
        "priceLakh": 10.69,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags Standard",
          "ESC with Multi Collision Brake",
          "All 3-Point Belts",
          "ISOFIX"
        ]
      },
      {
        "name": "Signature 1.0 TSI AT",
        "priceLakh": 15.09,
        "transmission": "Automatic",
        "fuel": "Petrol",
        "keyFeatures": [
          "10\" Touchscreen",
          "Electric Sunroof",
          "Rear Camera",
          "16\" Alloys"
        ]
      },
      {
        "name": "Prestige 1.5 TSI DSG",
        "priceLakh": 18.69,
        "transmission": "DSG",
        "fuel": "Petrol",
        "keyFeatures": [
          "150PS 1.5 TSI Engine",
          "Ventilated Leatherette Seats",
          "Digital Virtual Cockpit",
          "Subwoofer Audio"
        ]
      }
    ],
    "pros": [
      "Flawless 5-Star Global NCAP safety score for both adults and children",
      "Thrilling German dynamics with high-speed cornering stability",
      "Gigantic 521-litre luggage boot",
      "Active Cylinder Technology (ACT) deactivates 2 cylinders on cruise for fuel saving"
    ],
    "cons": [
      "Single-pane sunroof rather than a panoramic setup",
      "DSG transmission demands disciplined fluid servicing"
    ],
    "bestSuitedFor": [
      "Driving purists who love high-speed highway touring and sharp steering feedback",
      "Families seeking an uncompromising 5-star crash-tested luxury sedan"
    ]
  },
  {
    "id": "volkswagen-virtus",
    "brand": "Volkswagen",
    "model": "Virtus",
    "tagline": "German Engineered Performance Sedan with 5-Star Global NCAP & 150 PS TSI",
    "priceMinLakh": 11.56,
    "priceMaxLakh": 19.41,
    "bodyType": "Sedan",
    "fuelTypes": [
      "Petrol"
    ],
    "image": volkswagenVirtusImg,
    "galleryImages": [
      volkswagenVirtusImg
    ],
    "specs": {
      "engineDisplacement": "1.0L TSI / 1.5L TSI EVO 4-Cylinder Turbo",
      "powerPS": 150,
      "torqueNM": 250,
      "transmission": [
        "Manual",
        "Automatic",
        "DSG"
      ],
      "mileageKmPerLitreOrKWh": 19.4,
      "topSpeedKmH": 210,
      "acceleration0to100": 8.8,
      "bootSpaceLitres": 521,
      "groundClearanceMm": 179,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 45
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "Global NCAP",
      "airbagsCount": 6,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 10.1,
      "sunroof": "Single Pane",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Single Pane Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "10.1\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 8500,
      "estimatedYearlyInsurance": 34000,
      "warrantyYears": 4,
      "warrantyKm": 100000
    },
    "variants": [
      {
        "name": "Comfortline 1.0 TSI MT",
        "priceLakh": 11.56,
        "transmission": "Manual",
        "fuel": "Petrol",
        "keyFeatures": [
          "6 Airbags",
          "ESC",
          "Multi-Collision Brakes",
          "LED Headlights"
        ]
      },
      {
        "name": "Highline 1.0 TSI AT",
        "priceLakh": 14.88,
        "transmission": "Automatic",
        "fuel": "Petrol",
        "keyFeatures": [
          "10\" VW Play Screen",
          "Wireless Android Auto/CarPlay",
          "Paddle Shifters",
          "Keyless Entry"
        ]
      },
      {
        "name": "GT Plus 1.5 TSI DSG",
        "priceLakh": 19.41,
        "transmission": "DSG",
        "fuel": "Petrol",
        "keyFeatures": [
          "150PS GT Badge",
          "Red Ambient Lighting",
          "Ventilated Front Seats",
          "8\" Digital Cockpit"
        ]
      }
    ],
    "pros": [
      "Top safety performer in Global NCAP history with highest structural integrity",
      "Sporty GT styling with red brake calipers and blacked-out alloy wheels",
      "Laser-welded MQB-A0-IN German chassis with planted expressway manners",
      "Massive 521L boot and 179mm ground clearance built for Indian roads"
    ],
    "cons": [
      "Rear seat is comfortably shaped for 2 adults rather than 3 across",
      "AC cooling takes a couple of minutes in peak 45°C Indian summer"
    ],
    "bestSuitedFor": [
      "Motorsport and German performance fans desiring rapid throttle response",
      "Highway travelers who want rock-solid composure and timeless European lines"
    ]
  },
  {
    "id": "mg-windsor-ev",
    "brand": "MG",
    "model": "Windsor EV",
    "tagline": "India’s First Crossover EV with 135° Aero Lounge Seats & BaaS Battery Model",
    "priceMinLakh": 9.99,
    "priceMaxLakh": 15.5,
    "bodyType": "Hatchback",
    "fuelTypes": [
      "Electric"
    ],
    "image": mgWindsorEvImg,
    "galleryImages": [
      mgWindsorEvImg
    ],
    "specs": {
      "engineDisplacement": "Permanent Magnet Synchronous Motor (38 kWh)",
      "powerPS": 136,
      "torqueNM": 200,
      "transmission": [
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 332,
      "rangeKm": 332,
      "topSpeedKmH": 150,
      "acceleration0to100": 8.8,
      "bootSpaceLitres": 604,
      "groundClearanceMm": 186,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 0,
      "batteryCapacityKWh": 38
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "Internal Testing",
      "airbagsCount": 6,
      "hasADAS": false,
      "adasLevel": 0,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "6 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 15.6,
      "sunroof": "Panoramic",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "15.6\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 5500,
      "estimatedYearlyInsurance": 28000,
      "warrantyYears": 3,
      "warrantyKm": 100000,
      "batteryWarrantyYears": 8
    },
    "variants": [
      {
        "name": "Excite (BaaS)",
        "priceLakh": 9.99,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "Battery as a Service (₹3.5/km)",
          "6 Airbags",
          "10.1\" Touchscreen",
          "LED Projectors"
        ]
      },
      {
        "name": "Exclusive (BaaS)",
        "priceLakh": 11.49,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "15.6\" Grandview Display",
          "360 HD Camera",
          "Wireless Charger",
          "18\" Alloy Wheels"
        ]
      },
      {
        "name": "Essence (With Battery)",
        "priceLakh": 15.5,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "Complete Vehicle + Battery Included",
          "135° Reclining Aero Lounge Seats",
          "Infinity View Glass Roof",
          "9-Speaker Infinity Audio"
        ]
      }
    ],
    "pros": [
      "135-degree reclining Aero Lounge rear seats offer business-class legroom",
      "Huge 15.6-inch ultra-high-definition touchscreen display",
      "Cavernous 604-litre expandable boot space",
      "Innovative BaaS (Battery-as-a-Service) lowers upfront acquisition price under ₹10L"
    ],
    "cons": [
      "Fixed glass roof does not physically open like an electric sliding sunroof",
      "Most cabin controls (including AC and headlights) are mapped inside touchscreen menus"
    ],
    "bestSuitedFor": [
      "Chauffeur-driven city owners who want unmatched rear lounge relaxation",
      "Families seeking an ultra-spacious EV with huge boot storage at a sensible budget"
    ]
  },
  {
    "id": "byd-atto-3",
    "brand": "BYD",
    "model": "Atto 3",
    "tagline": "Ultra-Safe Blade Battery Electric SUV with 521 km Range & 204 PS Response",
    "priceMinLakh": 24.99,
    "priceMaxLakh": 33.99,
    "bodyType": "SUV",
    "fuelTypes": [
      "Electric"
    ],
    "image": bydAtto3Img,
    "galleryImages": [
      bydAtto3Img
    ],
    "specs": {
      "engineDisplacement": "Permanent Magnet Synchronous Motor (60.48 kWh)",
      "powerPS": 204,
      "torqueNM": 310,
      "transmission": [
        "Automatic"
      ],
      "mileageKmPerLitreOrKWh": 521,
      "rangeKm": 521,
      "topSpeedKmH": 160,
      "acceleration0to100": 7.3,
      "bootSpaceLitres": 440,
      "groundClearanceMm": 175,
      "seatingCapacity": 5,
      "fuelTankCapacityLitres": 0,
      "batteryCapacityKWh": 60.48
    },
    "safety": {
      "ratingStars": 5,
      "testingAgency": "Euro NCAP 5-Star",
      "airbagsCount": 7,
      "hasADAS": true,
      "adasLevel": 2,
      "hasESP": true,
      "has360Camera": true,
      "hasIsofix": true,
      "keySafetyFeatures": [
        "Level 2 ADAS Suite (AEB, Lane Keep, ACC)",
        "7 Airbags Standard",
        "Electronic Stability Program (ESP)",
        "Hill Hold Assist",
        "ISOFIX Child Seat Anchors",
        "Tyre Pressure Monitoring System (TPMS)",
        "ABS with EBD"
      ]
    },
    "features": {
      "infotainmentScreenInch": 12.8,
      "sunroof": "Panoramic",
      "ventilatedSeats": true,
      "wirelessCharging": true,
      "connectedCarTech": true,
      "comfort": [
        "Front Ventilated Seats",
        "Panoramic Sunroof",
        "Push Button Start/Stop with Smart Key",
        "Cooled Glovebox & Cruise Control",
        "Height Adjustable Driver Seat"
      ],
      "technology": [
        "12.8\" HD Touchscreen Infotainment",
        "Wireless Apple CarPlay & Android Auto",
        "Wireless Smartphone Charger",
        "Connected Car Suite with OTA Updates",
        "Digital Driver Instrument Cluster"
      ]
    },
    "ownership": {
      "avgAnnualMaintenance": 7000,
      "estimatedYearlyInsurance": 46000,
      "warrantyYears": 6,
      "warrantyKm": 150000,
      "batteryWarrantyYears": 8
    },
    "variants": [
      {
        "name": "Dynamic (49.92 kWh)",
        "priceLakh": 24.99,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "468km Range",
          "Blade Battery",
          "Panoramic Sunroof",
          "12.8\" Rotating Screen"
        ]
      },
      {
        "name": "Premium (60.48 kWh)",
        "priceLakh": 29.85,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "521km Range",
          "Level 2 ADAS",
          "Power Tailgate",
          "Ambient Lights"
        ]
      },
      {
        "name": "Superior (60.48 kWh)",
        "priceLakh": 33.99,
        "transmission": "Automatic",
        "fuel": "Electric",
        "keyFeatures": [
          "521km Range",
          "Full ADAS Suite",
          "V2L Adapter",
          "8-Speaker Dirac Audio"
        ]
      }
    ],
    "pros": [
      "World-renowned Blade Battery safety and thermal stability",
      "Brisk 0-100 in 7.3s with 204PS instant electric response",
      "Futuristic cabin with unique rotating central display and guitar-string door trims",
      "Generous 521 km ARAI certified range"
    ],
    "cons": [
      "Futuristic gym-inspired interior aesthetics may not appeal to traditionalists",
      "Premium pricing above ₹25 Lakhs"
    ],
    "bestSuitedFor": [
      "EV pioneers looking for cutting-edge battery technology",
      "High-mileage highway drivers wanting 400+ km real world range",
      "Tech early adopters"
    ]
  }
];

// Full Indian-market lineup (generated by scripts/build-car-lineup.mjs)
export const CARS_DATASET: Car[] = [...BASE_CARS, ...FULL_LINEUP];
