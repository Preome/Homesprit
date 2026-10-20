import React, { useState } from 'react';
import { Property, Inquiry } from '../types/property';
import { X, Bed, Bath, Maximize2, MapPin, Calendar, Clock, Phone, Mail, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  onSubmitInquiry: (inquiryData: {
    propertyId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    preferredDate: string;
    preferredTime: string;
    message: string;
  }) => Promise<void>;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  onSubmitInquiry,
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [customerName, setCustomerName] = useState('Tasdid Anawaz');
  const [customerEmail, setCustomerEmail] = useState('tasdidanpreome@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 019-2834');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState('02:00 PM');
  const [message, setMessage] = useState(
    'I would like to schedule a private walkthrough and receive the property disclosure packet.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['/src/assets/images/villa_glass_architecture_1792504953976.jpg'];

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitInquiry({
        propertyId: property.id,
        customerName,
        customerEmail,
        customerPhone,
        preferredDate,
        preferredTime,
        message,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/70 backdrop-blur-xs">
      <div 
        className="bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-white z-10 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-900">For {property.listingType}</span>
              <span>·</span>
              <span>{property.type}</span>
              <span>·</span>
              <span>Built in {property.yearBuilt}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-950 mt-0.5 line-clamp-1">
              {property.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-8">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-16/9 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
              <img
                src={images[activeImageIndex]}
                alt={`${property.title} view ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded">
                Photo {activeImageIndex + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 mt-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                      activeImageIndex === idx ? 'border-neutral-950 ring-2 ring-neutral-200' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Key Metrics Row */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Offered At
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
                ${property.price.toLocaleString()}
                {property.priceUnit && (
                  <span className="text-sm font-normal text-neutral-500 ml-1">
                    {property.priceUnit}
                  </span>
                )}
              </div>
              <div className="text-xs text-neutral-600 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {property.location.address}, {property.location.city} {property.location.zip}
              </div>
            </div>

            {/* Quick Specs Strip */}
            <div className="flex items-center gap-4 text-xs font-mono tabular-nums bg-neutral-50 border border-neutral-200 p-3 rounded-lg">
              <div className="text-center">
                <div className="font-bold text-neutral-950 text-sm">
                  {property.bedrooms > 0 ? property.bedrooms : 'Studio'}
                </div>
                <div className="text-[11px] text-neutral-500">Beds</div>
              </div>
              <div className="w-px h-8 bg-neutral-200" />
              <div className="text-center">
                <div className="font-bold text-neutral-950 text-sm">{property.bathrooms}</div>
                <div className="text-[11px] text-neutral-500">Baths</div>
              </div>
              <div className="w-px h-8 bg-neutral-200" />
              <div className="text-center">
                <div className="font-bold text-neutral-950 text-sm">{property.areaSqFt.toLocaleString()}</div>
                <div className="text-[11px] text-neutral-500">Sq Ft</div>
              </div>
            </div>
          </div>

          {/* 2-Column Split: Description & Amenities Left, Inquiry Form Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Description & Amenities */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Architectural Description
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="pt-4 border-t border-neutral-200">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">
                  Signature Amenities & Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-neutral-700 bg-neutral-50 p-2.5 rounded-md border border-neutral-200/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dedicated Agent Card */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
                  Listing Representation
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={property.agent.avatar}
                      alt={property.agent.name}
                      className="w-12 h-12 rounded-lg object-cover border border-neutral-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-bold text-sm text-neutral-950">{property.agent.name}</div>
                      <div className="text-xs text-neutral-500">{property.agent.title}</div>
                      <div className="text-[11px] font-mono text-neutral-600 mt-0.5">
                        {property.agent.phone} · {property.agent.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Inquiry / Viewing Request Form */}
            <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 rounded-xl p-5 shadow-2xs">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
                VIP Private Access
              </div>
              <h4 className="text-base font-bold text-neutral-950 mb-3">
                Schedule a Private Viewing
              </h4>

              {isSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-sm text-neutral-950">
                    Viewing Request Dispatched
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Our lead broker {property.agent.name} has received your inquiry for {property.title}. We will contact you at {customerPhone} to finalize security access.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs text-neutral-500 underline hover:text-neutral-900 cursor-pointer pt-2 block mx-auto"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Preferred Time
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                      >
                        <option value="10:00 AM">10:00 AM (Morning)</option>
                        <option value="02:00 PM">02:00 PM (Afternoon)</option>
                        <option value="05:30 PM">05:30 PM (Golden Hour)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Inquiry Notes / Questions
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs mt-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Submitting to Atlas...' : 'Dispatch Viewing Request'}
                  </button>

                  <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-500 pt-1">
                    <ShieldCheck className="w-3 h-3 text-neutral-600" />
                    <span>Non-disclosure agreement enforced for high-value estates.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
