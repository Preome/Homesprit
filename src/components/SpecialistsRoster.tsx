import React from 'react';
import { Professional, Service } from '../types';
import { ShieldCheck, Star, Calendar, CheckCircle } from 'lucide-react';

interface SpecialistsRosterProps {
  professionals: Professional[];
  services: Service[];
  onBookWithPro: (pro: Professional) => void;
}

export const SpecialistsRoster: React.FC<SpecialistsRosterProps> = ({
  professionals,
  onBookWithPro,
}) => {
  return (
    <section id="specialists" className="py-16 lg:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
            Artisanal Guild
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Certified residential specialists & artisans
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Every Homesprit specialist undergoes multi-tier background vetting, insurance bond verification, and rigorous hands-on technique evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {professionals.map((pro) => (
            <div
              key={pro.id}
              className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-300 transition-colors"
            >
              <div>
                <div className="relative mb-4">
                  <img
                    src={pro.avatar}
                    alt={pro.name}
                    className="w-full aspect-square object-cover rounded-lg border border-neutral-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 right-2 bg-neutral-950/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1 tabular-nums">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {pro.rating}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-neutral-950">{pro.name}</h3>
                  <span title="Vetted & Insured" className="inline-flex">
                    <ShieldCheck className="w-4 h-4 text-neutral-900" />
                  </span>
                </div>
                <div className="text-xs text-neutral-500 font-medium">{pro.roleTitle}</div>

                <div className="mt-3 pt-3 border-t border-neutral-200/80 text-xs text-neutral-600 space-y-1">
                  <div className="line-clamp-2">{pro.bio}</div>
                </div>

                <div className="mt-3 text-[11px] text-neutral-500">
                  <span className="font-semibold text-neutral-700">Specialty: </span>
                  {pro.specialty}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                  <span>Completed Visits:</span>
                  <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                    {pro.completedJobs}
                  </span>
                </div>

                <button
                  onClick={() => onBookWithPro(pro)}
                  className="w-full py-2 px-3 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-neutral-700" />
                  Reserve with {pro.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
