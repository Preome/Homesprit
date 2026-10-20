import React from 'react';

interface FooterProps {
  onNavigateSection: (view: 'home' | 'properties' | 'about' | 'contact' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-12 text-xs text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-100">
          <div>
            <div className="text-base font-bold text-neutral-950 font-sans tracking-tight">
              homesprit
            </div>
            <p className="mt-1 text-xs text-neutral-500 max-w-sm">
              Architectural real estate brokerage, property management, and private residential acquisitions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <button
              onClick={() => onNavigateSection('home')}
              className="hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onNavigateSection('properties')}
              className="hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Properties
            </button>
            <button
              onClick={() => onNavigateSection('about')}
              className="hover:text-neutral-950 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => onNavigateSection('contact')}
              className="hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Contact
            </button>
            <button
              onClick={() => onNavigateSection('admin')}
              className="hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Admin Dashboard
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} Homesprit Real Estate Technologies. All rights reserved. Equal Housing Opportunity.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span>Broker Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
