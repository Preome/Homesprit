import React, { useState } from 'react';
import { Property, Inquiry, InquiryStatus, AdminMetrics } from '../types/property';
import { Plus, Edit2, Trash2, Building, MessageSquare, CheckCircle, Clock, DollarSign, Search, ShieldCheck } from 'lucide-react';

interface AdminDashboardProps {
  properties: Property[];
  inquiries: Inquiry[];
  metrics: AdminMetrics;
  onAddProperty: () => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (propertyId: string) => Promise<void>;
  onUpdateInquiryStatus: (inquiryId: string, status: InquiryStatus) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  inquiries,
  metrics,
  onAddProperty,
  onEditProperty,
  onDeleteProperty,
  onUpdateInquiryStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'inquiries'>('listings');
  const [propertySearch, setPropertySearch] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
    p.location.city.toLowerCase().includes(propertySearch.toLowerCase())
  );

  const filteredInquiries = inquiries.filter((inq) =>
    inq.customerName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
    inq.propertyTitle.toLowerCase().includes(inquirySearch.toLowerCase()) ||
    inq.customerEmail.toLowerCase().includes(inquirySearch.toLowerCase())
  );

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete listing "${title}"?`)) {
      setDeletingId(id);
      try {
        await onDeleteProperty(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <section className="py-10 lg:py-16 bg-neutral-50/50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
              Brokerage & Portfolio Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              Homesprit Admin Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600">
              Manage architectural listings, review customer private viewing requests, and monitor brokerage KPIs.
            </p>
          </div>

          <button
            onClick={onAddProperty}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Property Listing
          </button>
        </div>

        {/* 4 KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Total Properties
              </span>
              <Building className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              {metrics.totalProperties}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Managed across all categories</div>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Active Listings
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              {metrics.activeListings}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Available for sale / lease</div>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Customer Inquiries
              </span>
              <MessageSquare className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              {metrics.totalInquiries}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Viewing requests received</div>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Portfolio Volume
              </span>
              <DollarSign className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              ${(metrics.portfolioValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Aggregate represented value</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-neutral-200 mb-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-1 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'listings'
                ? 'border-neutral-950 text-neutral-950 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Property Listings ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 px-1 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'inquiries'
                ? 'border-neutral-950 text-neutral-950 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Customer Inquiries & Viewing Requests ({inquiries.length})
          </button>
        </div>

        {/* TAB 1: PROPERTY LISTINGS TABLE */}
        {activeTab === 'listings' && (
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
            {/* Search Header */}
            <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-sm w-full">
                <input
                  type="text"
                  placeholder="Filter listings by title or city..."
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                  className="w-full text-xs py-2 pl-8 pr-3 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              </div>

              <div className="text-xs text-neutral-500 font-mono tabular-nums">
                {filteredProperties.length} records shown
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Type / Market</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.images[0]}
                            alt=""
                            className="w-12 h-9 rounded object-cover border border-neutral-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-neutral-900">{prop.title}</div>
                            <div className="text-[11px] text-neutral-500">
                              {prop.bedrooms > 0 ? `${prop.bedrooms} Bed` : 'Studio'} · {prop.bathrooms} Bath · {prop.areaSqFt.toLocaleString()} sqft
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-700">
                        <span className="font-medium text-neutral-900">{prop.type}</span>
                        <div className="text-[11px] text-neutral-500">For {prop.listingType}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 tabular-nums">
                        ${prop.price.toLocaleString()}
                        {prop.priceUnit && (
                          <span className="text-[10px] font-normal text-neutral-500 block">
                            {prop.priceUnit}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600">
                        <div>{prop.location.city}</div>
                        <div className="text-[11px] text-neutral-400">{prop.location.neighborhood}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            prop.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEditProperty(prop)}
                            className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                            title="Edit Listing"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(prop.id, prop.title)}
                            disabled={deletingId === prop.id}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER INQUIRIES & VIEWINGS TABLE */}
        {activeTab === 'inquiries' && (
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
            {/* Search Header */}
            <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-sm w-full">
                <input
                  type="text"
                  placeholder="Filter inquiries by client, property, or email..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="w-full text-xs py-2 pl-8 pr-3 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              </div>

              <div className="text-xs text-neutral-500 font-mono tabular-nums">
                {filteredInquiries.length} total customer requests (Properties & Atelier Home Spirit)
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Client Contact</th>
                    <th className="py-3 px-4">Subject / Model</th>
                    <th className="py-3 px-4">Requested Window</th>
                    <th className="py-3 px-4">Message / Configuration Details</th>
                    <th className="py-3 px-4">Inquiry Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredInquiries.map((inq) => {
                    const isAtelier = inq.propertyId.includes('homespirit') || inq.propertyTitle.includes('Atelier') || inq.propertyTitle.includes('Swatches');
                    const isSwatch = inq.propertyId.includes('swatches') || inq.propertyTitle.includes('Swatches');

                    return (
                      <tr key={inq.id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-neutral-900">{inq.customerName}</div>
                          <div className="text-[11px] text-neutral-500">{inq.customerEmail}</div>
                          <div className="text-[11px] font-mono text-neutral-400">{inq.customerPhone}</div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-neutral-900 max-w-xs">
                          <div className="truncate">{inq.propertyTitle}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            {isSwatch ? (
                              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded font-mono font-medium">
                                Fabric Swatch Kit
                              </span>
                            ) : isAtelier ? (
                              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-mono font-medium">
                                Atelier Custom Sofa
                              </span>
                            ) : (
                              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded font-mono font-medium">
                                Real Estate Viewing
                              </span>
                            )}
                            <span className="text-[10px] text-neutral-400 font-mono">ID: {inq.propertyId}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-neutral-700 font-mono tabular-nums">
                          <div>{inq.preferredDate}</div>
                          <div className="text-[11px] text-neutral-500">{inq.preferredTime}</div>
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600 max-w-sm">
                          <div className="line-clamp-2 italic">"{inq.message}"</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={inq.status}
                            onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value as InquiryStatus)}
                            className={`text-xs p-1.5 rounded font-medium border cursor-pointer ${
                              inq.status === 'New'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : inq.status === 'Viewing Scheduled'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-neutral-100 text-neutral-800 border-neutral-300'
                            }`}
                          >
                            <option value="New">New Request</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Viewing Scheduled">Viewing / Order Scheduled</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
