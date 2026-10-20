import React from 'react';
import { Service } from '../types';
import { X, Check, Clock, Shield, Star, Sparkles } from 'lucide-react';

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
  onBookNow: (service: Service) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onBookNow,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div 
        className="bg-white border border-neutral-200 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Media */}
        <div className="relative aspect-16/9 w-full bg-neutral-100 overflow-hidden">
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-neutral-900/70 hover:bg-neutral-900 text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 bg-neutral-950/80 backdrop-blur-xs px-3 py-1 rounded text-xs text-white">
            {service.category} Category
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <span className="flex items-center gap-1 text-neutral-800 font-semibold font-mono tabular-nums">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {service.rating}
            </span>
            <span>·</span>
            <span>{service.reviewCount} verified audits</span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Clock className="w-3.5 h-3.5 text-neutral-600" />
              {service.durationMinutes} minutes on-site
            </span>
          </div>

          <h3 className="text-2xl font-bold text-neutral-950">
            {service.title}
          </h3>

          <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
            {service.description}
          </p>

          {/* Detailed Specifications */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
              Standard Service Scope & Protocol
            </div>
            <div className="space-y-2.5">
              {service.detailedSpecs.map((spec, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                  <div className="w-4 h-4 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-neutral-900" />
                  </div>
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quality & Assurance */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200/80 flex items-start gap-3">
            <Shield className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-600">
              <span className="font-semibold text-neutral-900 block mb-0.5">
                Homesprit Certified Guarantee
              </span>
              Every assignment includes a signed quality report. If any detail fails your personal standard within 48 hours, our specialist will return for complimentary re-treatment.
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-neutral-500">Service Fee</div>
              <div className="text-xl font-bold font-mono text-neutral-950 tabular-nums">
                ${service.basePrice}{' '}
                <span className="text-xs font-normal text-neutral-500">
                  / {service.priceUnit}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClose();
                  onBookNow(service);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Schedule this Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
