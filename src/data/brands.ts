export interface BrandInfo {
  name: string;
  slug: string;
  logo: string;
  fallbackLogo: string;
  tag: string;
  origin?: string;
}

export const ALL_CAR_BRANDS: BrandInfo[] = [
  {
    name: 'Maruti Suzuki',
    slug: 'suzuki',
    logo: '/brand-logos/suzuki.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/suzuki.png',
    tag: 'India #1 Mileage & Reliability',
    origin: 'India / Japan'
  },
  {
    name: 'Tata Motors',
    slug: 'tata',
    logo: '/brand-logos/tata.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/tata.png',
    tag: '5-Star BNCAP Safety & EV Leader',
    origin: 'India'
  },
  {
    name: 'Mahindra',
    slug: 'mahindra',
    logo: '/brand-logos/mahindra.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mahindra.png',
    tag: 'Authentic SUVs & 4x4 Power',
    origin: 'India'
  },
  {
    name: 'Hyundai',
    slug: 'hyundai',
    logo: '/brand-logos/hyundai.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/hyundai.png',
    tag: 'Connected Tech & Premium Design',
    origin: 'South Korea'
  },
  {
    name: 'Toyota',
    slug: 'toyota',
    logo: '/brand-logos/toyota.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/toyota.png',
    tag: 'Legendary Durability & Hybrid Tech',
    origin: 'Japan'
  },
  {
    name: 'Kia',
    slug: 'kia',
    logo: '/brand-logos/kia.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/kia.png',
    tag: 'Futuristic Styling & Rich Features',
    origin: 'South Korea'
  },
  {
    name: 'Honda',
    slug: 'honda',
    logo: '/brand-logos/honda.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/honda.png',
    tag: 'i-VTEC Refinement & e:HEV Tech',
    origin: 'Japan'
  },
  {
    name: 'MG Motor',
    slug: 'mg',
    logo: '/brand-logos/mg.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mg.png',
    tag: 'Smart Connected Cars & Urban EVs',
    origin: 'Britain / Global'
  },
  {
    name: 'Volkswagen',
    slug: 'volkswagen',
    logo: '/brand-logos/volkswagen.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/volkswagen.png',
    tag: 'German Build Quality & TSI Performance',
    origin: 'Germany'
  },
  {
    name: 'Škoda',
    slug: 'skoda',
    logo: '/brand-logos/skoda.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/skoda.png',
    tag: 'Simply Clever & 5-Star Dynamics',
    origin: 'Czech Republic'
  },
  {
    name: 'Renault',
    slug: 'renault',
    logo: '/brand-logos/renault.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/renault.png',
    tag: 'Practical Value & Smart Packaging',
    origin: 'France'
  },
  {
    name: 'Nissan',
    slug: 'nissan',
    logo: '/brand-logos/nissan.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/nissan.png',
    tag: 'Turbocharged SUVs & Japanese Heritage',
    origin: 'Japan'
  },
  {
    name: 'Jeep',
    slug: 'jeep',
    logo: '/brand-logos/jeep.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/jeep.png',
    tag: 'Trail-Rated 4x4 & Adventure Heritage',
    origin: 'USA'
  },
  {
    name: 'Citroën',
    slug: 'citroen',
    logo: '/brand-logos/citroen.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/citroen.png',
    tag: 'Advanced Flying Carpet Comfort',
    origin: 'France'
  },
  {
    name: 'Force Motors',
    slug: 'force-motors',
    logo: '/brand-logos/force-motors.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/force-motors.png',
    tag: 'Expedition-Ready Extreme Off-Road',
    origin: 'India'
  },
  {
    name: 'BYD',
    slug: 'byd',
    logo: '/brand-logos/byd.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/byd.png',
    tag: 'Global Ultra-Safe Blade Battery EVs',
    origin: 'Global'
  },
  {
    name: 'BMW',
    slug: 'bmw',
    logo: '/brand-logos/bmw.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/bmw.png',
    tag: 'The Ultimate Driving Machine',
    origin: 'Germany'
  },
  {
    name: 'Mercedes-Benz',
    slug: 'mercedes-benz',
    logo: '/brand-logos/mercedes-benz.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mercedes-benz.png',
    tag: 'The Pinnacle of Automotive Luxury',
    origin: 'Germany'
  },
  {
    name: 'Audi',
    slug: 'audi',
    logo: '/brand-logos/audi.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/audi.png',
    tag: 'Vorsprung durch Technik & Quattro',
    origin: 'Germany'
  },
  {
    name: 'Volvo',
    slug: 'volvo',
    logo: '/brand-logos/volvo.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/volvo.png',
    tag: 'World Standard for Safety & Electrification',
    origin: 'Sweden'
  },
  {
    name: 'Land Rover',
    slug: 'land-rover',
    logo: '/brand-logos/land-rover.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/land-rover.png',
    tag: 'Peerless All-Terrain Luxury & Defender Spirit',
    origin: 'Britain'
  },
  {
    name: 'Jaguar',
    slug: 'jaguar',
    logo: '/brand-logos/jaguar.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/jaguar.png',
    tag: 'Art of Performance & British Grace',
    origin: 'Britain'
  },
  {
    name: 'Lexus',
    slug: 'lexus',
    logo: '/brand-logos/lexus.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/lexus.png',
    tag: 'Takumi Craft & Self-Charging Hybrid Quiet',
    origin: 'Japan'
  },
  {
    name: 'Porsche',
    slug: 'porsche',
    logo: '/brand-logos/porsche.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/porsche.png',
    tag: 'Motorsport Precision & Sports Car Purity',
    origin: 'Germany'
  },
  {
    name: 'MINI',
    slug: 'mini',
    logo: '/brand-logos/mini.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mini.png',
    tag: 'Iconic Go-Kart Agility & Character',
    origin: 'Britain'
  },
  {
    name: 'Isuzu',
    slug: 'isuzu',
    logo: '/brand-logos/isuzu.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/isuzu.png',
    tag: 'Bulletproof Diesel Engines & Lifestyle 4x4',
    origin: 'Japan'
  },
  {
    name: 'Tesla',
    slug: 'tesla',
    logo: '/brand-logos/tesla.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/tesla.png',
    tag: 'Pioneering EV Software & Autonomous Drive',
    origin: 'USA'
  },
  {
    name: 'Ferrari',
    slug: 'ferrari',
    logo: '/brand-logos/ferrari.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/ferrari.png',
    tag: 'Prancing Horse Legend & Formula 1 Soul',
    origin: 'Italy'
  },
  {
    name: 'Lamborghini',
    slug: 'lamborghini',
    logo: '/brand-logos/lamborghini.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/lamborghini.png',
    tag: 'Unapologetic Supercars & Raging Bull V12',
    origin: 'Italy'
  },
  {
    name: 'Aston Martin',
    slug: 'aston-martin',
    logo: '/brand-logos/aston-martin.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/aston-martin.png',
    tag: 'Power, Beauty and Soul in Grand Touring',
    origin: 'Britain'
  },
  {
    name: 'Bentley',
    slug: 'bentley',
    logo: '/brand-logos/bentley.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/bentley.png',
    tag: 'Handcrafted British Grand Touring Prestige',
    origin: 'Britain'
  },
  {
    name: 'Rolls-Royce',
    slug: 'rolls-royce',
    logo: '/brand-logos/rolls-royce.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/rolls-royce.png',
    tag: 'The Best Car in the World & Starlight Magic',
    origin: 'Britain'
  },
  {
    name: 'Maserati',
    slug: 'maserati',
    logo: '/brand-logos/maserati.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/maserati.png',
    tag: 'Trident Elegance & Italian V6 Symphony',
    origin: 'Italy'
  },
  {
    name: 'McLaren',
    slug: 'mclaren',
    logo: '/brand-logos/mclaren.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mclaren.png',
    tag: 'Carbon Monocoque Track Supercars',
    origin: 'Britain'
  },
  {
    name: 'VinFast',
    slug: 'vinfast',
    logo: '/brand-logos/vinfast.png',
    fallbackLogo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/vinfast.png',
    tag: 'Global Electric Crossovers & New Wave EV',
    origin: 'Vietnam'
  }
];
