import React from 'react';
import { ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onNavigateSection: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onNavigateSection }) => {
  return (
    <section id="hero" className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Grid: Value Proposition Left, Pristine Interior Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-3">
              Residential Concierge & On-Demand Care
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.15] text-balance">
              Uncompromising care for the modern sanctuary.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl">
              Bespoke deep sanitization, architectural spatial styling, precision carpentry, and intelligent climate diagnostics. Delivered on-demand by certified residential artisans.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-5 py-3 text-sm font-semibold text-white bg-neutral-950 rounded-md hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                Book a Specialist
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateSection('calculator')}
                className="px-5 py-3 text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-neutral-600" />
                Estimate Residence Cost
              </button>
            </div>

            {/* Quiet feature bullets */}
            <div className="mt-10 pt-6 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-800 shrink-0" />
                <span>100% background-checked & insured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-800 shrink-0" />
                <span>Hospital-grade plant botanicals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-800 shrink-0" />
                <span>Real-time status tracking & dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-800 shrink-0" />
                <span>Guaranteed quality inspection sign-off</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Asset */}
          <div className="lg:col-span-6">
            <div className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm aspect-16/10">
              <img
                src="/src/assets/images/hero_homesprit_living_1792504084898.jpg"
                alt="Minimalist sunlit architectural living room with natural oak finishes"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-neutral-200/80 rounded-lg p-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-neutral-900">Pacific Heights Residence</div>
                  <div className="text-neutral-500">Post-restoration inspection complete</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-neutral-900 tabular-nums">4.98 Rating</div>
                  <div className="text-neutral-500">Care Specialist: Clara V.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Metrics Strip */}
        <div className="mt-14 pt-8 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              4.96
            </div>
            <div className="text-xs text-neutral-500 mt-1">Average verified client rating</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              1,280+
            </div>
            <div className="text-xs text-neutral-500 mt-1">Sanctuary visits completed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              100%
            </div>
            <div className="text-xs text-neutral-500 mt-1">Vetted & licensed technicians</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              &lt; 60s
            </div>
            <div className="text-xs text-neutral-500 mt-1">Instant digital scheduling</div>
          </div>
        </div>
      </div>
    </section>
  );
};
