import { Service, Professional, Booking, Review } from '../types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-clean-01',
    slug: 'deep-sanctuary-cleaning',
    title: 'Deep Sanctuary Cleaning & Eco-Sanitization',
    category: 'Cleaning',
    tagline: 'Medical-grade HEPA filtration, zero-chemical botanicals & immaculate detail.',
    description: 'A comprehensive deep restoration of your home sanctuary. Our certified specialists cleanse every architectural surface, steam-treat textiles, and polish fixtures using hospital-grade botanical extracts.',
    detailedSpecs: [
      'Double HEPA-filter air scrubbers deployed during service',
      'Non-toxic plant-derived enzyme cleaning solutions',
      'Full interior cabinetry, appliance & architectural trim detailing',
      'Steam sanitation of upholstery, drapery & bedding',
      'Streak-free optical glass & window rail treatment'
    ],
    durationMinutes: 240,
    basePrice: 220,
    priceUnit: 'base visit',
    rating: 4.96,
    reviewCount: 342,
    imageUrl: '/src/assets/images/service_deep_clean_1792504086137.jpg',
    popular: true
  },
  {
    id: 'srv-style-02',
    slug: 'interior-styling-organization',
    title: 'Architectural Styling & Space Harmonization',
    category: 'Styling',
    tagline: 'Curated spatial design, bespoke storage integration, and sensory balance.',
    description: 'Transform cluttered rooms into serene, minimalist living areas. Our interior architects organize your wardrobe, display ceramics and art, and curate lighting schemes that elevate daily living.',
    detailedSpecs: [
      'In-person room zoning and ergonomic movement analysis',
      'Custom modular drawer, closet & pantry organization system',
      'Art hanging, decorative ceramics & floral vessel arrangement',
      'Natural fiber textile draping and pillow geometry balance',
      'Custom spatial inventory catalogue provided upon completion'
    ],
    durationMinutes: 180,
    basePrice: 280,
    priceUnit: 'per room',
    rating: 4.98,
    reviewCount: 184,
    imageUrl: '/src/assets/images/service_interior_craft_1792504085124.jpg',
    popular: true
  },
  {
    id: 'srv-smart-03',
    slug: 'smart-climate-automation',
    title: 'Smart Automation & Preventive Diagnostics',
    category: 'Smart Home',
    tagline: 'Flawless Matter/Zigbee mesh, climate schedules, and electrical inspection.',
    description: 'End-to-end configuration of your intelligent home infrastructure. We audit energy consumption, calibrate multi-zone smart thermostats, secure smart locks, and tune ambient lighting scenes.',
    detailedSpecs: [
      'Diagnostic thermal scan of distribution boards & circuits',
      'Multi-zone thermostat calibration (Ecobee, Nest, Tado)',
      'Thread & Matter smart mesh network range optimization',
      'Integrated scene scripting: Morning Awakening & Evening Wind-Down',
      'Preventive electrical surge protection check'
    ],
    durationMinutes: 120,
    basePrice: 195,
    priceUnit: 'flat diagnostic',
    rating: 4.92,
    reviewCount: 129,
    imageUrl: '/src/assets/images/service_smart_maintenance_1792504086207.jpg',
    popular: false
  },
  {
    id: 'srv-maint-04',
    slug: 'handyman-precision-carpentry',
    title: 'Precision Architectural Handyman & Carpentry',
    category: 'Maintenance',
    tagline: 'Museum-grade wall mounting, acoustic acoustic panels & wood joinery repair.',
    description: 'Expert structural and finish craftsmanship for modern residences. From solid oak shelving and concealed hardware to bespoke acoustical panel mounting and door alignment.',
    detailedSpecs: [
      'Heavy-load concealed drywall anchor installation for stone & art',
      'Architectural door hinge truing, mortise adjustment & soft-close damping',
      'Custom acoustic felt and slatted timber wall installation',
      'Minimalist bathroom fixture & matte black brassware installation',
      'Precision caulking and hairline seam restoration'
    ],
    durationMinutes: 150,
    basePrice: 175,
    priceUnit: 'base 2 hours',
    rating: 4.94,
    reviewCount: 215,
    imageUrl: '/src/assets/images/hero_homesprit_living_1792504084898.jpg',
    popular: false
  }
];

