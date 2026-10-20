import React, { useState } from 'react';
import { 
  Sparkles, Check, Package, MapPin, Truck, RefreshCw, 
  Layers, ShieldCheck, Mail, Send, Award, Phone, Clock, 
  Compass, ChevronRight, Eye, Heart
} from 'lucide-react';

interface AtelierConfiguratorProps {
  onInquirePiece: (configSummary: {
    model: string;
    size: string;
    fabric: string;
    color: string;
    comfort: string;
    slipcover: string;
    stitching: string;
    priceUsd: number;
  }) => Promise<void>;
  onOrderSwatches: (swatchData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    swatches: string[];
  }) => Promise<void>;
}

export const AtelierConfigurator: React.FC<AtelierConfiguratorProps> = ({
  onInquirePiece,
  onOrderSwatches,
}) => {
  // Configurator state
  const [selectedModel, setSelectedModel] = useState('Biha');
  const [selectedSize, setSelectedSize] = useState('3-Seater (L 216 × D 102 cm)');
  const [selectedFabric, setSelectedFabric] = useState('Lin Lavé Français (Washed Linen)');
  const [selectedColor, setSelectedColor] = useState('Sable Écru (Natural Sand)');
  const [selectedComfort, setSelectedComfort] = useState('Plumes & Duvet (Plumtex Down Cloud)');
  const [selectedSlipcover, setSelectedSlipcover] = useState('Entièrement Déhoussable (Removable Slipcover)');
  const [selectedStitching, setSelectedStitching] = useState('Couture Passepoil (Piped Trim)');

  // Swatch sample modal state
  const [isSwatchModalOpen, setIsSwatchModalOpen] = useState(false);
  const [swatchName, setSwatchName] = useState('Tasdid Anawaz');
  const [swatchEmail, setSwatchEmail] = useState('tasdidanpreome@gmail.com');
  const [swatchPhone, setSwatchPhone] = useState('+1 (555) 019-2834');
  const [swatchAddress, setSwatchAddress] = useState('384 Montgomery Street, San Francisco, CA 94104');
  const [selectedSwatches, setSelectedSwatches] = useState<string[]>([
    'Lin Lavé - Sable Écru',
    'Velours Côtelé - Vert Émeraude',
    'Laine Bouclée - Craie Blanche',
  ]);
  const [swatchSubmitted, setSwatchSubmitted] = useState(false);
  const [isSwatchLoading, setIsSwatchLoading] = useState(false);

  // Inquire configured sofa state
  const [isConfigInquireModalOpen, setIsConfigInquireModalOpen] = useState(false);
  const [inquireName, setInquireName] = useState('Tasdid Anawaz');
  const [inquireEmail, setInquireEmail] = useState('tasdidanpreome@gmail.com');
  const [inquirePhone, setInquirePhone] = useState('+1 (555) 019-2834');
  const [inquireNotes, setInquireNotes] = useState('Requesting white-glove delivery to private residence with living room placement.');
  const [inquireSubmitted, setInquireSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Showroom Locator State
  const [selectedCityFilter, setSelectedCityFilter] = useState<'all' | 'france' | 'usa'>('all');
  const [activeShowroomModal, setActiveShowroomModal] = useState<string | null>(null);

  // Models catalog based directly on Home Spirit France (homespirit.net)
  const models = [
    {
      name: 'Biha',
      origin: 'L’Icône en Lin Lavé de Normandie',
      tagline: 'Oversized feather cushions, deep relaxed seat, exposed flange seams, and natural French flax drape.',
      basePrice: 2850,
      image: '/src/assets/images/homespirit_french_linen_sofa_1792507562168.jpg',
      badge: 'Best-Seller',
    },
    {
      name: 'Saint-Germain',
      origin: 'Le Canapé Haussmannien en Velours',
      tagline: 'Tailored tuxedo silhouette, deep emerald cotton velvet, tapered solid French beech legs.',
      basePrice: 3450,
      image: '/src/assets/images/homespirit_saint_germain_sofa_1792507865787.jpg',
      badge: 'Nouveauté',
    },
    {
      name: 'Belfort',
      origin: 'L’Héritage Architectural',
      tagline: 'Structured solid beechwood core, tailored track arms, museum proportions, and timeless poise.',
      basePrice: 3200,
      image: '/src/assets/images/hero_homesprit_living_1792504084898.jpg',
      badge: 'Classic Core',
    },
    {
      name: 'Capri',
      origin: 'La Méridienne Riviera & Modulaire',
      tagline: 'Low-slung Mediterranean profile, breathable summer flax, ultra-deep lounging chaise.',
      basePrice: 3600,
      image: '/src/assets/images/service_interior_craft_1792504085124.jpg',
      badge: 'Modulaire',
    },
  ];

  const sizes = [
    { label: '2-Seater (L 186 × D 102 cm)', priceOffset: -350, desc: 'Compact studio & sitting parlor' },
    { label: '3-Seater (L 216 × D 102 cm)', priceOffset: 0, desc: 'Most popular living room standard' },
    { label: '4-Seater Maxi (L 246 × D 102 cm)', priceOffset: 480, desc: 'Generous grand salon proportions' },
    { label: 'Corner Sectional + Chaise (L 290 × D 175 cm)', priceOffset: 1250, desc: 'Left or right chaise configuration' },
    { label: 'Canapé Convertible / Lit Rapido (140 cm Bed)', priceOffset: 890, desc: 'Built-in 14cm memory foam mattress for daily sleep' },
  ];

  const fabrics = [
    {
      name: 'Lin Lavé Français (Washed Linen)',
      desc: '100% Normandy flax, enzymatic pre-washed for organic drape, breathability, and lived-in softness.',
      badge: 'Eco-Certifié PEFC',
      priceOffset: 250,
    },
    {
      name: 'Velours Côtelé Royal (Cotton Velvet)',
      desc: 'Heavy Italian ribbed velvet with rich pile, deep light refraction, and stain-guard.',
      badge: 'Haute Densité',
      priceOffset: 320,
    },
    {
      name: 'Laine Bouclée Alpin (Alpine Bouclé)',
      desc: 'Textured bouclé wool blend, tactile warmth, sound-dampening architectural weave.',
      badge: 'Artisanal Tactile',
      priceOffset: 400,
    },
    {
      name: 'Coton Brut Tissé (Bio Natural Cotton)',
      desc: 'Sustainable unbleached natural cotton, high Martindale abrasion resistance (50,000 rubs).',
      badge: 'Résistance 50k',
      priceOffset: 0,
    },
    {
      name: 'Cuir Pleine Fleur Nappa (Full-Grain French Leather)',
      desc: 'Semi-aniline vegetable-tanned French leather, buttery soft finish, developing natural patina.',
      badge: 'Prestige Cuir',
      priceOffset: 1100,
    },
  ];

  const colors = [
    { name: 'Sable Écru (Natural Sand)', hex: '#E6DECE' },
    { name: 'Sauge Méditerranéenne (Sage)', hex: '#87977F' },
    { name: 'Vert Émeraude Profond (Forest Emerald)', hex: '#1E4B38' },
    { name: 'Terre Cuite (Terracotta)', hex: '#B26E54' },
    { name: 'Bleu Nuit Fumé (Night Blue)', hex: '#2A3442' },
    { name: 'Craie Blanche (Chalk Ivory)', hex: '#FAF7F2' },
    { name: 'Charbon Minéral (Mineral Slate)', hex: '#373A3E' },
  ];

  const showrooms = [
    {
      id: 'paris-stgermain',
      name: 'Showroom Paris Saint-Germain',
      country: 'france',
      city: 'Paris (6ème)',
      address: '42 Rue du Bac, 75007 Paris, France',
      phone: '+33 1 45 48 22 10',
      hours: 'Mon – Sat: 10:00 – 19:00',
      tag: 'Flagship Store',
      image: '/src/assets/images/homespirit_showroom_paris_1792507848811.jpg',
    },
    {
      id: 'lille-atelier',
      name: 'Atelier & Manufacture Historique',
      country: 'france',
      city: 'Neuville-en-Ferrain (Lille)',
      address: 'Zone Artisanale Les Marronniers, 59960 Neuville-en-Ferrain, France',
      phone: '+33 3 20 28 94 00',
      hours: 'Mon – Fri: 09:00 – 18:00 (By Appointment)',
      tag: 'Factory & Heritage Atelier',
      image: '/src/assets/images/homespirit_french_linen_sofa_1792507562168.jpg',
    },
    {
      id: 'lyon-presquile',
      name: 'Espace Home Spirit Lyon',
      country: 'france',
      city: 'Lyon (2ème)',
      address: '18 Rue Auguste Comte, 69002 Lyon, France',
      phone: '+33 4 78 37 12 90',
      hours: 'Tue – Sat: 10:30 – 19:00',
      tag: 'Partner Boutique',
      image: '/src/assets/images/homespirit_saint_germain_sofa_1792507865787.jpg',
    },
    {
      id: 'sf-presidio',
      name: 'Homesprit Design Gallery San Francisco',
      country: 'usa',
      city: 'San Francisco, CA',
      address: '384 Pacific Ave, Jackson Square, San Francisco, CA 94111',
      phone: '+1 (415) 890-4420',
      hours: 'Mon – Sat: 10:00 – 18:00',
      tag: 'North American Gallery',
      image: '/src/assets/images/hero_homesprit_living_1792504084898.jpg',
    },
    {
      id: 'ny-soho',
      name: 'Home Spirit Atelier New York',
      country: 'usa',
      city: 'New York, NY',
      address: '124 Greene St, SoHo, New York, NY 10012',
      phone: '+1 (212) 550-8190',
      hours: 'Mon – Sun: 11:00 – 19:00',
      tag: 'Design District Pavilion',
      image: '/src/assets/images/homespirit_showroom_paris_1792507848811.jpg',
    },
  ];

  const currentModelObj = models.find((m) => m.name === selectedModel) || models[0];
  const currentSizeObj = sizes.find((s) => s.label === selectedSize) || sizes[1];
  const currentFabricObj = fabrics.find((f) => f.name === selectedFabric) || fabrics[0];

  const calculatedPrice =
    currentModelObj.basePrice + currentSizeObj.priceOffset + currentFabricObj.priceOffset;
  const eurEquivalent = Math.round(calculatedPrice * 0.92);

  const handleInquireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onInquirePiece({
        model: selectedModel,
        size: selectedSize,
        fabric: selectedFabric,
        color: selectedColor,
        comfort: selectedComfort,
        slipcover: selectedSlipcover,
        stitching: selectedStitching,
        priceUsd: calculatedPrice,
      });
      setInquireSubmitted(true);
    } catch {
      setInquireSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSwatchLoading(true);
    try {
      await onOrderSwatches({
        name: swatchName,
        email: swatchEmail,
        phone: swatchPhone,
        address: swatchAddress,
        swatches: selectedSwatches,
      });
      setSwatchSubmitted(true);
    } catch {
      setSwatchSubmitted(true);
    } finally {
      setIsSwatchLoading(false);
    }
  };

  const toggleSwatchChoice = (swatch: string) => {
    if (selectedSwatches.includes(swatch)) {
      setSelectedSwatches(selectedSwatches.filter((s) => s !== swatch));
    } else if (selectedSwatches.length < 3) {
      setSelectedSwatches([...selectedSwatches, swatch]);
    }
  };

  const filteredShowrooms = showrooms.filter((s) => {
    if (selectedCityFilter === 'all') return true;
    return s.country === selectedCityFilter;
  });

  return (
    <section id="atelier" className="py-12 lg:py-20 bg-stone-50/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Banner: Inspired by Home Spirit France (homespirit.net) */}
        <div className="mb-10 p-4 sm:p-6 bg-white border border-neutral-200/90 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-serif text-lg font-bold shrink-0">
              HS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-neutral-950">Atelier Home Spirit France</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                  Fabricant Français depuis 1965
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-0.5">
                Customizable eco-responsible sofas, armchairs & daybeds crafted in Neuville-en-Ferrain. Direct integration with Homesprit architectural residences.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://www.homespirit.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>Visit Official HomeSpirit.net</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setIsSwatchModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Free Fabric Swatches</span>
            </button>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
              <span>Bespoke Living Collections & Custom Configurator</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950 text-balance">
              Design your tailor-made French linen & velvet sofa
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Personalize every detail: model silhouette, room dimensions, certified Normandy washed flax, goose down cushion density, and 100% removable slipcovers.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-600 shrink-0 bg-white px-4 py-2.5 rounded-xl border border-neutral-200">
            <div>
              <span className="font-bold text-neutral-950">500+</span> Fabrics
            </div>
            <span className="text-neutral-300">|</span>
            <div>
              <span className="font-bold text-neutral-950">10-Year</span> Frame Warranty
            </div>
            <span className="text-neutral-300">|</span>
            <div>
              <span className="font-bold text-emerald-700">100%</span> Made in France
            </div>
          </div>
        </div>

        {/* Main Configurator Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column (5 Cols): Live Visual Rendering & Price Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-md">
              <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
                <img
                  src={currentModelObj.image}
                  alt={currentModelObj.name}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-md flex items-center gap-1.5">
                  <span>Modèle {selectedModel}</span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-emerald-400 font-mono text-[10px]">{currentModelObj.badge}</span>
                </div>
                
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                  Neuville-en-Ferrain
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-neutral-200/80 flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <div className="font-bold text-neutral-900 line-clamp-1">{selectedFabric.split('(')[0]}</div>
                    <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                      <div 
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: colors.find(c => c.name === selectedColor)?.hex || '#E6DECE' }}
                      />
                      <span>{selectedColor.split('(')[0]}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-neutral-950 text-lg tabular-nums">
                      ${calculatedPrice.toLocaleString()} USD
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      ≈ €{eurEquivalent.toLocaleString()} EUR · Tax Included
                    </div>
                  </div>
                </div>
              </div>

              {/* Specification Breakdown Box */}
              <div className="p-5 space-y-2.5 text-xs">
                <div className="flex justify-between text-neutral-600 pb-2 border-b border-neutral-100">
                  <span>Silhouette & Model</span>
                  <span className="font-bold text-neutral-950">{selectedModel}</span>
                </div>
                <div className="flex justify-between text-neutral-600 pb-2 border-b border-neutral-100">
                  <span>Dimension & Format</span>
                  <span className="font-medium text-neutral-900 text-right">{selectedSize.split('(')[0]}</span>
                </div>
                <div className="flex justify-between text-neutral-600 pb-2 border-b border-neutral-100">
                  <span>Upholstery Material</span>
                  <span className="font-medium text-neutral-900">{selectedFabric.split('(')[0]}</span>
                </div>
                <div className="flex justify-between text-neutral-600 pb-2 border-b border-neutral-100">
                  <span>Colorway Palette</span>
                  <span className="font-medium text-neutral-900">{selectedColor.split('(')[0]}</span>
                </div>
                <div className="flex justify-between text-neutral-600 pb-2 border-b border-neutral-100">
                  <span>Comfort Core</span>
                  <span className="font-medium text-neutral-900">{selectedComfort.split('(')[0]}</span>
                </div>
                <div className="flex justify-between text-neutral-600 pb-2 border-b border-neutral-100">
                  <span>Slipcover Spec</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {selectedSlipcover.includes('Removable') ? '100% Déhoussable' : 'Tapissier Fixe'}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Stitching Finish</span>
                  <span className="font-medium text-neutral-900">{selectedStitching.split('(')[0]}</span>
                </div>

                {/* Lead time & Made in France trust */}
                <div className="mt-4 pt-3 border-t border-neutral-200/80 space-y-1.5 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-neutral-700 shrink-0" />
                    <span>Handmade to order in France · White-glove delivery in 4–6 weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>10-year warranty on solid beechwood frame & Nosags springs</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsConfigInquireModalOpen(true)}
                  className="w-full mt-3 py-3 px-4 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reserve & Inquire This Bespoke Piece</span>
                </button>
              </div>
            </div>

            {/* Fabric Swatches Showcase Box */}
            <div className="p-4 bg-white border border-neutral-200/90 rounded-2xl flex items-center gap-4 shadow-2xs">
              <img
                src="/src/assets/images/fabric_swatches_linen_velvet_1792507562317.jpg"
                alt="Fabric Swatches"
                className="w-20 h-20 rounded-xl object-cover border border-neutral-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="text-xs">
                <div className="font-bold text-neutral-950">Complimentary Swatches Kit</div>
                <p className="text-neutral-500 text-[11px] mt-0.5 leading-relaxed">
                  Touch Normandy flax, ribbed velvet, and tactile bouclé in your home lighting before finalizing.
                </p>
                <button
                  onClick={() => setIsSwatchModalOpen(true)}
                  className="mt-1.5 text-xs font-semibold text-neutral-900 underline hover:text-neutral-700 cursor-pointer"
                >
                  Order 3 Free Samples &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): The Configurator Controls */}
          <div className="lg:col-span-7 space-y-8 bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            
            {/* Step 1: Model Choice */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-neutral-950 text-white inline-flex items-center justify-center text-[10px]">1</span>
                  <span>Select Home Spirit Model</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">4 Handcrafted Silhouettes</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {models.map((mod) => (
                  <button
                    key={mod.name}
                    onClick={() => setSelectedModel(mod.name)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedModel === mod.name
                        ? 'border-neutral-950 bg-neutral-50/80 ring-1 ring-neutral-950 shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-950 text-sm">{mod.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                          {mod.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium mt-0.5">{mod.origin}</div>
                      <p className="text-[11px] text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                        {mod.tagline}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-500">Base configuration</span>
                      <span className="text-xs font-mono font-bold text-neutral-900 tabular-nums">
                        From ${mod.basePrice.toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Dimensions & Configuration */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-neutral-950 text-white inline-flex items-center justify-center text-[10px]">2</span>
                  <span>Modular Dimensions & Layout</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">Fixed & Convertible</span>
              </div>
              <div className="space-y-2">
                {sizes.map((sz) => (
                  <button
                    key={sz.label}
                    onClick={() => setSelectedSize(sz.label)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedSize === sz.label
                        ? 'border-neutral-950 bg-neutral-50/80 ring-1 ring-neutral-950'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-neutral-900">{sz.label}</div>
                      <div className="text-[11px] text-neutral-500">{sz.desc}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-neutral-900 tabular-nums">
                        {sz.priceOffset === 0 ? 'Baseline' : sz.priceOffset > 0 ? `+$${sz.priceOffset}` : `-$${Math.abs(sz.priceOffset)}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Fabric & Upholstery Selection */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-neutral-950 text-white inline-flex items-center justify-center text-[10px]">3</span>
                  <span>Select Fabric Material (French Weaves)</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">Normandy Flax & Velvets</span>
              </div>
              <div className="space-y-2.5">
                {fabrics.map((fab) => (
                  <div
                    key={fab.name}
                    onClick={() => setSelectedFabric(fab.name)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedFabric === fab.name
                        ? 'border-neutral-950 bg-neutral-50/80 ring-1 ring-neutral-950'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-950">{fab.name}</span>
                        <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-mono">
                          {fab.badge}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-600 leading-relaxed">{fab.desc}</p>
                    </div>
                    <div className="font-mono text-xs font-bold text-neutral-900 shrink-0 tabular-nums">
                      {fab.priceOffset > 0 ? `+$${fab.priceOffset}` : 'Included'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Color Swatches */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-neutral-950 text-white inline-flex items-center justify-center text-[10px]">4</span>
                  <span>Atelier Color Palette</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">Enzyme Washed Pigments</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                      selectedColor === c.name
                        ? 'border-neutral-950 bg-neutral-50/80 ring-1 ring-neutral-950 shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-black/15 shrink-0 shadow-2xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs font-medium text-neutral-800 line-clamp-1">
                      {c.name.split('(')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Comfort Cushion Core & Finishes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  Comfort Core Padding
                </label>
                <div className="space-y-2">
                  {[
                    'Plumes & Duvet (Plumtex Down Cloud)',
                    'Mousse HR Bultex 35kg/m³ (Firm Architectural)',
                  ].map((comf) => (
                    <button
                      key={comf}
                      onClick={() => setSelectedComfort(comf)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        selectedComfort === comf
                          ? 'border-neutral-950 bg-neutral-950 text-white font-semibold'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      {comf}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  Slipcover Configuration
                </label>
                <div className="space-y-2">
                  {[
                    'Entièrement Déhoussable (Removable Slipcover)',
                    'Tapissier Fixe (Fixed Tailored Upholstery)',
                  ].map((slip) => (
                    <button
                      key={slip}
                      onClick={() => setSelectedSlipcover(slip)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        selectedSlipcover === slip
                          ? 'border-neutral-950 bg-neutral-950 text-white font-semibold'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      {slip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 6: Stitching Finishes */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                Bespoke Stitching Detail
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Couture Passepoil (Piped Trim)',
                  'Couture Sellier (Saddle Stitch)',
                  'Piqué Bord à Bord (Clean Flange)',
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStitching(st)}
                    className={`p-2 rounded-lg border text-xs text-left cursor-pointer transition-colors ${
                      selectedStitching === st
                        ? 'border-neutral-950 bg-neutral-950 text-white font-semibold'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 3 Pillars of Home Spirit Craftsmanship */}
        <div className="mt-16 pt-12 border-t border-neutral-200/90 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div className="p-6 bg-white border border-neutral-200 rounded-2xl space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-bold">
              1965
            </div>
            <div className="font-bold text-sm text-neutral-950">100% Fabriqué en France</div>
            <p className="text-neutral-600 leading-relaxed">
              Every Home Spirit piece is manufactured in Neuville-en-Ferrain. Certified French beechwood frames, hand-assembled springs, and zero overseas outsourcing.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded-2xl space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-neutral-950">Éco-Conception & Pure Normandy Flax</div>
            <p className="text-neutral-600 leading-relaxed">
              PEFC-certified sustainably managed French timber, water-based glues with zero volatile organic compounds (VOC), and natural rain-fed linen flax.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded-2xl space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-neutral-950">Slipcovers Built for Life (Déhoussable)</div>
            <p className="text-neutral-600 leading-relaxed">
              Zipped slipcovers can be removed in under 10 minutes. Machine wash at home, dry-clean, or order a replacement seasonal slipcover in summer linen or winter velvet.
            </p>
          </div>
        </div>

        {/* SECTION: SHOWROOM LOCATOR (Trouver un Point de Vente / Showroom) */}
        <div id="showrooms" className="mt-16 pt-12 border-t border-neutral-200/90">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                Showrooms & Revendeurs Partenaires
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                Experience Home Spirit in our Flagship Galleries
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600">
                Test seating comfort, inspect all 500 fabric swatches, and speak with an interior architect in Paris, Lyon, Lille, or the United States.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-white border border-neutral-200 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setSelectedCityFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedCityFilter === 'all'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                All Showrooms
              </button>
              <button
                onClick={() => setSelectedCityFilter('france')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedCityFilter === 'france'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                France Flagships
              </button>
              <button
                onClick={() => setSelectedCityFilter('usa')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedCityFilter === 'usa'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                USA Galleries
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredShowrooms.map((sr) => (
              <div
                key={sr.id}
                className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
                    <img
                      src={sr.image}
                      alt={sr.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                      {sr.city}
                    </div>
                  </div>

                  <div className="p-5 space-y-2 text-xs">
                    <div className="text-[10px] uppercase font-mono font-bold text-neutral-400">
                      {sr.tag}
                    </div>
                    <div className="font-bold text-sm text-neutral-950">{sr.name}</div>
                    
                    <div className="pt-2 space-y-1.5 text-neutral-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                        <span>{sr.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="font-mono">{sr.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{sr.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      setInquireNotes(`Booking an appointment at ${sr.name} (${sr.city})`);
                      setIsConfigInquireModalOpen(true);
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors cursor-pointer text-center block"
                  >
                    Book Private Gallery Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL 1: Free Swatches Request */}
      {isSwatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-bold text-base text-neutral-950">
                  Request Free Fabric Swatches (Échantillons Gratuits)
                </h3>
                <div className="text-neutral-500 text-[11px]">Select up to 3 complimentary fabric samples delivered to your address</div>
              </div>
              <button 
                onClick={() => setIsSwatchModalOpen(false)} 
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {swatchSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="font-bold text-base text-neutral-950">Swatches Dispatched to Mail</div>
                <p className="text-neutral-600 max-w-xs mx-auto leading-relaxed">
                  Your curated swatch kit with Normandy linen, Italian velvet, and Alpine bouclé samples has been queued for shipment to <span className="font-semibold text-neutral-900">{swatchAddress}</span>.
                </p>
                <button
                  onClick={() => {
                    setSwatchSubmitted(false);
                    setIsSwatchModalOpen(false);
                  }}
                  className="px-5 py-2.5 bg-neutral-950 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSwatchSubmit} className="space-y-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Select 3 Swatches ({selectedSwatches.length}/3 selected)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Lin Lavé - Sable Écru',
                      'Lin Lavé - Blanc Craie',
                      'Velours Côtelé - Vert Émeraude',
                      'Velours Côtelé - Terre Cuite',
                      'Laine Bouclée - Craie Blanche',
                      'Coton Brut - Naturel',
                      'Cuir Pleine Fleur - Cognac',
                      'Lin Lavé - Sauge Méditerranéenne',
                    ].map((sw) => {
                      const isSel = selectedSwatches.includes(sw);
                      return (
                        <button
                          type="button"
                          key={sw}
                          onClick={() => toggleSwatchChoice(sw)}
                          className={`p-2 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between text-[11px] ${
                            isSel ? 'border-neutral-900 bg-neutral-50 font-semibold' : 'border-neutral-200 bg-white text-neutral-600'
                          }`}
                        >
                          <span className="truncate">{sw}</span>
                          {isSel && <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={swatchName}
                      onChange={(e) => setSwatchName(e.target.value)}
                      placeholder="e.g. Tasdid Anawaz"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={swatchPhone}
                      onChange={(e) => setSwatchPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={swatchEmail}
                    onChange={(e) => setSwatchEmail(e.target.value)}
                    placeholder="e.g. client@example.com"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Mailing Address (Home / Office)</label>
                  <textarea
                    rows={2}
                    required
                    value={swatchAddress}
                    onChange={(e) => setSwatchAddress(e.target.value)}
                    placeholder="Street address, city, state, zip code..."
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSwatchModalOpen(false)}
                    className="px-3.5 py-2 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSwatchLoading || selectedSwatches.length === 0}
                    className="px-4 py-2 bg-neutral-950 text-white rounded-lg font-semibold hover:bg-neutral-800 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSwatchLoading ? 'Processing...' : 'Ship Free Fabric Kit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Inquire Configured Sofa */}
      {isConfigInquireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-bold text-base text-neutral-950">
                  Reserve Bespoke Home Spirit Sofa
                </h3>
                <div className="text-neutral-500 text-[11px]">
                  Modèle {selectedModel} · {selectedFabric.split('(')[0]} · ${calculatedPrice.toLocaleString()} USD
                </div>
              </div>
              <button 
                onClick={() => setIsConfigInquireModalOpen(false)} 
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {inquireSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="font-bold text-base text-neutral-950">Bespoke Order Logged</div>
                <p className="text-neutral-600 max-w-xs mx-auto leading-relaxed">
                  Your piece configuration has been logged in our brokerage portfolio inquiries. A design concierge will review your fabric batch and contact you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setInquireSubmitted(false);
                    setIsConfigInquireModalOpen(false);
                  }}
                  className="px-5 py-2.5 bg-neutral-950 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquireSubmit} className="space-y-3">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                  <div className="font-bold text-neutral-900">Custom Configuration Summary:</div>
                  <div className="text-[11px] text-neutral-600">
                    {selectedModel} · {selectedSize.split('(')[0]} · {selectedFabric.split('(')[0]} ({selectedColor})
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    {selectedComfort.split('(')[0]} · {selectedSlipcover.split('(')[0]} · {selectedStitching.split('(')[0]}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-neutral-950 pt-1 flex justify-between">
                    <span>Quoted Price:</span>
                    <span>${calculatedPrice.toLocaleString()} USD (≈ €{eurEquivalent.toLocaleString()} EUR)</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={inquireName}
                    onChange={(e) => setInquireName(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={inquireEmail}
                      onChange={(e) => setInquireEmail(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={inquirePhone}
                      onChange={(e) => setInquirePhone(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Special Delivery / Placement Notes</label>
                  <textarea
                    rows={2}
                    value={inquireNotes}
                    onChange={(e) => setInquireNotes(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfigInquireModalOpen(false)}
                    className="px-3.5 py-2 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-neutral-950 text-white rounded-lg font-semibold hover:bg-neutral-800 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmitting ? 'Registering...' : 'Submit Bespoke Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
