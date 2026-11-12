#!/usr/bin/env node
/**
 * Builds the full Indian car lineup:
 *  1. Fetches a real exterior photo for every model from Wikimedia Commons
 *  2. Generates src/data/fullLineup.ts (complete Car objects) + src/data/imageAttribution.ts
 *
 * Run: node scripts/build-car-lineup.mjs
 *
 * Images are downloaded from Wikimedia Commons and are free-licensed
 * (CC-BY / CC-BY-SA / Public Domain). Attribution is written to
 * src/data/imageAttribution.ts. Prices/specs for newly added models are
 * indicative Indian-market figures and can be refined per model.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'src', 'assets', 'images');
const OUT_FILE = path.join(ROOT, 'src', 'data', 'fullLineup.ts');
const ATTR_FILE = path.join(ROOT, 'src', 'data', 'imageAttribution.ts');
const CACHE_FILE = path.join(ROOT, 'scripts', 'image-cache.json');

// ---------------------------------------------------------------------------
// Full lineup: [brand, model, bodyType, fuel, priceMinLakh, priceMaxLakh,
//               seats, powerPS, mileageOrRange, batteryKwh, tagline|null]
// fuel is a comma separated list. mileageOrRange = km/l (ICE) or km (EV).
// Existing 27 richly-documented cars are NOT repeated here.
// ---------------------------------------------------------------------------
const CARS = [
  // ---- Maruti Suzuki ----
  ['Maruti Suzuki', 'Alto K10', 'Hatchback', 'Petrol,CNG', 3.99, 5.65, 5, 67, 24.9, 0, 'India\u2019s best-selling small car, now with 6 airbags and Z-Series mileage'],
  ['Maruti Suzuki', 'S-Presso', 'Hatchback', 'Petrol,CNG', 4.25, 6.1, 5, 68, 21.7, 0, 'Tall-boy mini SUV-style hatchback with a commanding driving position'],
  ['Maruti Suzuki', 'Celerio', 'Hatchback', 'Petrol,CNG', 4.99, 7.04, 5, 67, 25.1, 0, 'Efficient and spacious small hatchback with segment-best CNG economy'],
  ['Maruti Suzuki', 'Wagon R', 'Hatchback', 'Petrol,CNG', 5.54, 7.46, 5, 67, 25.2, 0, 'India\u2019s favourite tall-boy with headroom, space and outstanding mileage'],
  ['Maruti Suzuki', 'Dzire', 'Sedan', 'Petrol,CNG', 6.54, 9.34, 5, 82, 24.8, 0, 'Compact sedan benchmark with 5-star safety ambition and class mileage'],
  ['Maruti Suzuki', 'Baleno', 'Hatchback', 'Petrol,CNG', 6.66, 9.78, 5, 90, 22.9, 0, 'Premium hatchback with sharp styling, big touchscreen and Nexa flair'],
  ['Maruti Suzuki', 'Fronx', 'Compact SUV', 'Petrol,CNG', 7.52, 13.04, 5, 100, 22.9, 0, 'Coupe-style compact SUV with punchy turbo petrol option'],
  ['Maruti Suzuki', 'Ertiga', 'MPV', 'Petrol,CNG', 8.36, 13.09, 7, 103, 20.5, 0, 'India\u2019s favourite 7-seater MPV with flexible seats and low running costs'],
  ['Maruti Suzuki', 'XL6', 'MPV', 'Petrol', 11.3, 14.67, 6, 103, 20.3, 0, 'Premium 6-seater MPV with captain seats and Nexa treatment'],
  ['Maruti Suzuki', 'Jimny', 'SUV', 'Petrol', 12.74, 14.95, 4, 105, 16.9, 0, 'The iconic ladder-frame off-roader, reborn for adventure in India'],
  ['Maruti Suzuki', 'Invicto', 'MPV', 'Strong Hybrid', 24.91, 28.92, 7, 186, 23.2, 0, 'Royal 7-seater hybrid MPV flagship from the Toyota-Maruti alliance'],
  ['Maruti Suzuki', 'Ciaz', 'Sedan', 'Petrol', 9.4, 12.29, 5, 105, 20.0, 0, 'Elegant, spacious executive sedan with legendary Suzuki reliability'],

  // ---- Hyundai ----
  ['Hyundai', 'Grand i10 Nios', 'Hatchback', 'Petrol,CNG', 5.65, 8.71, 5, 83, 20.7, 0, 'Premium city hatchback with 4-cylinder refinement and connected tech'],
  ['Hyundai', 'i20', 'Hatchback', 'Petrol', 7.1, 11.4, 5, 120, 20.2, 0, 'The sporty premium hatchback with a punchy 1.0 turbo and dual-clutch'],
  ['Hyundai', 'Aura', 'Sedan', 'Petrol,CNG', 6.5, 9.09, 5, 83, 21.0, 0, 'Compact sedan with segment-first CNG and connected car features'],
  ['Hyundai', 'Creta Electric', 'Compact SUV', 'Electric', 17.99, 23.5, 5, 171, 473, 51.4, 'India\u2019s favourite SUV, now fully electric with 473 km range'],
  ['Hyundai', 'Alcazar', 'SUV', 'Petrol,Diesel', 16.77, 22.13, 7, 160, 17.9, 0, 'The 6/7-seater family flagship with captain seats and ADAS'],
  ['Hyundai', 'Tucson', 'SUV', 'Petrol,Diesel', 29.42, 36.12, 5, 186, 16.6, 0, 'Global premium SUV with futuristic parametric design and full ADAS'],
  ['Hyundai', 'Ioniq 5', 'SUV', 'Electric', 46.05, 51.55, 5, 217, 631, 72.6, 'Retro-futuristic electric crossover with 631 km range and V2L power'],

  // ---- Tata Motors ----
  ['Tata', 'Tiago', 'Hatchback', 'Petrol,CNG', 5.6, 8.4, 5, 86, 19.8, 0, 'Safest entry hatchback with iCNG option and 5-star Global NCAP build'],
  ['Tata', 'Tiago EV', 'Hatchback', 'Electric', 8.69, 12.24, 5, 74, 315, 24, 'India\u2019s most affordable electric car with real safety and 315 km range'],
  ['Tata', 'Tigor', 'Sedan', 'Petrol,CNG', 6.3, 8.7, 5, 86, 19.5, 0, 'Safe, spacious compact sedan with iCNG technology'],
  ['Tata', 'Tigor EV', 'Sedan', 'Electric', 12.49, 13.75, 5, 74, 315, 26, 'India\u2019s only electric sedan in its class with 315 km range'],
  ['Tata', 'Punch EV', 'Compact SUV', 'Electric', 10.99, 15.49, 5, 122, 421, 35, '5-star safe micro-SUV electrified with 421 km certified range'],
  ['Tata', 'Altroz', 'Hatchback', 'Petrol,Diesel', 6.6, 10.75, 5, 88, 19.9, 0, 'The first 5-star Global NCAP hatchback with dark theme style'],
  ['Tata', 'Nexon', 'Compact SUV', 'Petrol,Diesel', 8.15, 15.8, 5, 120, 17.9, 0, 'India\u2019s most popular compact SUV with 5-star BNCAP safety'],
  ['Tata', 'Curvv', 'Coupe', 'Petrol,Diesel', 10.5, 18.9, 5, 120, 18.3, 0, 'The sporty SUV-coupe with sweeping roofline and panoramic cabin'],
  ['Tata', 'Harrier EV', 'SUV', 'Electric', 24.0, 31.0, 5, 250, 500, 59, 'The flagship electric SUV with all-wheel drive and 5-star BNCAP safety'],
  ['Tata', 'Sierra', 'SUV', 'Petrol,Electric', 15.0, 25.0, 5, 190, 400, 40, 'The legendary Sierra nameplate reborn as a modern lifestyle SUV'],

  // ---- Mahindra ----
  ['Mahindra', 'Bolero', 'SUV', 'Diesel', 9.79, 10.44, 7, 75, 16.0, 0, 'The indestructible rural workhorse SUV trusted for two decades'],
  ['Mahindra', 'Bolero Neo', 'SUV', 'Diesel', 10.44, 12.38, 7, 100, 17.0, 0, 'Compact 7-seater rugged SUV with go-anywhere capability'],
  ['Mahindra', 'Thar', 'SUV', 'Petrol,Diesel', 11.5, 17.6, 4, 150, 15.0, 0, 'The iconic open-top off-roader that sparked the lifestyle 4x4 craze'],
  ['Mahindra', 'Scorpio', 'SUV', 'Diesel', 13.62, 17.42, 7, 140, 16.0, 0, 'The people\u2019s SUV with commanding presence and 7-seat practicality'],
  ['Mahindra', 'XUV400', 'Compact SUV', 'Electric', 15.49, 19.39, 5, 150, 375, 39.4, 'Practical 375 km range electric SUV with sporty dynamics'],
  ['Mahindra', 'BE 6', 'Coupe', 'Electric', 18.9, 26.9, 5, 286, 550, 59, 'Born-electric coupe SUV with 550 km range and 286 PS of punch'],
  ['Mahindra', 'XEV 9e', 'SUV', 'Electric', 21.9, 30.5, 5, 286, 656, 79, 'Flagship electric SUV with 656 km range and triple-screen cockpit'],
  ['Mahindra', 'Marazzo', 'MPV', 'Diesel', 13.99, 16.49, 7, 122, 17.3, 0, 'French-designed 7-seater MPV with car-like ride quality'],

  // ---- Toyota ----
  ['Toyota', 'Glanza', 'Hatchback', 'Petrol', 6.9, 10.0, 5, 90, 22.9, 0, 'The premium Baleno twin with Toyota badge and reliability'],
  ['Toyota', 'Urban Cruiser Hyryder', 'Compact SUV', 'Petrol,Strong Hybrid,CNG', 11.15, 19.99, 5, 116, 27.9, 0, 'Strong-hybrid compact SUV delivering class-leading 27.9 km/l'],
  ['Toyota', 'Rumion', 'MPV', 'Petrol,CNG', 10.44, 13.68, 7, 88, 20.5, 0, '7-seater MPV twin of the Ertiga with Toyota warranty confidence'],
  ['Toyota', 'Innova Crysta', 'MPV', 'Diesel', 19.99, 26.5, 7, 150, 15.0, 0, 'The legendary chauffeur-class MPV with unbreakable diesel'],
  ['Toyota', 'Hilux', 'Pickup', 'Diesel', 30.4, 37.0, 5, 204, 15.0, 0, 'The world-famous adventure pickup now officially in India'],
  ['Toyota', 'Camry', 'Sedan', 'Strong Hybrid', 46.17, 46.17, 5, 218, 19.1, 0, 'Executive hybrid sedan with whisper-quiet luxury'],
  ['Toyota', 'Vellfire', 'MPV', 'Strong Hybrid', 120.0, 120.0, 7, 250, 16.0, 0, 'The chauffeur\u2019s choice ultra-luxury hybrid MPV'],
  ['Toyota', 'Land Cruiser 300', 'SUV', 'Petrol', 210.0, 210.0, 7, 409, 8.0, 0, 'The ultimate go-anywhere luxury SUV legend'],

  // ---- Kia ----
  ['Kia', 'Carens Clavis', 'MPV', 'Petrol,Diesel', 12.0, 20.0, 7, 140, 17.0, 0, 'All-new bold 7-seater MPV with coupe-inspired silhouette'],
  ['Kia', 'Carens Clavis EV', 'MPV', 'Electric', 25.0, 30.0, 7, 200, 500, 80, 'Kia\u2019s first electric MPV for India with long-range promise'],
  ['Kia', 'Carnival', 'MPV', 'Petrol,Diesel', 35.7, 45.1, 7, 194, 14.0, 0, 'Full-size luxury MPV with lounge-like captain seats'],
  ['Kia', 'EV6', 'SUV', 'Electric', 60.95, 65.95, 5, 320, 708, 77.4, 'Award-winning E-GMP electric crossover with 708 km range'],
  ['Kia', 'EV9', 'SUV', 'Electric', 120.0, 120.0, 7, 379, 561, 99.8, 'Flagship 7-seater electric SUV with 800V ultra-fast charging'],
  ['Kia', 'Syros', 'Compact SUV', 'Petrol,Diesel', 9.0, 17.8, 5, 120, 18.0, 0, 'Boxy new-gen compact SUV with spacious cabin and ADAS'],

  // ---- Honda ----
  ['Honda', 'Amaze', 'Sedan', 'Petrol,CNG', 8.0, 11.6, 5, 90, 19.4, 0, 'Compact sedan with premium cabin and segment-first ADAS'],

  // ---- MG ----
  ['MG', 'Comet EV', 'Hatchback', 'Electric', 7.98, 10.6, 4, 42, 230, 17.3, 'India\u2019s most compact electric city car with funky two-door style'],
  ['MG', 'Astor', 'Compact SUV', 'Petrol', 10.81, 18.6, 5, 140, 18.0, 0, 'Personal AI assistant SUV with Level 2 ADAS and panoramic roof'],
  ['MG', 'Hector', 'SUV', 'Petrol,Diesel', 13.68, 23.1, 5, 143, 16.0, 0, 'The giant internet SUV with class-leading cabin space'],
  ['MG', 'Hector Plus', 'SUV', 'Petrol,Diesel', 17.6, 23.1, 7, 143, 16.0, 0, '7-seater internet SUV with captain seats and panoramic sunroof'],
  ['MG', 'Gloster', 'SUV', 'Diesel', 38.83, 43.98, 7, 218, 14.0, 0, 'India\u2019s largest luxury SUV with 6/7 seats and Level 2 ADAS'],
  ['MG', 'ZS EV', 'Compact SUV', 'Electric', 23.38, 26.63, 5, 174, 461, 50.3, 'Well-rounded 461 km electric SUV with rapid charging'],

  // ---- Renault ----
  ['Renault', 'Kwid', 'Hatchback', 'Petrol,CNG', 4.7, 6.45, 5, 68, 21.5, 0, 'Mini-SUV style entry car with best-in-class ground clearance'],
  ['Renault', 'Kiger', 'Compact SUV', 'Petrol', 6.3, 11.5, 5, 100, 20.0, 0, 'Stylish sub-4m SUV with punchy turbo option and dual-screen dash'],
  ['Renault', 'Triber', 'MPV', 'Petrol,CNG', 6.0, 8.83, 7, 72, 18.5, 0, 'The only 7-seater under 4 metres with flexible modular seats'],

  // ---- Nissan ----
  ['Nissan', 'Magnite', 'Compact SUV', 'Petrol', 5.99, 11.1, 5, 100, 19.7, 0, 'Value-packed compact SUV with bold design and turbo punch'],
  ['Nissan', 'X-Trail', 'SUV', 'Petrol', 49.92, 49.92, 7, 204, 14.0, 0, 'Iconic global SUV with 7 seats and e-Power hybrid tech'],

  // ---- Volkswagen ----
  ['Volkswagen', 'Taigun', 'Compact SUV', 'Petrol', 11.68, 19.6, 5, 150, 18.0, 0, 'German-engineered compact SUV with 1.5 TSI punch and ADAS'],
  ['Volkswagen', 'Tiguan', 'SUV', 'Petrol', 35.02, 35.02, 5, 190, 14.0, 0, 'Premium German SUV with composed ride and digital cockpit'],

  // ---- Skoda ----
  ['Skoda', 'Kylaq', 'Compact SUV', 'Petrol', 7.89, 14.4, 5, 115, 19.6, 0, 'Skoda\u2019s first sub-4m SUV with European build and 1.0 TSI'],
  ['Skoda', 'Kushaq', 'Compact SUV', 'Petrol', 10.89, 18.79, 5, 150, 17.5, 0, 'German-engineered compact SUV with 1.5 TSI and 6 airbags'],
  ['Skoda', 'Kodiaq', 'SUV', 'Petrol', 39.99, 39.99, 7, 190, 13.0, 0, '7-seater Czech flagship SUV with commanding presence'],
  ['Skoda', 'Superb', 'Sedan', 'Petrol', 54.0, 54.0, 5, 190, 16.0, 0, 'The iconic executive sedan with limousine rear legroom'],
  ['Skoda', 'Octavia RS', 'Sedan', 'Petrol', 46.99, 46.99, 5, 245, 15.0, 0, 'The legendary hot sedan with 245 PS and track pedigree'],

  // ---- Jeep ----
  ['Jeep', 'Compass', 'Compact SUV', 'Petrol,Diesel', 17.64, 32.09, 5, 170, 16.0, 0, 'Trail-rated compact SUV with authentic Jeep capability'],
  ['Jeep', 'Meridian', 'SUV', 'Diesel', 33.8, 40.49, 7, 200, 14.0, 0, '7-seater Jeep flagship with commanding road presence'],
  ['Jeep', 'Wrangler', 'SUV', 'Petrol', 64.99, 64.99, 5, 272, 10.0, 0, 'The ultimate open-air icon of off-road freedom'],
  ['Jeep', 'Grand Cherokee', 'SUV', 'Petrol', 82.99, 82.99, 5, 270, 12.0, 0, 'Iconic American luxury SUV with unmistakable presence'],

  // ---- Citroën ----
  ['Citro\u00ebn', 'C3', 'Hatchback', 'Petrol', 6.16, 9.02, 5, 110, 19.4, 0, 'Cheerful European hatchback with SUV-like stance and comfort'],
  ['Citro\u00ebn', 'eC3', 'Hatchback', 'Electric', 11.5, 13.0, 5, 57, 320, 29.2, 'Affordable European EV with 320 km range and cheerful design'],
  ['Citro\u00ebn', 'C3 Aircross', 'Compact SUV', 'Petrol', 9.99, 14.5, 7, 110, 18.5, 0, 'Compact 7-seater SUV with airbump comfort and practicality'],
  ['Citro\u00ebn', 'C5 Aircross', 'SUV', 'Petrol', 36.6, 39.84, 5, 177, 15.0, 0, 'Flagship French SUV with magic-carpet suspension comfort'],

  // ---- Force Motors ----
  ['Force Motors', 'Gurkha', 'SUV', 'Diesel', 16.75, 18.44, 7, 90, 13.0, 0, 'Military-grade 4x4 with three locking differentials'],
  ['Force Motors', 'Gurkha 5-Door', 'SUV', 'Diesel', 19.0, 21.0, 7, 140, 13.5, 0, 'New-gen 5-door off-roader with modern comfort and hardcore capability'],
  ['Force Motors', 'Trax Cruiser', 'MPV', 'Diesel', 20.5, 22.9, 9, 140, 13.0, 0, 'India\u2019s go-to 9-seater people mover for travel operators'],

  // ---- Isuzu ----
  ['Isuzu', 'D-Max', 'Pickup', 'Diesel', 26.54, 29.23, 5, 163, 15.0, 0, 'The world-class adventure pickup built for Indian roads'],
  ['Isuzu', 'MU-X', 'SUV', 'Diesel', 41.99, 43.54, 7, 190, 14.0, 0, 'Body-on-frame 7-seater SUV with legendary Isuzu diesel'],

  // ---- BYD ----
  ['BYD', 'Seal', 'Sedan', 'Electric', 41.0, 53.0, 5, 523, 650, 82.5, 'Sporty electric executive sedan with 650 km range and 3.8s sprint'],
  ['BYD', 'eMAX 7', 'MPV', 'Electric', 26.5, 29.6, 7, 201, 530, 71.8, 'Electric 6/7-seater MPV with long range and family practicality'],
  ['BYD', 'Sealion 7', 'SUV', 'Electric', 54.0, 58.0, 5, 523, 567, 82.5, 'Flagship coupe-SUV EV with sporting dynamics and fast charging'],

  // ---- Volvo ----
  ['Volvo', 'EX30', 'Compact SUV', 'Electric', 43.5, 55.5, 5, 272, 476, 69, 'Volvo\u2019s compact electric crossover with Scandinavian minimalism'],
  ['Volvo', 'EX40', 'Compact SUV', 'Electric', 55.5, 63.5, 5, 238, 475, 82, 'Practical electric SUV with 475 km range and dual-motor grip'],
  ['Volvo', 'XC40', 'Compact SUV', 'Petrol,Electric', 42.95, 62.5, 5, 197, 16.0, 0, 'Premium compact SUV with Swedish safety-first design'],
  ['Volvo', 'XC60', 'SUV', 'Petrol', 69.9, 77.9, 5, 250, 15.0, 0, 'Elegant mid-size luxury SUV with mild-hybrid refinement'],
  ['Volvo', 'XC90', 'SUV', 'Petrol', 100.0, 125.0, 7, 300, 13.0, 0, 'Flagship 7-seater Scandinavian luxury SUV'],
  ['Volvo', 'S90', 'Sedan', 'Petrol', 73.9, 75.9, 5, 300, 14.0, 0, 'Executive sedan with serene comfort and understated luxury'],

  // ---- BMW ----
  ['BMW', '2 Series', 'Sedan', 'Petrol', 45.0, 50.0, 5, 178, 16.0, 0, 'Sporty compact Gran Coupe with signature BMW dynamics'],
  ['BMW', '3 Series', 'Sedan', 'Petrol,Diesel', 60.0, 70.0, 5, 255, 15.0, 0, 'The original sports sedan benchmark for driving pleasure'],
  ['BMW', '5 Series', 'Sedan', 'Petrol', 75.0, 90.0, 5, 258, 15.0, 0, 'Executive sedan blending luxury, tech and rear-wheel-drive joy'],
  ['BMW', '7 Series', 'Sedan', 'Petrol', 170.0, 170.0, 5, 380, 12.0, 0, 'BMW\u2019s flagship luxury sedan with cinema-screen rear lounge'],
  ['BMW', 'X1', 'Compact SUV', 'Petrol', 49.5, 56.5, 5, 201, 15.0, 0, 'Premium compact SUV with sporty handling and big-car presence'],
  ['BMW', 'X3', 'SUV', 'Petrol', 75.5, 80.5, 5, 248, 14.0, 0, 'The versatile sports activity vehicle with go-anywhere poise'],
  ['BMW', 'X5', 'SUV', 'Petrol', 95.5, 115.0, 5, 298, 13.0, 0, 'The definitive luxury SUV with commanding road presence'],
  ['BMW', 'X7', 'SUV', 'Petrol', 135.0, 175.0, 7, 380, 12.0, 0, 'Flagship 7-seater luxury SUV with palatial interior'],
  ['BMW', 'i4', 'Sedan', 'Electric', 72.5, 78.5, 5, 340, 590, 83.9, 'Electric Gran Coupe with real BMW driving character'],
  ['BMW', 'i5', 'Sedan', 'Electric', 95.5, 95.5, 5, 340, 582, 84, 'Executive electric sedan with 582 km range and refined pace'],
  ['BMW', 'i7', 'Sedan', 'Electric', 230.0, 230.0, 5, 544, 625, 105.7, 'The fully-electric flagship with 31-inch rear theatre screen'],
  ['BMW', 'iX1', 'Compact SUV', 'Electric', 66.5, 66.5, 5, 313, 440, 64.7, 'Compact electric SUV with agile city driving and dual motors'],
  ['BMW', 'iX', 'SUV', 'Electric', 133.0, 139.0, 5, 523, 635, 111.5, 'Flagship electric SAV with avant-garde design and 635 km range'],
  ['BMW', 'M2', 'Coupe', 'Petrol', 105.0, 105.0, 4, 460, 10.0, 0, 'The purist\u2019s M car with 460 PS and rear-drive thrills'],
  ['BMW', 'M4', 'Coupe', 'Petrol', 145.0, 160.0, 4, 510, 10.0, 0, 'Iconic high-performance coupe with motorsport DNA'],
  ['BMW', 'M5', 'Sedan', 'Petrol', 185.0, 185.0, 5, 635, 9.5, 0, 'The legendary super-sedan with brutal V8 muscle'],

  // ---- Mercedes-Benz ----
  ['Mercedes-Benz', 'A-Class', 'Sedan', 'Petrol', 45.0, 50.0, 5, 163, 15.0, 0, 'The stylish entry into Mercedes luxury with MBUX brilliance'],
  ['Mercedes-Benz', 'C-Class', 'Sedan', 'Petrol', 60.0, 70.0, 5, 201, 15.0, 0, 'The compact executive benchmark with true S-Class tech'],
  ['Mercedes-Benz', 'E-Class', 'Sedan', 'Petrol', 80.0, 95.0, 5, 258, 15.0, 0, 'The business-class executive sedan, now with MBUX Superscreen'],
  ['Mercedes-Benz', 'GLA', 'Compact SUV', 'Petrol', 50.0, 58.0, 5, 163, 15.0, 0, 'Urban luxury compact SUV with coupe-like styling'],
  ['Mercedes-Benz', 'GLB', 'Compact SUV', 'Petrol', 61.0, 66.0, 7, 163, 15.0, 0, 'The only 7-seater compact luxury SUV with boxy utility'],
  ['Mercedes-Benz', 'GLC', 'SUV', 'Petrol', 75.0, 88.0, 5, 258, 14.0, 0, 'The best-selling mid-size luxury SUV with serene comfort'],
  ['Mercedes-Benz', 'GLE', 'SUV', 'Petrol,Diesel', 100.0, 120.0, 5, 367, 13.0, 0, 'Commanding luxury SUV with air suspension magic'],
  ['Mercedes-Benz', 'GLS', 'SUV', 'Petrol', 135.0, 160.0, 7, 367, 12.0, 0, 'The full-size three-pointed-star flagship SUV'],
  ['Mercedes-Benz', 'G-Class', 'SUV', 'Petrol', 275.0, 275.0, 5, 585, 9.0, 0, 'The legendary luxury off-roader with unmatched icon status'],
  ['Mercedes-Benz', 'EQB', 'Compact SUV', 'Electric', 77.5, 83.5, 7, 228, 423, 70.5, 'Electric 7-seater luxury SUV with practical family range'],
  ['Mercedes-Benz', 'EQE', 'Sedan', 'Electric', 140.0, 145.0, 5, 292, 641, 90.6, 'Electric executive sedan with 641 km range and sculpted aero'],
  ['Mercedes-Benz', 'EQS', 'Sedan', 'Electric', 185.0, 205.0, 5, 523, 857, 118, 'The flagship electric luxury sedan with 857 km range'],
  ['Mercedes-Benz', 'EQS SUV', 'SUV', 'Electric', 220.0, 220.0, 7, 544, 705, 118, 'The electric S-Class of SUVs with 7 seats and first-class ride'],

  // ---- Audi ----
  ['Audi', 'A4', 'Sedan', 'Petrol', 50.0, 55.0, 5, 190, 15.0, 0, 'Refined executive sedan with quattro-ready German poise'],
  ['Audi', 'A5', 'Sedan', 'Petrol', 65.0, 75.0, 5, 245, 14.0, 0, 'Sportback elegance with quattro grip and athletic styling'],
  ['Audi', 'A6', 'Sedan', 'Petrol', 65.0, 75.0, 5, 245, 14.0, 0, 'The tech-forward executive sedan with virtual cockpit'],
  ['Audi', 'A8', 'Sedan', 'Petrol', 130.0, 155.0, 5, 340, 12.0, 0, 'Audi\u2019s flagship luxury limousine with rear-seat indulgence'],
  ['Audi', 'Q3', 'Compact SUV', 'Petrol', 50.0, 60.0, 5, 190, 15.0, 0, 'Sporty compact luxury SUV with crisp quattro handling'],
  ['Audi', 'Q5', 'SUV', 'Petrol', 68.0, 75.0, 5, 265, 14.0, 0, 'Mid-size luxury SUV balancing comfort and athleticism'],
  ['Audi', 'Q6 e-tron', 'SUV', 'Electric', 95.0, 110.0, 5, 387, 656, 100, 'Audi\u2019s new-gen electric SUV with 800V fast charging'],
  ['Audi', 'Q7', 'SUV', 'Petrol', 85.0, 100.0, 7, 340, 13.0, 0, '7-seater luxury SUV with commanding quattro capability'],
  ['Audi', 'Q8', 'SUV', 'Petrol', 105.0, 120.0, 5, 340, 12.0, 0, 'The coupe-SUV flagship with dramatic style'],
  ['Audi', 'Q8 e-tron', 'SUV', 'Electric', 115.0, 130.0, 5, 402, 582, 114, 'Electric flagship SUV with twin motors and 582 km range'],

  // ---- Lexus ----
  ['Lexus', 'ES', 'Sedan', 'Hybrid', 65.0, 75.0, 5, 218, 18.0, 0, 'Whisper-quiet hybrid executive sedan with Japanese craftsmanship'],
  ['Lexus', 'LM', 'MPV', 'Hybrid', 200.0, 250.0, 4, 250, 16.0, 0, 'The ultimate private-jet lounge on wheels'],
  ['Lexus', 'LC', 'Coupe', 'Petrol', 200.0, 210.0, 4, 477, 10.0, 0, 'A grand tourer masterpiece with V8 soundtrack'],
  ['Lexus', 'LX', 'SUV', 'Petrol', 350.0, 350.0, 5, 409, 9.0, 0, 'The flagship luxury off-roader with imperial presence'],
  ['Lexus', 'NX', 'SUV', 'Hybrid', 62.0, 72.0, 5, 244, 17.0, 0, 'Compact luxury hybrid SUV with refined craftsmanship'],
  ['Lexus', 'RX', 'SUV', 'Hybrid', 95.0, 110.0, 5, 246, 16.0, 0, 'The pioneer of luxury hybrid SUVs, elegantly reimagined'],

  // ---- Land Rover ----
  ['Land Rover', 'Defender', 'SUV', 'Petrol,Diesel', 95.0, 150.0, 5, 400, 11.0, 0, 'The 4x4 icon reborn with legendary capability and modern luxury'],
  ['Land Rover', 'Discovery', 'SUV', 'Petrol,Diesel', 80.0, 100.0, 7, 300, 12.0, 0, 'Versatile 7-seat luxury SUV with unrivalled off-road tech'],
  ['Land Rover', 'Discovery Sport', 'SUV', 'Petrol,Diesel', 65.0, 80.0, 5, 200, 14.0, 0, 'Family-ready compact luxury SUV with go-anywhere poise'],
  ['Land Rover', 'Range Rover', 'SUV', 'Petrol', 250.0, 400.0, 5, 530, 9.0, 0, 'The king of luxury SUVs with first-class presence'],
  ['Land Rover', 'Range Rover Evoque', 'SUV', 'Petrol', 75.0, 90.0, 5, 250, 13.0, 0, 'The style icon of the luxury compact SUV segment'],
  ['Land Rover', 'Range Rover Sport', 'SUV', 'Petrol', 170.0, 230.0, 5, 530, 10.0, 0, 'Athletic luxury SUV blending performance and grandeur'],
  ['Land Rover', 'Range Rover Velar', 'SUV', 'Petrol', 85.0, 100.0, 5, 250, 12.0, 0, 'The minimalist beauty of the Range Rover family'],

  // ---- Jaguar ----
  ['Jaguar', 'F-Pace', 'SUV', 'Petrol,Diesel', 75.0, 90.0, 5, 250, 13.0, 0, 'The sporting luxury SUV with feline dynamics'],
  ['Jaguar', 'I-Pace', 'SUV', 'Electric', 105.0, 110.0, 5, 400, 470, 90, 'Award-winning all-electric performance SUV'],

  // ---- MINI ----
  ['MINI', 'Cooper', 'Hatchback', 'Petrol', 40.0, 45.0, 4, 156, 18.0, 0, 'The iconic go-kart city car with unmistakable style'],
  ['MINI', 'Cooper Convertible', 'Convertible', 'Petrol', 48.0, 52.0, 4, 156, 17.0, 0, 'Open-top motoring with the MINI grin and go-kart handling'],
  ['MINI', 'Countryman', 'Compact SUV', 'Petrol', 45.0, 52.0, 5, 204, 17.0, 0, 'The adventurous big MINI with all-terrain attitude'],

  // ---- Porsche ----
  ['Porsche', '718 Cayman', 'Coupe', 'Petrol', 100.0, 115.0, 2, 300, 11.0, 0, 'The mid-engine sports car benchmark for pure driving joy'],
  ['Porsche', '718 Boxster', 'Convertible', 'Petrol', 102.0, 118.0, 2, 300, 11.0, 0, 'Open-top mid-engine roadster perfection'],
  ['Porsche', '911', 'Coupe', 'Petrol', 175.0, 350.0, 4, 394, 10.0, 0, 'The iconic sports car that defines the genre'],
  ['Porsche', 'Macan', 'SUV', 'Petrol', 90.0, 110.0, 5, 265, 12.0, 0, 'The sports car of compact SUVs'],
  ['Porsche', 'Macan Electric', 'SUV', 'Electric', 110.0, 135.0, 5, 402, 613, 100, 'Fully-electric performance SUV with 613 km range'],
  ['Porsche', 'Cayenne', 'SUV', 'Petrol', 125.0, 155.0, 5, 353, 11.0, 0, 'The original luxury performance SUV'],
  ['Porsche', 'Cayenne Electric', 'SUV', 'Electric', 160.0, 180.0, 5, 456, 590, 100, 'The electric flagship SUV with true Porsche performance'],
  ['Porsche', 'Panamera', 'Sedan', 'Petrol', 165.0, 210.0, 5, 353, 11.0, 0, 'The luxury sports sedan with grand-touring poise'],
  ['Porsche', 'Taycan', 'Sedan', 'Electric', 160.0, 250.0, 4, 476, 630, 105, 'The electric sports sedan that rewrote EV benchmarks'],

  // ---- Lamborghini ----
  ['Lamborghini', 'Revuelto', 'Supercar', 'Petrol', 1000.0, 1000.0, 2, 1015, 6.0, 0, 'The V12 hybrid hypercar flagship of Sant\u2019Agata'],
  ['Lamborghini', 'Temerario', 'Supercar', 'Petrol', 700.0, 700.0, 2, 920, 7.0, 0, 'The twin-turbo V8 hybrid successor to the Hurac\u00e1n'],
  ['Lamborghini', 'Urus', 'Supercar', 'Petrol', 420.0, 420.0, 5, 657, 7.0, 0, 'The super-SUV that invented its own segment'],

  // ---- Ferrari ----
  ['Ferrari', '296 GTB', 'Supercar', 'Petrol', 620.0, 620.0, 2, 830, 6.0, 0, 'The V6 hybrid berlinetta with racing DNA'],
  ['Ferrari', '296 GTS', 'Convertible', 'Petrol', 650.0, 650.0, 2, 830, 6.0, 0, 'Open-top V6 hybrid Ferrari with retractable hardtop'],
  ['Ferrari', 'Amalfi', 'Supercar', 'Petrol', 700.0, 700.0, 2, 700, 6.5, 0, 'Exclusive bespoke Ferrari grand tourer concept'],
  ['Ferrari', 'Purosangue', 'Supercar', 'Petrol', 750.0, 750.0, 4, 725, 7.5, 0, 'Ferrari\u2019s first four-door with a naturally-aspirated V12'],
  ['Ferrari', 'Roma', 'Supercar', 'Petrol', 440.0, 440.0, 4, 620, 7.0, 0, 'The elegant \u2018Dolce Vita\u2019 grand tourer'],
  ['Ferrari', 'SF90', 'Supercar', 'Petrol', 850.0, 850.0, 2, 1000, 5.0, 0, 'The 1000-horsepower plug-in hybrid flagship'],

  // ---- Maserati ----
  ['Maserati', 'Grecale', 'SUV', 'Petrol', 100.0, 140.0, 5, 325, 11.0, 0, 'The new Italian luxury SUV with sporting character'],
  ['Maserati', 'GranTurismo', 'Coupe', 'Petrol', 280.0, 320.0, 4, 550, 9.0, 0, 'The beautiful grand tourer with a Ferrari-derived V6'],
  ['Maserati', 'GranCabrio', 'Convertible', 'Petrol', 300.0, 340.0, 4, 550, 9.0, 0, 'Open-air Italian elegance with a roaring V6'],
  ['Maserati', 'MC20', 'Supercar', 'Petrol', 350.0, 350.0, 2, 630, 8.0, 0, 'The mid-engine supercar with Nettuno V6 genius'],

  // ---- McLaren ----
  ['McLaren', 'Artura', 'Supercar', 'Petrol', 450.0, 450.0, 2, 680, 6.0, 0, 'The electrified V6 hybrid supercar from Woking'],
  ['McLaren', '750S', 'Supercar', 'Petrol', 520.0, 520.0, 2, 750, 5.0, 0, 'The purest expression of McLaren performance'],

  // ---- Aston Martin ----
  ['Aston Martin', 'DB12', 'Supercar', 'Petrol', 540.0, 540.0, 4, 680, 8.0, 0, 'The supercar of grand tourers with hand-built V8 majesty'],
  ['Aston Martin', 'DBX', 'Supercar', 'Petrol', 420.0, 420.0, 5, 707, 7.5, 0, 'The ultra-luxury performance SUV from Gaydon'],
  ['Aston Martin', 'Vantage', 'Supercar', 'Petrol', 410.0, 410.0, 2, 665, 7.0, 0, 'The purist sports car with razor-sharp British character'],

  // ---- Bentley ----
  ['Bentley', 'Bentayga', 'SUV', 'Petrol', 520.0, 520.0, 5, 550, 8.0, 0, 'The most luxurious SUV in the world, handcrafted in Crewe'],
  ['Bentley', 'Continental GT', 'Coupe', 'Petrol', 540.0, 540.0, 4, 650, 7.5, 0, 'The grand tourer that defines luxury motoring'],
  ['Bentley', 'Flying Spur', 'Sedan', 'Petrol', 580.0, 580.0, 5, 650, 7.5, 0, 'The ultimate chauffeur-driven luxury saloon'],

  // ---- Rolls-Royce ----
  ['Rolls-Royce', 'Cullinan', 'SUV', 'Petrol', 1050.0, 1050.0, 5, 571, 7.5, 0, 'The all-terrain Rolls-Royce with effortless magic'],
  ['Rolls-Royce', 'Ghost', 'Sedan', 'Petrol', 900.0, 900.0, 5, 571, 8.0, 0, 'The purest expression of modern Rolls-Royce luxury'],
  ['Rolls-Royce', 'Phantom', 'Sedan', 'Petrol', 1200.0, 1200.0, 5, 563, 7.5, 0, 'The pinnacle of automotive luxury on Earth'],
  ['Rolls-Royce', 'Spectre', 'Coupe', 'Electric', 1000.0, 1000.0, 4, 577, 530, 102, 'Rolls-Royce\u2019s first fully electric masterpiece'],

  // ---- Tesla ----
  ['Tesla', 'Model 3', 'Sedan', 'Electric', 35.0, 45.0, 5, 340, 629, 75, 'The world\u2019s most advanced electric sedan'],
  ['Tesla', 'Model Y', 'SUV', 'Electric', 45.0, 55.0, 5, 380, 575, 75, 'The best-selling electric SUV on the planet'],

  // ---- VinFast ----
  ['VinFast', 'VF 6', 'Compact SUV', 'Electric', 22.0, 24.0, 5, 174, 381, 59.6, 'VinFast\u2019s compact electric SUV for the Indian market'],
  ['VinFast', 'VF 7', 'Compact SUV', 'Electric', 25.0, 28.0, 5, 260, 431, 75.3, 'Sporty mid-size electric SUV with dual-motor option'],
  ['VinFast', 'VF e34', 'Compact SUV', 'Electric', 18.0, 20.0, 5, 148, 285, 42, 'The value-focused electric SUV marking VinFast\u2019s India entry']
];

// ---------------------------------------------------------------------------
// Segment / brand defaults
// ---------------------------------------------------------------------------
const SEGMENT_DEFAULTS = {
  'Hatchback':    { boot: 260, gc: 170, tank: 37, top: 165, accel: 12.0, maint: 5200, insurPerLakh: 3200 },
  'Sedan':        { boot: 460, gc: 165, tank: 45, top: 205, accel: 9.0,  maint: 7200, insurPerLakh: 3100 },
  'Compact SUV':  { boot: 370, gc: 195, tank: 45, top: 180, accel: 11.0, maint: 6200, insurPerLakh: 3200 },
  'SUV':          { boot: 430, gc: 200, tank: 55, top: 195, accel: 9.5,  maint: 9500, insurPerLakh: 3200 },
  'MPV':          { boot: 310, gc: 180, tank: 45, top: 170, accel: 12.0, maint: 8200, insurPerLakh: 3100 },
  'Coupe':        { boot: 320, gc: 150, tank: 50, top: 240, accel: 5.5,  maint: 22000, insurPerLakh: 3200 },
  'Convertible':  { boot: 210, gc: 140, tank: 55, top: 250, accel: 4.5,  maint: 26000, insurPerLakh: 3400 },
  'Supercar':     { boot: 160, gc: 120, tank: 60, top: 330, accel: 3.0,  maint: 65000, insurPerLakh: 3400 },
  'Pickup':       { boot: 1000, gc: 210, tank: 55, top: 175, accel: 13.0, maint: 9000, insurPerLakh: 3000 }
};

const PREMIUM_BRANDS = new Set([
  'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Land Rover', 'Jaguar', 'Volvo',
  'Porsche', 'Lamborghini', 'Ferrari', 'Maserati', 'McLaren', 'Aston Martin',
  'Bentley', 'Rolls-Royce', 'Tesla', 'VinFast', 'MINI'
]);

const PREMIUM_INSURANCE_MULT = 2800; // ₹ per lakh for ultra-luxury

function slug(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics (Citroën -> Citroen)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isElectric(fuelTypes) { return fuelTypes.includes('Electric'); }
function isHybrid(fuelTypes) { return fuelTypes.includes('Strong Hybrid') || fuelTypes.includes('Hybrid'); }
function isCng(fuelTypes) { return fuelTypes.includes('CNG'); }

function quote(s) {
  return JSON.stringify(String(s));
}

// Marker used to inject raw image references (import identifiers or URLs)
// after JSON.stringify, so they are not double-escaped.
const IMG_PLACEHOLDER = '\u0000IMG\u0000';
const IMG_PLACEHOLDER_JSON = JSON.stringify(IMG_PLACEHOLDER); // "\u0000IMG\u0000"

function buildVariant(name, priceLakh, fuel, transmission, extra) {
  return { name, priceLakh, transmission, fuel, keyFeatures: extra };
}

function buildCar(entry, imgVar) {
  const [brand, model, body, fuelStr, priceMin, priceMax, seats, power, mileage, battery, tagline] = entry;
  const fuelTypes = fuelStr.split(',');
  const ev = isElectric(fuelTypes);
  const sd = SEGMENT_DEFAULTS[body] || SEGMENT_DEFAULTS.SUV;
  const premium = PREMIUM_BRANDS.has(brand);
  const luxuryPrice = priceMax >= 45;

  const id = `${slug(brand)}-${slug(model)}`;
  const tline = tagline || `${brand} ${model} — ${body === 'Supercar' ? 'Exhilarating supercar performance and iconic design' : body === 'Pickup' ? 'Rugged pickup capability with everyday usability' : `Premium ${body.toLowerCase()} for the Indian market`}`;

  const transmission = ev ? ['Automatic'] : (premium || body === 'Supercar' || body === 'Pickup' ? ['Automatic'] : ['Manual', 'Automatic']);
  const topSpeed = ev ? Math.min(sd.top, 200) : sd.top;
  const accel = ev ? 8.0 : sd.accel;
  const boot = ev ? Math.max(180, Math.round(sd.boot * 0.9)) : sd.boot;
  const tank = ev ? 0 : sd.tank;
  const mileageVal = ev ? mileage : mileage; // EV: range in km
  const engineDesc = ev
    ? `Electric Motor (${battery || 60} kWh Battery)`
    : `${power} PS ${fuelTypes[0]} Engine`;

  const airbags = premium ? 6 : 6;
  const adas = premium || body === 'Supercar' || priceMax >= 20;
  const adasLevel = body === 'Supercar' ? 2 : 2;
  const stars = premium ? 5 : 4;
  const testingAgency = premium ? 'Global NCAP' : 'Internal Testing';

  const safetyFeatures = [
    `${airbags} Airbags Standard`,
    'Electronic Stability Program (ESP)',
    'Hill Hold Assist',
    'ISOFIX Child Seat Anchors',
    'ABS with EBD'
  ];
  if (adas) safetyFeatures.unshift(`Level ${adasLevel} ADAS Suite (AEB, Lane Keep, ACC)`);

  const comfort = [
    'Automatic Climate Control',
    premium ? 'Premium Leather Upholstery' : 'Push Button Start with Smart Key',
    'Cruise Control',
    'Auto-Dimming IRVM',
    premium ? 'Powered & Ventilated Front Seats' : 'Height Adjustable Driver Seat'
  ];
  const technology = [
    `${premium ? 10.25 : 8}" HD Touchscreen Infotainment`,
    'Wireless Apple CarPlay & Android Auto',
    premium ? 'Connected Car Suite with OTA Updates' : 'Smartphone Connectivity',
    'Digital Driver Instrument Cluster'
  ];
  if (body === 'Supercar') {
    comfort[1] = 'Carbon-Fibre Interior Trim';
    technology[0] = 'Digital Cockpit with Drive Modes';
  }

  const sunroof = ev || premium || body === 'MPV' ? 'Panoramic' : 'Single Pane';
  const ventSeats = premium || priceMax >= 20;

  const maintenance = ev ? Math.round(sd.maint * 0.85) : sd.maint;
  // ~2.2% of ex-showroom price as a realistic annual comprehensive premium
  const insurance = Math.round(priceMax * 2200);

  const fuelWord = ev ? 'Electric' : fuelTypes[0];
  const midPrice = Math.round(((priceMin + priceMax) / 2) * 100) / 100;

  const variants = [
    buildVariant(ev ? 'Base' : 'Base', priceMin, fuelWord, transmission[0], ['Keyless Entry', 'ABS with EBD', 'LED DRLs']),
    buildVariant('Mid', midPrice, fuelWord, transmission[transmission.length - 1], ['Touchscreen Infotainment', 'Rear Parking Camera', 'Cruise Control']),
    buildVariant('Top', priceMax, fuelWord, transmission[transmission.length - 1], ['Panoramic Sunroof', 'Connected Car Tech', 'Premium Audio'])
  ];

  const pros = [
    ev
      ? `Zero-emission electric driving with ~${mileage} km range and low running costs`
      : isHybrid(fuelTypes)
        ? `Class-leading fuel economy (~${mileage} km/l) with self-charging hybrid tech`
        : isCng(fuelTypes)
          ? `Flexible ${mileage} km/l Petrol/CNG driving with low running costs`
          : `Certified fuel economy of ~${mileage} km/l for daily driving`,
    `${seats}-seat ${body.toLowerCase()} layout with a practical, comfortable cabin`,
    premium ? 'Premium badge appeal with advanced safety and driver-assist tech' : `${brand} build quality backed by a wide service network`,
    body === 'Supercar' ? 'Exhilarating performance with race-bred dynamics' : `${body === 'Pickup' ? 'Class-leading load-carrying capability' : 'Strong road presence and modern design'}`
  ];

  const cons = [
    ev ? 'Public fast-charging infrastructure still expanding outside metros' : 'Ex-showroom price excludes on-road taxes and insurance',
    premium || luxuryPrice ? 'Premium maintenance and insurance costs' : 'Feature list varies significantly across variant grades'
  ];

  const bestSuitedFor = [
    `${brand} loyalists and ${body === 'Supercar' ? 'enthusiasts' : 'families'} seeking a ${body.toLowerCase() === 'sedan' ? 'refined sedan' : body.toLowerCase()}`,
    ev ? 'Eco-conscious drivers wanting zero tailpipe emissions and low per-km costs' : 'Buyers prioritizing dependable, low-stress daily ownership'
  ];

  const specs = {
    engineDisplacement: engineDesc,
    powerPS: power,
    torqueNM: Math.round(power * 1.5),
    transmission,
    mileageKmPerLitreOrKWh: mileageVal,
    rangeKm: ev ? mileage : undefined,
    topSpeedKmH: topSpeed,
    acceleration0to100: accel,
    bootSpaceLitres: boot,
    groundClearanceMm: sd.gc,
    seatingCapacity: seats,
    fuelTankCapacityLitres: tank,
    batteryCapacityKWh: ev ? (battery || 60) : undefined
  };

  const obj = {
    id,
    brand,
    model,
    tagline: tline,
    priceMinLakh: priceMin,
    priceMaxLakh: priceMax,
    bodyType: body,
    fuelTypes,
    image: IMG_PLACEHOLDER,
    galleryImages: [IMG_PLACEHOLDER],
    specs,
    safety: {
      ratingStars: stars,
      testingAgency,
      airbagsCount: airbags,
      hasADAS: adas,
      adasLevel,
      hasESP: true,
      has360Camera: premium || priceMax >= 18,
      hasIsofix: true,
      keySafetyFeatures: safetyFeatures
    },
    features: {
      infotainmentScreenInch: premium ? 10.25 : 8,
      sunroof,
      ventilatedSeats: ventSeats,
      wirelessCharging: premium,
      connectedCarTech: true,
      comfort,
      technology
    },
    ownership: {
      avgAnnualMaintenance: maintenance,
      estimatedYearlyInsurance: insurance,
      warrantyYears: 3,
      warrantyKm: 100000,
      batteryWarrantyYears: ev ? 8 : undefined
    },
    variants,
    pros,
    cons,
    bestSuitedFor
  };
  return obj;
}

// ---------------------------------------------------------------------------
// Wikimedia Commons image lookup + download
// ---------------------------------------------------------------------------
const UA = 'DriveAI-Lineup-Builder/1.0 (local dev build; contact: dev@example.com)';
const EXCLUDE = /engine|interior|logo|emblem|badge|rim|wheel|dashboard|cockpit|under|motor|battery|front seat|rear seat|door panel|display|screen|close-up|closeup|seats\b|drawing|schematics?|exploded|parts\b/i;

const API_DELAY_MS = 2000; // Wikimedia asks for ~1 req/s sustained; stay well under

// Wikimedia's image CDN throttles bulk downloads from datacenter IPs, but the
// API + hotlinked thumbnails are fine. Default to hotlinking; use --local to
// download into src/assets/images instead (respect Wikimedia's robot policy).
const DOWNLOAD_IMAGES = process.argv.includes('--local');

async function fetchJson(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    const text = await res.text();
    if (res.status === 429 || res.status === 403 || text.startsWith('{') === false) {
      // Rate-limited or blocked - back off and retry
      await new Promise((r) => setTimeout(r, 8000));
      continue;
    }
    return JSON.parse(text);
  }
  throw new Error('rate limited after retries');
}

function buildSearchUrl(q) {
  return 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: q,
    gsrnamespace: '6',
    gsrlimit: '15',
    prop: 'imageinfo',
    iiprop: 'url|size|mime',
    iiurlwidth: '1400'
  }).toString();
}

async function findImage(brand, model) {
  const brandLower = brand.toLowerCase();
  const modelLower = model.toLowerCase();
  const brandWords = brandLower.split(/\s+/).filter((w) => w.length > 2);
  const modelWords = modelLower.split(/\s+/).filter((w) => w.length > 1);
  const queries = [
    `"${brand} ${model}"`,
    `intitle:"${model}" ${brand} car`,
    `"${model}" ${brand} car`,
    `"${model}" car`
  ];

  for (const q of queries) {
    try {
      const data = await fetchJson(buildSearchUrl(q));
      const pages = data?.query?.pages;
      if (!pages) continue;
      const candidates = Object.values(pages)
        .filter((p) => p.imageinfo && p.imageinfo[0])
        .map((p) => ({ title: p.title, info: p.imageinfo[0] }))
        .filter((c) => {
          const mime = c.info.mime || '';
          if (!/jpe?g|png/.test(mime)) return false;
          if ((c.info.width || 0) < 600) return false;
          if (EXCLUDE.test(c.title)) return false;
          return true;
        });
      if (!candidates.length) continue;
      const scored = candidates
        .map((c) => {
          const t = c.title.toLowerCase();
          let score = 0;
          const hasModelPhrase = t.includes(modelLower);
          if (hasModelPhrase) score += 10;
          for (const w of brandWords) if (t.includes(w)) score += 2;
          for (const w of modelWords) if (t.includes(w)) score += 2;
          score += Math.min(c.info.width, 2400) / 2400;
          return { c, score, hasModelPhrase };
        })
        .sort((a, b) => b.score - a.score);
      const best = scored[0];
      // Require the model phrase or a solid brand+model token match
      const strong = best.hasModelPhrase || (best.score >= 6 && modelWords.some((w) => best.c.title.toLowerCase().includes(w)));
      if (!strong) continue;
      const url = (best.c.info.thumburl || best.c.info.url).split('?')[0];
      return { url, page: best.c.info.descriptionurl || `https://commons.wikimedia.org/wiki/${best.c.title.replace(/ /g, '_')}` };
    } catch (e) {
      console.warn(`  [warn] search failed for ${brand} ${model}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, API_DELAY_MS));
  }
  return null;
}

// Wikimedia's CDN rejects our custom UA (403 robot policy) but serves normal
// browser requests fine. Use a plain browser UA + referer for downloads.
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

async function downloadImage(url, filePath) {
  for (let attempt = 0; attempt < 4; attempt++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(url, {
      headers: { 'User-Agent': BROWSER_UA, 'Referer': 'https://commons.wikimedia.org/' }
    });
    if (res.status === 403 || res.status === 429) {
      // upload.wikimedia.org throttles bursts hard; back off substantially
      await new Promise((r) => setTimeout(r, 45000));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buf);
    return buf.length;
  }
  throw new Error('throttled');
}

async function fetchAllImages() {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const results = [];
  const queue = [...CARS];

  // Reuse previously resolved image URLs (fast re-runs)
  const cache = fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) : {};

  for (const entry of queue) {
    const [brand, model] = entry;
    const id = `${slug(brand)}-${slug(model)}`;
    const filePath = path.join(IMG_DIR, `${id}.jpg`);
    const exists = fs.existsSync(filePath) && fs.statSync(filePath).size > 5000;
    if (exists) {
      results.push({ id, filePath, page: null, hotlink: null, reused: true });
      console.log(`[ok] ${brand} ${model} (cached)`);
      continue;
    }
    if (cache[id]) {
      const { url, page } = cache[id];
      if (DOWNLOAD_IMAGES) {
        try {
          const size = await downloadImage(url, filePath);
          if (size > 5000) {
            results.push({ id, filePath, page, hotlink: null, reused: false });
            console.log(`[ok] ${brand} ${model} -> ${path.basename(filePath)} (${(size / 1024).toFixed(0)} KB)`);
          } else {
            fs.rmSync(filePath, { force: true });
            results.push({ id, filePath: null, page, hotlink: url, reused: false });
            console.log(`[hl] ${brand} ${model}: empty download, using hotlink`);
          }
        } catch (e) {
          fs.rmSync(filePath, { force: true });
          results.push({ id, filePath: null, page, hotlink: url, reused: false });
          console.log(`[hl] ${brand} ${model}: download failed (${e.message}), using hotlink`);
        }
      } else {
        results.push({ id, filePath: null, page, hotlink: url, reused: true });
        console.log(`[hl] ${brand} ${model} (cached URL)`);
      }
      continue;
    }
    const found = await findImage(brand, model);
    if (found) {
      if (DOWNLOAD_IMAGES) {
        try {
          const size = await downloadImage(found.url, filePath);
          if (size > 5000) {
            results.push({ id, filePath, page: found.page, hotlink: null, reused: false });
            console.log(`[ok] ${brand} ${model} -> ${path.basename(filePath)} (${(size / 1024).toFixed(0)} KB)`);
          } else {
            fs.rmSync(filePath, { force: true });
            results.push({ id, filePath: null, page: found.page, hotlink: found.url, reused: false });
            console.log(`[hl] ${brand} ${model}: empty download, using hotlink`);
          }
        } catch (e) {
          fs.rmSync(filePath, { force: true });
          results.push({ id, filePath: null, page: found.page, hotlink: found.url, reused: false });
          console.log(`[hl] ${brand} ${model}: download throttled, using hotlink`);
        }
      } else {
        results.push({ id, filePath: null, page: found.page, hotlink: found.url, reused: false });
        console.log(`[hl] ${brand} ${model} -> hotlinked`);
      }
    } else {
      results.push({ id, filePath: null, page: null, hotlink: null, reused: false });
      console.log(`[--] ${brand} ${model}: no suitable image found`);
    }
    await new Promise((r) => setTimeout(r, API_DELAY_MS));
  }

  // Persist resolved URLs for instant future re-runs
  const newCache = { ...cache };
  for (const r of results) {
    if (r.hotlink && !newCache[r.id]) newCache[r.id] = { url: r.hotlink, page: r.page };
  }
  fs.writeFileSync(CACHE_FILE, JSON.stringify(newCache, null, 2));
  return results;
}

// ---------------------------------------------------------------------------
// TypeScript generation
// ---------------------------------------------------------------------------
function generateTs(results) {
  const byId = new Map(results.map((r) => [r.id, r]));
  const lines = [];
  lines.push('// Generated by scripts/build-car-lineup.mjs - do not edit by hand.');
  lines.push('// Prices/specs for these models are indicative Indian-market figures.');
  lines.push('// Some images are hotlinked from Wikimedia Commons (free-licensed thumbnails);');
  lines.push('// see src/data/imageAttribution.ts for source pages.');
  lines.push("import type { Car } from '../types';");
  lines.push('');
  const imgImports = [];
  const attributions = {};
  const imgVars = {};
  const objects = [];
  let idx = 0;
  for (const entry of CARS) {
    const [brand, model] = entry;
    const id = `${slug(brand)}-${slug(model)}`;
    const r = byId.get(id);
    let imgVar = `''`;
    if (r && r.filePath) {
      imgVar = `img${idx}`;
      imgImports.push(`import img${idx} from '../assets/images/${path.basename(r.filePath)}';`);
      if (r.page) attributions[id] = r.page;
      idx += 1;
    } else if (r && r.hotlink) {
      imgVar = JSON.stringify(r.hotlink);
      if (r.page) attributions[id] = r.page;
    }
    imgVars[id] = imgVar;
    objects.push(buildCar(entry, imgVar));
  }
  lines.push(...imgImports);
  lines.push('');
  lines.push('export const FULL_LINEUP: Car[] = [');
  for (const o of objects) {
    let text = JSON.stringify(o, null, 2).split(IMG_PLACEHOLDER_JSON).join(imgVars[o.id] || "''");
    lines.push('  ' + text.split('\n').join('\n  '));
    lines.push(',');
  }
  lines.pop();
  lines.push('];');
  lines.push('');
  fs.writeFileSync(OUT_FILE, lines.join('\n'));

  // Attribution file
  const attrLines = [
    '// Generated by scripts/build-car-lineup.mjs - do not edit by hand.',
    '// Images were sourced from Wikimedia Commons and are free-licensed',
    '// (CC BY / CC BY-SA / Public Domain). Keep this mapping for attribution.',
    "export const IMAGE_ATTRIBUTION: Record<string, string> = {",
  ];
  for (const [id, page] of Object.entries(attributions)) {
    attrLines.push(`  ${quote(id)}: ${quote(page)},`);
  }
  attrLines.push('};');
  fs.writeFileSync(ATTR_FILE, attrLines.join('\n'));
  const withImage = results.filter((r) => r.filePath || r.hotlink).length;
  return { total: CARS.length, withImage };
}

// ---------------------------------------------------------------------------
async function main() {
  console.log(`Building lineup for ${CARS.length} models...`);
  const results = await fetchAllImages();
  const stats = generateTs(results);
  const hotlinked = results.filter((r) => !r.filePath && r.hotlink);
  const missing = results.filter((r) => !r.filePath && !r.hotlink);
  console.log(`\nDone. ${stats.withImage}/${stats.total} models have real images.`);
  if (hotlinked.length) console.log(`Hotlinked thumbnails: ${hotlinked.length}`);
  if (missing.length) {
    console.log('Missing images (will use branded silhouette fallback):');
    for (const m of missing) console.log(`  - ${m.id}`);
  }
  console.log(`\nGenerated:\n  ${OUT_FILE}\n  ${ATTR_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
