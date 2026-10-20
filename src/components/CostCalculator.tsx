import React, { useState } from 'react';
import { Service } from '../types';
import { Calculator, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CostCalculatorProps {
  services: Service[];
  onProceedToBooking: (config: {
    service: Service;
    residenceType: string;
    addOns: string[];
    totalAmount: number;
    frequency: string;
  }) => void;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({
  services,
  onProceedToBooking,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || 'srv-clean-01');
  const [residenceType, setResidenceType] = useState<string>('2-3 Bedrooms (1,800 - 2,500 sq ft)');
  const [frequency, setFrequency] = useState<string>('One-Time');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([
    'Interior Refrigerator Botanical Detox'
  ]);

  const residenceMultipliers: Record<string, number> = {
    'Studio / Loft (< 900 sq ft)': 0.85,
    '1 Bedroom Sanctuary (900 - 1,400 sq ft)': 0.95,
    '2-3 Bedrooms (1,800 - 2,500 sq ft)': 1.25,
    'Luxury Villa / Estate (3,000+ sq ft)': 1.75,
  };

  const addOnOptions = [
    { name: 'Interior Refrigerator Botanical Detox', price: 45, category: 'Cleaning' },
    { name: 'Architectural Chandelier & High-Ceiling Polish', price: 60, category: 'Cleaning' },
    { name: 'Artisan Floral & Ceramic Arrangement', price: 50, category: 'Styling' },
    { name: 'Smart Climate & Thermostat Multi-Zone Sync', price: 75, category: 'Smart Home' },
    { name: 'Precision Heavy Art Anchor Installation', price: 65, category: 'Maintenance' },
  ];

  const currentService = services.find(s => s.id === selectedServiceId) || services[0];
  const baseRate = currentService ? currentService.basePrice : 220;
  const multiplier = residenceMultipliers[residenceType] || 1.0;
  
  const baseAdjusted = Math.round(baseRate * multiplier);
  const addOnsTotal = selectedAddOns.reduce((sum, name) => {
    const item = addOnOptions.find(o => o.name === name);
    return sum + (item ? item.price : 0);
  }, 0);

  const subtotal = baseAdjusted + addOnsTotal;
  const discountMultiplier = frequency === 'Bi-Weekly (-15%)' ? 0.85 : frequency === 'Monthly (-10%)' ? 0.90 : 1.0;
  const finalEstimate = Math.round(subtotal * discountMultiplier);
  const savings = Math.round(subtotal - finalEstimate);

  const toggleAddOn = (name: string) => {
    if (selectedAddOns.includes(name)) {
      setSelectedAddOns(selectedAddOns.filter(a => a !== name));
    } else {
      setSelectedAddOns([...selectedAddOns, name]);
    }
  };

  const handleBookWithQuote = () => {
    if (!currentService) return;
    onProceedToBooking({
      service: currentService,
      residenceType,
      addOns: selectedAddOns,
      totalAmount: finalEstimate,
      frequency,
    });
  };

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2 flex items-center gap-2">
            <Calculator className="w-3.5 h-3.5" />
            Transparent Pricing Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Interactive residence cost estimator
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Configure your residence parameters, select specific craftsman add-ons, and calculate a guaranteed quote with no unexpected surcharges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Left Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Primary Service */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                1. Select Core Service Discipline
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedServiceId === srv.id
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-semibold text-neutral-950">{srv.title}</div>
                    <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                      <span>{srv.category}</span>
                      <span className="font-mono font-medium text-neutral-800 tabular-nums">
                        ${srv.basePrice} base
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Residence Sizing */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                2. Residence Scale & Layout
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.keys(residenceMultipliers).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResidenceType(res)}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      residenceType === res
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-medium text-neutral-900">{res}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {residenceMultipliers[res] === 1 ? 'Standard baseline' : `${Math.round(residenceMultipliers[res] * 100)}% scale ratio`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Add-on Crafts & Treatments */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                3. Optional Bespoke Add-ons
              </label>
              <div className="space-y-2">
                {addOnOptions.map((addon) => {
                  const isChecked = selectedAddOns.includes(addon.name);
                  return (
                    <div
                      key={addon.name}
                      onClick={() => toggleAddOn(addon.name)}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-neutral-900 bg-neutral-50/70'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-neutral-900 border-neutral-900 text-white'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs sm:text-sm text-neutral-800">{addon.name}</span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-neutral-900 tabular-nums">
                        +${addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Frequency Plan */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                4. Routine Care Frequency
              </label>
              <div className="flex flex-wrap gap-2">
                {['One-Time', 'Bi-Weekly (-15%)', 'Monthly (-10%)'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`px-4 py-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      frequency === freq
                        ? 'border-neutral-900 bg-neutral-900 text-white font-semibold'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Summary Card Right Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 shadow-xs">
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-4">
                Transparent Quote Summary
              </div>

              {/* Service title */}
              <div className="pb-4 border-b border-neutral-200">
                <div className="text-sm font-bold text-neutral-950">
                  {currentService?.title}
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  Scope: {residenceType}
                </div>
              </div>

              {/* Itemized Line Items */}
              <div className="py-4 border-b border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Base Scale Rate</span>
                  <span className="font-mono text-neutral-900 tabular-nums">
                    ${baseAdjusted}
                  </span>
                </div>

                {selectedAddOns.map((name) => {
                  const item = addOnOptions.find(o => o.name === name);
                  return (
                    <div key={name} className="flex justify-between text-neutral-600">
                      <span className="truncate pr-2">{name}</span>
                      <span className="font-mono text-neutral-900 shrink-0 tabular-nums">
                        +${item?.price}
                      </span>
                    </div>
                  );
                })}

                {savings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium pt-1">
                    <span>Routine Care Discount ({frequency})</span>
                    <span className="font-mono tabular-nums">-${savings}</span>
                  </div>
                )}
              </div>

              {/* Final Total */}
              <div className="pt-4 pb-6 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-neutral-500">Guaranteed Estimate</div>
                  <div className="text-[11px] text-neutral-400">Taxes & botanical supplies included</div>
                </div>
                <div className="text-3xl font-bold font-mono text-neutral-950 tabular-nums">
                  ${finalEstimate}
                </div>
              </div>

              {/* Booking CTA */}
              <button
                onClick={handleBookWithQuote}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Proceed to Book with this Quote
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                <span>Zero deposit required. Free cancellation up to 24h prior.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
