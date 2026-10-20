import React, { useState } from 'react';
import { Search, MapPin, Building, DollarSign, Bed, ArrowRight, ShieldCheck, Compass } from 'lucide-react';

interface HeroRealEstateProps {
  onSearch: (filters: {
    location?: string;
    type?: string;
    priceRange?: string;
    bedrooms?: string;
  }) => void;
  onExploreProperties: () => void;
}

export const HeroRealEstate: React.FC<HeroRealEstateProps> = ({
  onSearch,
  onExploreProperties,
}) => {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [bedrooms, setBedrooms] = useState('Any');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location: location.trim(),
      type: propertyType,
      priceRange,
      bedrooms,
    });
  };

  const handleQuickLocation = (loc: string) => {
    setLocation(loc);
    onSearch({
      location: loc,
      type: propertyType,
      priceRange,
      bedrooms,
    });
  };

  return (
    <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-28 bg-stone-50/60 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Grid: Value Proposition & Hero Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Architectural Kicker */}
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-4">
              <Compass className="w-3.5 h-3.5 text-neutral-700" />
              <span>Architectural Brokerage & Estates</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-neutral-950 leading-[1.1] text-balance">
              Where design integrity meets sanctuary.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl font-normal">
              Homesprit represents California’s most distinguished residential villas, sky penthouses, and design-forward commercial headquarters. Handcrafted architecture, curated for discerning collectors.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreProperties}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer group"
              >
                <span>Explore Current Portfolio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => handleQuickLocation('Pacific Heights')}
                className="px-5 py-3.5 text-xs sm:text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                Off-Market Collection
              </button>
            </div>

            {/* Quick Location Pills */}
            <div className="mt-8 flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
              <span className="font-medium text-neutral-700">Prime Locations:</span>
              {['Bel-Air', 'Pacific Heights', 'Mill Valley', 'Silicon Valley'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleQuickLocation(loc)}
                  className="hover:text-neutral-950 hover:underline transition-colors cursor-pointer"
                >
                  {loc} ·
                </button>
              ))}
            </div>
          </div>

          {/* Hero Visual Showcase with Floating Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200/90 bg-neutral-100 shadow-xl aspect-16/11 group">
              <img
                src="/images/villa_glass_architecture_1792504953976.jpg"
                alt="Architectural modern glass villa with infinity pool"
                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Floating Architectural Badge */}
              <div className="absolute top-4 left-4 bg-neutral-950/80 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-md">
                Trophy Property · Exclusive Representation
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-neutral-200/80 rounded-xl p-4 sm:p-5 flex items-center justify-between shadow-lg">
                <div>
                  <div className="font-bold text-neutral-950 text-sm sm:text-base">
                    The Bel-Air Horizon Glass Villa
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    1420 Bel-Air Crest Road · 5 Beds · 6 Baths · 6,850 sq ft
                  </div>
                </div>
                <div className="text-right pl-3 border-l border-neutral-200">
                  <div className="text-base sm:text-lg font-bold font-mono text-neutral-950 tabular-nums">
                    $8,950,000
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                    Available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Floating Property Search Bar */}
        <div className="mt-14 bg-white border border-neutral-200 rounded-2xl p-5 sm:p-7 shadow-lg">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4 flex items-center justify-between">
            <span>Find an Architectural Sanctuary</span>
            <span className="text-neutral-500 font-normal">Real-time availability</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Location */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-neutral-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                City or Neighborhood
              </label>
              <input
                type="text"
                placeholder="e.g. Bel-Air, San Francisco, Marin..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs p-3 bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-950 transition-colors"
              />
            </div>

            {/* 2. Property Type */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-neutral-700 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-neutral-400" />
                Category
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full text-xs p-3 bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-950 transition-colors"
              >
                <option value="All">All Categories</option>
                <option value="House">Houses & Luxury Villas</option>
                <option value="Apartment">Apartments & Penthouses</option>
                <option value="Commercial">Commercial Headquarters</option>
              </select>
            </div>

            {/* 3. Price Range */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-neutral-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                Price Bracket
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full text-xs p-3 bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-950 transition-colors"
              >
                <option value="All">Any Valuation</option>
                <option value="under_3m">Under $3,000,000</option>
                <option value="3m_to_6m">$3,000,000 - $6,000,000</option>
                <option value="over_6m">$6,000,000+</option>
                <option value="rent_under_10k">Lease: Under $10,000/mo</option>
              </select>
            </div>

            {/* 4. Bedrooms */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-neutral-700 flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-neutral-400" />
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full text-xs p-3 bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-950 transition-colors"
              >
                <option value="Any">Any Configuration</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>

            {/* 5. Search Action */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-3 px-5 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer h-11"
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </button>
            </div>
          </form>
        </div>

        {/* 4-Column Market Proof Strip */}
        <div className="mt-14 pt-8 border-t border-neutral-200/90 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              $148M+
            </div>
            <div className="text-xs text-neutral-500 mt-1">Exclusive Portfolio Represented</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              100%
            </div>
            <div className="text-xs text-neutral-500 mt-1">Direct Architect & Owner Representation</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              18 Days
            </div>
            <div className="text-xs text-neutral-500 mt-1">Average Time to Contract</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              24/7
            </div>
            <div className="text-xs text-neutral-500 mt-1">Private Client Concierge & Advisory</div>
          </div>
        </div>
      </div>
    </section>
  );
};
