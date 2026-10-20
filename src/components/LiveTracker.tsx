import React, { useState } from 'react';
import { Booking, BookingStatus, Professional } from '../types';
import { Search, CheckCircle2, Clock, MapPin, User, ShieldCheck, ArrowRight, Phone, MessageSquare } from 'lucide-react';

interface LiveTrackerProps {
  bookings: Booking[];
  professionals: Professional[];
  onUpdateStatus: (bookingId: string, nextStatus: BookingStatus) => void;
  activeRole: 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN';
}

export const LiveTracker: React.FC<LiveTrackerProps> = ({
  bookings,
  professionals,
  onUpdateStatus,
  activeRole,
}) => {
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    bookings[0]?.id || ''
  );
  const [searchCode, setSearchCode] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');

  const activeBooking = bookings.find(b => b.id === selectedBookingId) || bookings[0];

  const stages: { key: BookingStatus; label: string; desc: string }[] = [
    { key: 'SCHEDULED', label: '1. Scheduled', desc: 'Reserved in system' },
    { key: 'ASSIGNED', label: '2. Specialist Assigned', desc: 'Equipment prepared' },
    { key: 'IN_PROGRESS', label: '3. In Progress', desc: 'On-site care underway' },
    { key: 'QUALITY_CHECK', label: '4. Quality Inspection', desc: 'Surfaces audited' },
    { key: 'COMPLETED', label: '5. Completed', desc: 'Signed off & verified' },
  ];

  const getStageIndex = (status: BookingStatus) => {
    switch (status) {
      case 'SCHEDULED': return 0;
      case 'ASSIGNED': return 1;
      case 'IN_PROGRESS': return 2;
      case 'QUALITY_CHECK': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const currentStageIdx = activeBooking ? getStageIndex(activeBooking.status) : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const found = bookings.find(
      b => b.bookingCode.toLowerCase() === searchCode.trim().toLowerCase()
    );
    if (found) {
      setSelectedBookingId(found.id);
      setSearchCode('');
    } else {
      setSearchError(`No active reservation found for code "${searchCode}".`);
    }
  };

  const assignedPro = professionals.find(p => p.id === activeBooking?.proId) || professionals[0];

  const advanceNextStage = () => {
    if (!activeBooking) return;
    const stageOrder: BookingStatus[] = [
      'SCHEDULED',
      'ASSIGNED',
      'IN_PROGRESS',
      'QUALITY_CHECK',
      'COMPLETED',
    ];
    const currentIndex = stageOrder.indexOf(activeBooking.status);
    if (currentIndex < stageOrder.length - 1) {
      const next = stageOrder[currentIndex + 1];
      onUpdateStatus(activeBooking.id, next);
    }
  };

  const rollbackStage = () => {
    if (!activeBooking) return;
    const stageOrder: BookingStatus[] = [
      'SCHEDULED',
      'ASSIGNED',
      'IN_PROGRESS',
      'QUALITY_CHECK',
      'COMPLETED',
    ];
    const currentIndex = stageOrder.indexOf(activeBooking.status);
    if (currentIndex > 0) {
      const prev = stageOrder[currentIndex - 1];
      onUpdateStatus(activeBooking.id, prev);
    }
  };

  if (!activeBooking) {
    return (
      <section id="tracker" className="py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-neutral-500">No active reservations yet. Book your first service to track in real-time.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="tracker" className="py-16 lg:py-24 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Search bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
              Dispatch & Quality Oversight
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              Live sanctuary service tracker
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600">
              Real-time progress monitoring from dispatch to final botanical inspection sign-off.
            </p>
          </div>

          {/* Quick Lookup Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Code (e.g. HS-8924)..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full text-xs py-2 pl-8 pr-3 bg-white border border-neutral-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>
            <button
              type="submit"
              className="px-3 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors shrink-0 cursor-pointer"
            >
              Track
            </button>
          </form>
        </div>

        {searchError && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
            {searchError}
          </div>
        )}

        {/* Active Bookings Quick Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <span className="text-xs text-neutral-400 font-medium shrink-0 mr-1">
            Active Jobs:
          </span>
          {bookings.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBookingId(b.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors cursor-pointer shrink-0 ${
                activeBooking.id === b.id
                  ? 'border-neutral-900 bg-neutral-950 text-white font-semibold'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {b.bookingCode} · {b.serviceTitle.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Main Tracker Container */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-xs">
          {/* Header row with Code, Status, and Simulation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-neutral-950">
                  {activeBooking.bookingCode}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                  {activeBooking.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Client: {activeBooking.customerName} · Registered {new Date(activeBooking.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Assessment Simulation Controls */}
            <div className="flex items-center gap-2 bg-neutral-50 p-2 rounded-lg border border-neutral-200">
              <span className="text-[11px] text-neutral-500 font-medium hidden md:inline">
                Evaluation Stage Controls:
              </span>
              <button
                onClick={rollbackStage}
                disabled={currentStageIdx === 0}
                className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded hover:bg-neutral-50 disabled:opacity-40 cursor-pointer"
                title="Previous stage"
              >
                Previous Step
              </button>
              <button
                onClick={advanceNextStage}
                disabled={currentStageIdx === stages.length - 1}
                className="px-3 py-1 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded disabled:opacity-40 cursor-pointer flex items-center gap-1"
                title="Advance to next workflow stage"
              >
                Next Step
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-8">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {stages.map((stage, idx) => {
                const isPassed = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <div key={stage.key} className="flex flex-col relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                          isCurrent
                            ? 'bg-neutral-950 text-white ring-4 ring-neutral-200'
                            : isPassed
                            ? 'bg-neutral-800 text-white'
                            : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4 text-white" /> : idx + 1}
                      </div>
                      <div className="h-0.5 flex-1 bg-neutral-200 hidden sm:block">
                        <div
                          className={`h-full ${
                            isPassed || isCurrent ? 'bg-neutral-950' : 'bg-transparent'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="text-xs font-bold text-neutral-950">{stage.label}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{stage.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2-Column Split: Assigned Specialist Left, Reservation Parameters Right */}
          <div className="pt-6 border-t border-neutral-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Specialist Card */}
            <div className="lg:col-span-5 bg-neutral-50 rounded-xl p-5 border border-neutral-200">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-3">
                Assigned Residential Artisan
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={assignedPro.avatar}
                  alt={assignedPro.name}
                  className="w-14 h-14 rounded-lg object-cover border border-neutral-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-neutral-950">{assignedPro.name}</h4>
                    <ShieldCheck className="w-4 h-4 text-neutral-900" />
                  </div>
                  <div className="text-xs text-neutral-600">{assignedPro.roleTitle}</div>
                  <div className="text-xs text-neutral-500 font-mono mt-0.5 tabular-nums">
                    ★ {assignedPro.rating} · {assignedPro.completedJobs} visits completed
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-neutral-600 leading-relaxed border-t border-neutral-200/60 pt-3">
                "{assignedPro.bio}"
              </p>

              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center gap-2">
                <a
                  href={`tel:${assignedPro.phone}`}
                  className="flex-1 py-1.5 px-3 text-center text-xs font-medium bg-white border border-neutral-200 rounded-md text-neutral-800 hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-600" />
                  Call Pro
                </a>
                <button
                  onClick={() => alert(`Direct concierge channel opened for booking ${activeBooking.bookingCode}`)}
                  className="flex-1 py-1.5 px-3 text-center text-xs font-medium bg-neutral-900 rounded-md text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Message
                </button>
              </div>
            </div>

            {/* Reservation Specs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                Service Order Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="text-neutral-500 mb-0.5">Discipline & Package</div>
                  <div className="font-semibold text-neutral-900">{activeBooking.serviceTitle}</div>
                  <div className="text-neutral-500 mt-1">Scale: {activeBooking.propertySize}</div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="text-neutral-500 mb-0.5">Time & Window</div>
                  <div className="font-mono font-semibold text-neutral-900 tabular-nums">
                    {activeBooking.scheduledDate}
                  </div>
                  <div className="text-neutral-600 mt-1">{activeBooking.timeSlot}</div>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-neutral-900">Residence Address</div>
                    <div className="text-neutral-600 mt-0.5">{activeBooking.address}</div>
                    {activeBooking.notes && (
                      <div className="mt-2 text-neutral-500 italic">
                        Note: "{activeBooking.notes}"
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {activeBooking.addOns && activeBooking.addOns.length > 0 && (
                <div className="text-xs">
                  <span className="text-neutral-500 font-medium">Included Add-ons: </span>
                  <span className="text-neutral-800">{activeBooking.addOns.join(', ')}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs border-t border-neutral-100">
                <span className="text-neutral-500">Service Fee (All inclusive):</span>
                <span className="text-base font-bold font-mono text-neutral-950 tabular-nums">
                  ${activeBooking.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
