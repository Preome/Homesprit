import React, { useState, useMemo } from 'react';
import { Property, PropertyType, ListingType } from '../types/property';
import { Bed, Bath, Maximize2, MapPin, ArrowUpRight, Search, SlidersHorizontal, RefreshCw, Calendar, Sparkles } from 'lucide-react';

interface PropertyListingsProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onRequestViewing: (property: Property) => void;
  initialFilters?: {
    location?: string;
    type?: string;
    priceRange?: string;
    bedrooms?: string;
  };
}

export const PropertyListings: React.FC<PropertyListingsProps> = ({
  properties,
  onSelectProperty,
  onRequestViewing,
  initialFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters?.location || '');
  const [selectedType, setSelectedType] = useState<string>(initialFilters?.type || 'All');
  const [selectedListingType, setSelectedListingType] = useState<string>('All');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>(initialFilters?.bedrooms || 'Any');
  const [priceSort, setPriceSort] = useState<string>('newest');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.neighborhood.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (selectedType !== 'All') {
      result = result.filter((p) => p.type.toLowerCase() === selectedType.toLowerCase());
    }

    // Listing type
    if (selectedListingType !== 'All') {
      result = result.filter((p) => p.listingType.toLowerCase() === selectedListingType.toLowerCase());
    }

    // Bedrooms filter
    if (selectedBedrooms !== 'Any') {
      const minBeds = parseInt(selectedBedrooms, 10);
      if (!isNaN(minBeds)) {
        if (minBeds >= 4) {
          result = result.filter((p) => p.bedrooms >= 4);
        } else {
          result = result.filter((p) => p.bedrooms >= minBeds);
        }
      }
    }

    // City filter
    if (selectedCity !== 'All') {
      result = result.filter((p) => p.location.city.toLowerCase().includes(selectedCity.toLowerCase()));
    }

    // Sorting
    if (priceSort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (priceSort === 'area_desc') {
      result.sort((a, b) => b.areaSqFt - a.areaSqFt);
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [properties, searchTerm, selectedType, selectedListingType, selectedBedrooms, selectedCity, priceSort]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('All');
    setSelectedListingType('All');
    setSelectedBedrooms('Any');
    setSelectedCity('All');
    setPriceSort('newest');
  };

  const cities = ['All', 'San Francisco', 'Los Angeles', 'Marin County', 'San Jose', 'Palo Alto'];

  return (
    <section id="properties" className="py-14 lg:py-20 bg-stone-50/40 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">
              Curated Architectural Portfolio
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              Villas, sky penthouses & creative headquarters
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
              <span>{filteredProperties.length} active architectural residences</span>
              <span aria-hidden="true">·</span>
              <span>Direct owner representation</span>
              <span aria-hidden="true">·</span>
              <span>Updated in real time</span>
            </div>
          </div>

          {/* Quick Listing Type Segmented Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-200/70 rounded-lg shrink-0 self-start md:self-auto">
            {['All', 'Sale', 'Rent'].map((lt) => (
              <button
                key={lt}
                onClick={() => setSelectedListingType(lt)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  selectedListingType === lt
                    ? 'bg-white text-neutral-950 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {lt === 'All' ? 'All Portfolios' : `For ${lt}`}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 mb-10 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by neighborhood, street, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs py-2.5 pl-8 pr-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-950"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-3" />
            </div>

            {/* Property Type Dropdown */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-950"
              >
                <option value="All">All Categories (House, Apt, Commercial)</option>
                <option value="House">Houses & Luxury Villas</option>
                <option value="Apartment">Apartments & Penthouses</option>
                <option value="Commercial">Commercial Headquarters</option>
              </select>
            </div>

            {/* Location City Dropdown */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-950"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All California Regions' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms Dropdown */}
            <div>
              <select
                value={selectedBedrooms}
                onChange={(e) => setSelectedBedrooms(e.target.value)}
                className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-950"
              >
                <option value="Any">Any Bedroom Count</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>
          </div>

          {/* Sub-bar: Sorting & Reset */}
          <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-500">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <span>Sort by:</span>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="bg-transparent font-medium text-neutral-900 focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Newest Additions</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_desc">Living Area: Largest First</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-14 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-950">No matching residences found</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              We could not find active properties matching your current filter criteria. Broaden your location or category filters to explore available listings.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-950 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all flex flex-col group"
              >
                {/* 4:3 Image Container with Hover Zoom */}
                <div
                  className="relative aspect-4/3 bg-neutral-100 overflow-hidden cursor-pointer"
                  onClick={() => onSelectProperty(prop)}
                >
                  <img
                    src={prop.images[0] || '/images/villa_glass_architecture_1792504953976.jpg'}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-neutral-950/85 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                      For {prop.listingType}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                      {prop.type}
                    </span>
                  </div>

                  {prop.featured && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-neutral-950 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {/* Bottom Image Overlay with Price */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl px-3.5 py-2.5 flex items-baseline justify-between border border-neutral-200/80 shadow-xs">
                    <div className="font-mono font-bold text-neutral-950 text-base sm:text-lg tabular-nums">
                      ${prop.price.toLocaleString()}
                      {prop.priceUnit && (
                        <span className="text-xs font-normal text-neutral-500 ml-1">
                          {prop.priceUnit}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 tabular-nums">
                      {prop.areaSqFt.toLocaleString()} sq ft
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate font-medium text-neutral-600">
                        {prop.location.neighborhood}, {prop.location.city}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectProperty(prop)}
                      className="text-base font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors cursor-pointer line-clamp-1"
                    >
                      {prop.title}
                    </h3>

                    <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {prop.description}
                    </p>

                    {/* Architectural Specs Row */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-3 gap-2 text-xs text-neutral-600 text-center">
                      <div className="flex items-center justify-center gap-1.5 font-mono tabular-nums">
                        <Bed className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{prop.bedrooms > 0 ? `${prop.bedrooms} Beds` : 'Open'}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 font-mono tabular-nums border-x border-neutral-100">
                        <Bath className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{prop.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 font-mono tabular-nums">
                        <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{prop.areaSqFt.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onSelectProperty(prop)}
                      className="flex-1 py-2.5 px-3 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors text-center cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onRequestViewing(prop)}
                      className="flex-1 py-2.5 px-3 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-lg transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Schedule Visit</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
