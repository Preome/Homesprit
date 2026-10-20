import React from 'react';
import { ShieldCheck, Award, Building2, Users } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
            About Homesprit
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            A new standard in architectural real estate
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Founded with the belief that a home is more than square footage, Homesprit represents residences designed with spatial integrity, natural light, and structural permanence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-950">Curated Architecture Only</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We exclusively represent residences and commercial spaces crafted by leading architectural studios, featuring exceptional materiality, environmental performance, and timeless aesthetics.
            </p>
          </div>

          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-950">Absolute Privacy & Trust</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every client engagement is managed under strict confidentiality. Our private viewing protocols protect buyer privacy while ensuring transparent property disclosure packets.
            </p>
          </div>

          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-950">End-to-End Asset Care</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Beyond brokerage representation, Homesprit offers ongoing property management, preventive systems diagnostics, and concierge services to maintain asset value indefinitely.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