export const INITIAL_PROS: Professional[] = [
  {
    id: 'pro-01',
    name: 'Clara Vance',
    roleTitle: 'Senior Sanitation & Detail Lead',
    email: 'clara.vance@homesprit.pro',
    phone: '+1 (555) 234-8910',
    specialty: 'Hospital-grade botanical sanitization & luxury surfaces',
    rating: 4.98,
    completedJobs: 412,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    verified: true,
    bio: 'Over 8 years managing five-star hotel residences and private sanctuaries. Expert in marble, raw travertine, and antique timber care.',
    availability: 'Available'
  },
  {
    id: 'pro-02',
    name: 'Julian Thorne',
    roleTitle: 'Smart Systems & Electrical Engineer',
    email: 'julian.t@homesprit.pro',
    phone: '+1 (555) 345-6789',
    specialty: 'Matter/Thread automation, Lutron lighting & HVAC zoning',
    rating: 4.95,
    completedJobs: 289,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    verified: true,
    bio: 'Licensed electrical technician specializing in modern smart living integrations, zero-latency mesh networking, and acoustic tuning.',
    availability: 'Available'
  },
  {
    id: 'pro-03',
    name: 'Elena Rostova',
    roleTitle: 'Architectural Stylist & Spatial Lead',
    email: 'elena.rostova@homesprit.pro',
    phone: '+1 (555) 456-7890',
    specialty: 'Minimalist spatial zoning, closet systems & curation',
    rating: 4.99,
    completedJobs: 198,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    verified: true,
    bio: 'Interior architecture graduate with a focus on Scandinavian and Japanese wabi-sabi principles for serene, functional everyday homes.',
    availability: 'On Assignment'
  },
  {
    id: 'pro-04',
    name: 'Marcus Bennett',
    roleTitle: 'Master Artisan & Finish Carpenter',
    email: 'marcus.b@homesprit.pro',
    phone: '+1 (555) 567-8901',
    specialty: 'Concealed cabinetry, heavy art rigging & joinery',
    rating: 4.93,
    completedJobs: 334,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    verified: true,
    bio: '14 years in bespoke architectural millwork and residential installation. Known for millimeter precision and zero dust footprint.',
    availability: 'Available'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    bookingCode: 'HS-8924',
    customerName: 'Tasdid Anawaz',
    customerEmail: 'tasdidanpreome@gmail.com',
    customerPhone: '+1 (555) 019-2834',
    serviceId: 'srv-clean-01',
    serviceTitle: 'Deep Sanctuary Cleaning & Eco-Sanitization',
    proId: 'pro-01',
    proName: 'Clara Vance',
    proAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    scheduledDate: '2026-10-22',
    timeSlot: '09:00 AM - 01:00 PM',
    status: 'IN_PROGRESS',
    totalAmount: 265,
    paymentStatus: 'PAID',
    address: '840 Pacific Heights Blvd, Penthouse 4B, San Francisco, CA',
    propertyType: 'Penthouse Apartment',
    propertySize: '3 Bedrooms · 2.5 Baths (2,200 sq ft)',
    notes: 'Please focus on the open kitchen marble island and guest bath travertine.',
    addOns: ['Interior Refrigerator Detox', 'High-Ceiling Chandelier Dusting'],
    createdAt: '2026-10-19T14:20:00Z',
    updatedAt: '2026-10-20T08:15:00Z'
  },
  {
    id: 'bk-1002',
    bookingCode: 'HS-9140',
    customerName: 'Sophia Sterling',
    customerEmail: 'sophia.s@lumina.io',
    customerPhone: '+1 (555) 882-9912',
    serviceId: 'srv-style-02',
    serviceTitle: 'Architectural Styling & Space Harmonization',
    proId: 'pro-03',
    proName: 'Elena Rostova',
    proAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    scheduledDate: '2026-10-24',
    timeSlot: '02:00 PM - 05:00 PM',
    status: 'SCHEDULED',
    totalAmount: 320,
    paymentStatus: 'PAID',
    address: '142 Marina Grove Way, San Francisco, CA',
    propertyType: 'Modern Townhouse',
    propertySize: 'Primary Suite & Living Pavilion',
    notes: 'New oak shelving installed yesterday, looking for complete sensory styling.',
    addOns: ['Artisan Floral Placement', 'Closet Color-Grading'],
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-18T10:00:00Z'
  },
  {
    id: 'bk-1003',
    bookingCode: 'HS-7842',
    customerName: 'Julian Hayes',
    customerEmail: 'julian@hayes-design.com',
    customerPhone: '+1 (555) 441-2309',
    serviceId: 'srv-smart-03',
    serviceTitle: 'Smart Automation & Preventive Diagnostics',
    proId: 'pro-02',
    proName: 'Julian Thorne',
    proAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    scheduledDate: '2026-10-19',
    timeSlot: '11:00 AM - 01:00 PM',
    status: 'COMPLETED',
    totalAmount: 195,
    paymentStatus: 'PAID',
    address: '550 Battery St, Suite 1900, San Francisco, CA',
    propertyType: 'Loft',
    propertySize: '2 Bedrooms · 1,400 sq ft',
    notes: 'Thermostat schedule was drifting + Wi-Fi drops on patio sensors.',
    addOns: ['Thermostat Multizone Sync'],
    createdAt: '2026-10-17T09:30:00Z',
    updatedAt: '2026-10-19T13:30:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    serviceId: 'srv-clean-01',
    serviceName: 'Deep Sanctuary Cleaning & Eco-Sanitization',
    userName: 'David K. Rosenthal',
    userLocation: 'Pacific Heights',
    rating: 5,
    comment: 'Unprecedented standard of care. Clara treated our French limestone floors and walnut millwork with immense respect. No harsh fumes, just pristine clarity.',
    date: 'October 16, 2026',
    verifiedBooking: true
  },
  {
    id: 'rev-02',
    serviceId: 'srv-style-02',
    serviceName: 'Architectural Styling & Space Harmonization',
    userName: 'Helena Bergstrom',
    userLocation: 'Presidio Terrace',
    rating: 5,
    comment: 'Elena transformed our cluttered master bedroom into a quiet Japanese sanctuary in three hours. Her eye for light and negative space is masterclass.',
    date: 'October 12, 2026',
    verifiedBooking: true
  },
  {
    id: 'rev-03',
    serviceId: 'srv-smart-03',
    serviceName: 'Smart Automation & Preventive Diagnostics',
    userName: 'Nathaniel Ward',
    userLocation: 'Sea Cliff',
    rating: 5,
    comment: 'Julian diagnosed a persistent ground loop on our lighting panel that two previous electricians missed. Smooth, polite, and deeply knowledgeable.',
    date: 'October 8, 2026',
    verifiedBooking: true
  }
];
