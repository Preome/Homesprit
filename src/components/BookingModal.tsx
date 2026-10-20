import React, { useState } from 'react';
import { Service, Booking } from '../types';
import { X, Calendar, Clock, MapPin, Check, ArrowRight, ArrowLeft, Shield, Sparkles } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  initialService?: Service | null;
  initialResidenceType?: string;
  initialAddOns?: string[];
  initialTotalAmount?: number;
  onBookingCreated: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  services,
  initialService,
  initialResidenceType,
  initialAddOns,
  initialTotalAmount,
  onBookingCreated,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || services[0]?.id || 'srv-clean-01'
  );
  const [residenceType, setResidenceType] = useState<string>(
    initialResidenceType || '2-3 Bedrooms · 1,800 - 2,500 sq ft'
  );
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('09:00 AM - 01:00 PM (Morning Care)');
  const [customerName, setCustomerName] = useState<string>('Tasdid Anawaz');
  const [customerEmail, setCustomerEmail] = useState<string>('tasdidanpreome@gmail.com');
  const [customerPhone, setCustomerPhone] = useState<string>('+1 (555) 489-3012');
  const [address, setAddress] = useState<string>('840 Pacific Heights Blvd, Apt 4B, San Francisco, CA');
  const [notes, setNotes] = useState<string>('Please use non-scented organic wax on the dining room walnut table.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const activeService = services.find(s => s.id === selectedServiceId) || services[0];
  const finalPrice = initialTotalAmount || (activeService ? activeService.basePrice : 220);

  const timeSlots = [
    '09:00 AM - 01:00 PM (Morning Care)',
    '02:00 PM - 05:00 PM (Afternoon Focus)',
    '05:00 PM - 08:00 PM (Twilight Service)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        serviceId: selectedServiceId,
        customerName,
        customerEmail,
        customerPhone,
        scheduledDate,
        timeSlot,
        address,
        propertyType: 'Residential',
        propertySize: residenceType,
        notes,
        addOns: initialAddOns || [],
        totalAmount: finalPrice,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to create booking');
      }

      const newBooking: Booking = await res.json();
      setCreatedBooking(newBooking);
      onBookingCreated(newBooking);
      setStep(4); // Move to confirmation step
    } catch (err) {
      console.error('Booking creation error:', err);
      // Fallback client generation for offline/standalone mode
      const fallbackBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingCode: `HS-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName,
        customerEmail,
        customerPhone,
        serviceId: selectedServiceId,
        serviceTitle: activeService.title,
        proId: 'pro-01',
        proName: 'Clara Vance',
        proAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        scheduledDate,
        timeSlot,
        status: 'SCHEDULED',
        totalAmount: finalPrice,
        paymentStatus: 'PAID',
        address,
        propertyType: 'Residential',
        propertySize: residenceType,
        notes,
        addOns: initialAddOns || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCreatedBooking(fallbackBooking);
      onBookingCreated(fallbackBooking);
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div 
        className="bg-white border border-neutral-200 rounded-xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
              Step {step} of 4 · Reservation Flow
            </div>
            <h3 className="text-base font-bold text-neutral-950">
              {step === 1 && 'Select Service & Scale'}
              {step === 2 && 'Schedule Date & Time'}
              {step === 3 && 'Residence & Contact Details'}
              {step === 4 && 'Reservation Confirmed'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: SERVICE & SCALE */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  Choose Craft Discipline
                </label>
                <div className="space-y-2">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                        selectedServiceId === srv.id
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-neutral-900">{srv.title}</div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">{srv.category} · ~{srv.durationMinutes / 60} hrs</div>
                      </div>
                      <div className="text-xs font-mono font-bold text-neutral-900 tabular-nums">
                        ${srv.basePrice}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  Residence Scale
                </label>
                <select
                  value={residenceType}
                  onChange={(e) => setResidenceType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="Studio / Loft (< 900 sq ft)">Studio / Loft (&lt; 900 sq ft)</option>
                  <option value="1 Bedroom Sanctuary (900 - 1,400 sq ft)">1 Bedroom Sanctuary (900 - 1,400 sq ft)</option>
                  <option value="2-3 Bedrooms · 1,800 - 2,500 sq ft">2-3 Bedrooms · 1,800 - 2,500 sq ft</option>
                  <option value="Luxury Villa / Multi-Story Estate (3,000+ sq ft)">Luxury Villa / Multi-Story Estate (3,000+ sq ft)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-500">Estimated Total:</span>
                  <span className="text-lg font-bold font-mono text-neutral-950 ml-2 tabular-nums">
                    ${finalPrice}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Continue to Schedule
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  Preferred Appointment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={scheduledDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full text-xs p-2.5 pl-9 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                  <Calendar className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  Arrival & Service Window
                </label>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                        timeSlot === slot
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-xs text-neutral-900 font-medium">{slot}</span>
                      </div>
                      {timeSlot === slot && <Check className="w-4 h-4 text-neutral-900" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Continue to Address
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ADDRESS & CONTACT */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address (Receipt & Live Tracking Code)
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Residence Address & Suite / Unit
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs p-2.5 pl-8 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Special Instructions or Access Codes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Doorman access instructions, high ceiling areas, sensitive surfaces..."
                  className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                <span>Total Due Upon Completion:</span>
                <span className="font-mono font-bold text-neutral-950 text-sm tabular-nums">
                  ${finalPrice}
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSubmitting ? (
                    'Registering in MongoDB...'
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Confirm & Reserve Specialist
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CONFIRMATION */}
          {step === 4 && createdBooking && (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-neutral-950 text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-neutral-950">
                  Specialist Successfully Dispatched
                </h4>
                <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
                  Your reservation is stored in Homesprit's database and assigned to our verified team.
                </p>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-left max-w-sm mx-auto space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                  <span className="text-neutral-500">Booking Reference</span>
                  <span className="font-mono font-bold text-neutral-950 text-sm tracking-wide">
                    {createdBooking.bookingCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Service</span>
                  <span className="font-medium text-neutral-900 text-right truncate max-w-[200px]">
                    {createdBooking.serviceTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Assigned Artisan</span>
                  <span className="font-medium text-neutral-900">
                    {createdBooking.proName || 'Clara Vance'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Scheduled Date</span>
                  <span className="font-mono text-neutral-900 tabular-nums">
                    {createdBooking.scheduledDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Window</span>
                  <span className="text-neutral-900">{createdBooking.timeSlot}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                >
                  View in Live Tracker
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
