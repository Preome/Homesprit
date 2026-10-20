import React, { useState } from 'react';
import { Service } from '../types';
import { Star, Clock, ArrowUpRight } from 'lucide-react';

interface ServiceCatalogProps {
  services: Service[];
  onSelectService: (service: Service) => void;
  onBookService: (service: Service) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  services,
  onSelectService,
  onBookService,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Cleaning', 'Styling', 'Smart Home', 'Maintenance'];

  const filteredServices = activeCategory === 'All'
    ? services
    : services.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="services" className="py-16 lg:py-24 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
              Curated Offerings
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              Architectural services & residential crafts
            </h2>
          </div>

          {/* Segmented Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg shrink-0 self-start md:self-auto overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-neutral-950 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs hover:border-neutral-300 transition-all flex flex-col group"
            >
              {/* Image Container with 4:3 Aspect Ratio */}
              <div className="relative aspect-4/3 bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => onSelectService(service)}>
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-medium text-neutral-800">
                  {service.category}
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Unboxed Metadata Header */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                  <span className="flex items-center gap-1 text-neutral-800 font-medium font-mono tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                    {service.rating}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{service.reviewCount} client evaluations</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.round(service.durationMinutes / 60)} hrs
                  </span>
                </div>

                <h3
                  onClick={() => onSelectService(service)}
                  className="text-lg font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  {service.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                  {service.tagline}
                </p>

                {/* Detailed Spec Highlights */}
                <div className="mt-4 pt-4 border-t border-neutral-100 space-y-1.5 flex-1">
                  {service.detailedSpecs.slice(0, 2).map((spec, i) => (
                    <div key={i} className="text-xs text-neutral-500 flex items-start gap-1.5">
                      <span className="text-neutral-400 font-mono">―</span>
                      <span className="line-clamp-1">{spec}</span>
                    </div>
                  ))}
                </div>

                {/* Price and Actions Bottom Bar */}
                <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                      Starting Rate
                    </div>
                    <div className="text-lg font-bold font-mono text-neutral-950 tabular-nums">
                      ${service.basePrice}
                      <span className="text-xs font-normal text-neutral-500 ml-1">
                        / {service.priceUnit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectService(service)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
                    >
                      Specifications
                    </button>
                    <button
                      onClick={() => onBookService(service)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Book Now
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
