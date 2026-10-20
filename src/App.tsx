import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroRealEstate } from './components/HeroRealEstate';
import { PropertyListings } from './components/PropertyListings';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AddEditPropertyModal } from './components/AddEditPropertyModal';
import { AtelierConfigurator } from './components/AtelierConfigurator';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LoginModal, AuthUser } from './components/LoginModal';

import { Property, Inquiry, AdminMetrics, InquiryStatus } from './types/property';
import { DbStatus } from './types';
import { INITIAL_PROPERTIES, INITIAL_INQUIRIES } from './data/initialProperties';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'properties' | 'atelier' | 'about' | 'contact' | 'admin'>('home');
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>({
    name: 'Tasdid Anawaz',
    email: 'tasdidanpreome@gmail.com',
    role: 'ADMIN',
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Modals state
  const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState<Property | null>(null);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);

  // Filters passed from Hero search to listings view
  const [activeFilters, setActiveFilters] = useState<{
    location?: string;
    type?: string;
    priceRange?: string;
    bedrooms?: string;
  }>({});

  // Fetch live properties, inquiries, and DB status
  const fetchAllData = async () => {
    try {
      const [propsRes, inqRes, dbRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/inquiries'),
        fetch('/api/db/status'),
      ]);

      if (propsRes.ok) setProperties(await propsRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (dbRes.ok) setDbStatus(await dbRes.json());
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleHeroSearch = (filters: {
    location?: string;
    type?: string;
    priceRange?: string;
    bedrooms?: string;
  }) => {
    setActiveFilters(filters);
    setActiveView('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProperty = async (propertyData: Partial<Property>) => {
    try {
      if (propertyToEdit) {
        // Edit
        const res = await fetch(`/api/properties/${propertyToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(propertyData),
        });
        if (res.ok) {
          const updated: Property = await res.json();
          setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }
      } else {
        // Create
        const res = await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(propertyData),
        });
        if (res.ok) {
          const created: Property = await res.json();
          setProperties((prev) => [created, ...prev]);
        }
      }
    } catch (err) {
      console.error(err);
      // Client optimistic fallback
      if (propertyToEdit) {
        setProperties((prev) =>
          prev.map((p) => (p.id === propertyToEdit.id ? ({ ...p, ...propertyData } as Property) : p))
        );
      } else {
        const dummy: Property = {
          id: `prop-${Date.now()}`,
          title: propertyData.title || 'Architectural Property',
          slug: (propertyData.title || 'prop').toLowerCase().replace(/\s+/g, '-'),
          type: propertyData.type || 'House',
          listingType: propertyData.listingType || 'Sale',
          price: propertyData.price || 2000000,
          location: propertyData.location || {
            address: '100 Ocean Ave',
            neighborhood: 'Seacliff',
            city: 'San Francisco, CA',
            zip: '94121',
          },
          bedrooms: propertyData.bedrooms || 3,
          bathrooms: propertyData.bathrooms || 2,
          areaSqFt: propertyData.areaSqFt || 2400,
          description: propertyData.description || 'Pristine architectural property.',
          amenities: propertyData.amenities || [],
          images: propertyData.images || ['/src/assets/images/villa_glass_architecture_1792504953976.jpg'],
          featured: Boolean(propertyData.featured),
          status: propertyData.status || 'Available',
          agent: properties[0]?.agent,
          yearBuilt: propertyData.yearBuilt || 2024,
          createdAt: new Date().toISOString(),
        };
        setProperties((prev) => [dummy, ...prev]);
      }
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    try {
      await fetch(`/api/properties/${propertyId}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleInquirySubmit = async (inquiryData: {
    propertyId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    preferredDate: string;
    preferredTime: string;
    message: string;
  }) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });
      if (res.ok) {
        const created: Inquiry = await res.json();
        setInquiries((prev) => [created, ...prev]);
      }
    } catch {
      const fallbackInq: Inquiry = {
        id: `inq-${Date.now()}`,
        propertyId: inquiryData.propertyId,
        propertyTitle: properties.find((p) => p.id === inquiryData.propertyId)?.title || 'Selected Property',
        customerName: inquiryData.customerName,
        customerEmail: inquiryData.customerEmail,
        customerPhone: inquiryData.customerPhone,
        preferredDate: inquiryData.preferredDate,
        preferredTime: inquiryData.preferredTime,
        message: inquiryData.message,
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      setInquiries((prev) => [fallbackInq, ...prev]);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId: string, status: InquiryStatus) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === inquiryId ? { ...i, status } : i))
    );
    try {
      await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleInquireAtelierPiece = async (configSummary: {
    model: string;
    size: string;
    fabric: string;
    color: string;
    comfort: string;
    slipcover: string;
    stitching: string;
    priceUsd: number;
  }) => {
    await handleInquirySubmit({
      propertyId: 'homespirit-piece',
      customerName: currentUser?.name || 'Private Collector',
      customerEmail: currentUser?.email || 'collector@example.com',
      customerPhone: '+1 (555) 019-2834',
      preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTime: '11:00 AM',
      message: `Bespoke Order: Home Spirit Modèle ${configSummary.model} · ${configSummary.size} · ${configSummary.fabric} (${configSummary.color}) · ${configSummary.comfort} · ${configSummary.slipcover} · ${configSummary.stitching} · Quoted Price: $${configSummary.priceUsd.toLocaleString()} USD`,
    });
  };

  const handleOrderSwatches = async (swatchData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    swatches: string[];
  }) => {
    await handleInquirySubmit({
      propertyId: 'homespirit-swatches',
      customerName: swatchData.name,
      customerEmail: swatchData.email,
      customerPhone: swatchData.phone,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: 'Priority Post',
      message: `Fabric Swatches Kit: ${swatchData.swatches.join(', ')} · Mailing Address: ${swatchData.address}`,
    });
  };

  const metrics: AdminMetrics = {
    totalProperties: properties.length,
    activeListings: properties.filter((p) => p.status === 'Available').length,
    totalInquiries: inquiries.length,
    portfolioValue: properties.reduce((sum, p) => sum + p.price, 0),
  };

  const featuredProperties = properties.filter((p) => p.featured);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        onChangeView={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroRealEstate
              onSearch={handleHeroSearch}
              onExploreProperties={() => {
                setActiveView('properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Featured Properties Showcase on Home */}
            <section className="py-20 bg-white border-b border-neutral-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">
                      Featured Portfolios
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950">
                      Trophy residences & architectural landmarks
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600">
                      Handpicked properties recognized for structural innovation, materiality, and panoramic viewpoints.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('properties');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-neutral-950 hover:text-neutral-700 underline cursor-pointer shrink-0"
                  >
                    View All {properties.length} Properties &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuredProperties.slice(0, 3).map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-neutral-300 transition-all flex flex-col group cursor-pointer"
                      onClick={() => setSelectedPropertyForDetails(prop)}
                    >
                      <div className="relative aspect-4/3 bg-neutral-100 overflow-hidden">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                          For {prop.listingType}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl px-3.5 py-2.5 flex items-baseline justify-between border border-neutral-200/80 shadow-xs">
                          <div className="font-mono font-bold text-neutral-950 text-base tabular-nums">
                            ${prop.price.toLocaleString()}
                          </div>
                          <div className="text-[11px] font-mono text-neutral-500 tabular-nums">
                            {prop.areaSqFt.toLocaleString()} sq ft
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="text-xs text-neutral-500 mb-1.5 font-medium">
                            {prop.location.neighborhood}, {prop.location.city}
                          </div>
                          <h3 className="font-bold text-neutral-950 text-base group-hover:text-neutral-700 transition-colors line-clamp-1">
                            {prop.title}
                          </h3>
                          <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                            {prop.description}
                          </p>
                        </div>

                        <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-xs">
                          <span className="font-mono text-neutral-600 tabular-nums">
                            {prop.bedrooms > 0 ? `${prop.bedrooms} Beds` : 'Open'} · {prop.bathrooms} Baths
                          </span>
                          <span className="font-semibold text-neutral-950 group-hover:translate-x-1 transition-transform">
                            View Residence &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Architectural Corridors Strip */}
            <section className="py-16 bg-stone-50/70 border-b border-neutral-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">
                  Regional Representation
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 mb-8">
                  California's Most Coveted Architectural Corridors
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      region: 'Bel-Air & Beverly Hills',
                      desc: 'Cantilevered glass pavilions, ocean horizons, and private canyon compounds.',
                      count: '2 Exclusive Estates',
                      loc: 'Bel-Air',
                    },
                    {
                      region: 'San Francisco Penthouse District',
                      desc: 'Panoramic skyline towers, historic plaster moldings, and private elevators.',
                      count: '2 Trophy Residences',
                      loc: 'San Francisco',
                    },
                    {
                      region: 'Marin County Redwoods',
                      desc: 'Organic cedar sanctuaries, native flagstone, and net-zero solar arrays.',
                      count: '1 Sanctuary Home',
                      loc: 'Marin County',
                    },
                    {
                      region: 'Silicon Valley Innovation Hub',
                      desc: 'Class-A commercial campuses, sunlit atriums, and creative production spaces.',
                      count: '2 Landmark Spaces',
                      loc: 'Palo Alto',
                    },
                  ].map((corridor) => (
                    <div
                      key={corridor.region}
                      onClick={() => handleHeroSearch({ location: corridor.loc })}
                      className="p-5 bg-white border border-neutral-200/90 rounded-xl hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-neutral-950 group-hover:text-neutral-700 transition-colors">
                          {corridor.region}
                        </div>
                        <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                          {corridor.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                        <span className="font-mono font-medium text-neutral-800">{corridor.count}</span>
                        <span className="font-semibold text-neutral-950 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Atelier Home Spirit France Showcase on Home */}
            <section className="py-20 bg-stone-100/60 border-b border-neutral-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">
                      <span className="w-2 h-2 rounded-full bg-amber-600 inline-block"></span>
                      <span>Atelier Home Spirit France · Fabricant depuis 1965</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950">
                      Bespoke French sofas & artisanal living interiors
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-2xl">
                      Every trophy residence curated by Homesprit is paired with custom upholstered seating from Home Spirit France. Tailor-made in Neuville-en-Ferrain with pure Normandy washed linen, Italian velvet, and sustainably sourced French beechwood.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('atelier');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-2"
                  >
                    <span>Launch Atelier Configurator</span>
                    <span>&rarr;</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Card 1: Biha Linen Icon */}
                  <div
                    onClick={() => {
                      setActiveView('atelier');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-neutral-300 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
                        <img
                          src="/src/assets/images/homespirit_french_linen_sofa_1792507562168.jpg"
                          alt="Biha Washed Linen Sofa"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                          Modèle Biha
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 flex items-center justify-between text-xs">
                          <span className="font-semibold text-neutral-900">100% Lin Lavé Français</span>
                          <span className="font-mono font-bold text-neutral-950">From $2,850</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-[10px] uppercase font-mono text-neutral-400 font-bold mb-1">
                          Normandy Flax Weave
                        </div>
                        <h3 className="font-bold text-neutral-950 text-base group-hover:text-neutral-700 transition-colors">
                          Biha Relaxed Washed Linen Sofa
                        </h3>
                        <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                          Oversized feather cushions, deep relaxed seat, exposed flange seams, and 100% removable slipcovers for machine washing.
                        </p>
                      </div>
                    </div>
                    <div className="p-6 pt-0 flex items-center justify-between text-xs font-semibold text-neutral-950 border-t border-neutral-100 mt-4">
                      <span>Customize Dimensions & Fabric</span>
                      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </div>
                  </div>

                  {/* Card 2: Saint-Germain Haussmann Velvet */}
                  <div
                    onClick={() => {
                      setActiveView('atelier');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-neutral-300 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
                        <img
                          src="/src/assets/images/homespirit_saint_germain_sofa_1792507865787.jpg"
                          alt="Saint-Germain Velvet Sofa"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                          Modèle Saint-Germain
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 flex items-center justify-between text-xs">
                          <span className="font-semibold text-neutral-900">Velours Côtelé Royal</span>
                          <span className="font-mono font-bold text-neutral-950">From $3,450</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-[10px] uppercase font-mono text-neutral-400 font-bold mb-1">
                          Parisian Haussmann Tailoring
                        </div>
                        <h3 className="font-bold text-neutral-950 text-base group-hover:text-neutral-700 transition-colors">
                          Saint-Germain Tuxedo Sofa
                        </h3>
                        <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                          Clean architectural profile, emerald green Italian cotton velvet, tapered French beech legs, and high-resilience comfort.
                        </p>
                      </div>
                    </div>
                    <div className="p-6 pt-0 flex items-center justify-between text-xs font-semibold text-neutral-950 border-t border-neutral-100 mt-4">
                      <span>Customize Dimensions & Fabric</span>
                      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </div>
                  </div>

                  {/* Card 3: Showroom & Complimentary Swatches */}
                  <div
                    onClick={() => {
                      setActiveView('atelier');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-neutral-300 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
                        <img
                          src="/src/assets/images/homespirit_showroom_paris_1792507848811.jpg"
                          alt="Showroom Boulevard Saint-Germain"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                          Flagship Showroom
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 flex items-center justify-between text-xs">
                          <span className="font-semibold text-neutral-900">Paris & San Francisco</span>
                          <span className="font-mono text-neutral-500">Free Fabric Kit</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-[10px] uppercase font-mono text-neutral-400 font-bold mb-1">
                          Private Atelier Visits
                        </div>
                        <h3 className="font-bold text-neutral-950 text-base group-hover:text-neutral-700 transition-colors">
                          Galleries & 500+ Swatch Kit
                        </h3>
                        <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                          Visit our gallery on Boulevard Saint-Germain Paris, or order 3 complimentary fabric samples delivered straight to your home.
                        </p>
                      </div>
                    </div>
                    <div className="p-6 pt-0 flex items-center justify-between text-xs font-semibold text-neutral-950 border-t border-neutral-100 mt-4">
                      <span>Order Free Swatches</span>
                      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <AboutSection />
            <ContactSection />
          </>
        )}

        {activeView === 'properties' && (
          <PropertyListings
            properties={properties}
            onSelectProperty={(prop) => setSelectedPropertyForDetails(prop)}
            onRequestViewing={(prop) => setSelectedPropertyForDetails(prop)}
            initialFilters={activeFilters}
          />
        )}

        {activeView === 'atelier' && (
          <AtelierConfigurator
            onInquirePiece={handleInquireAtelierPiece}
            onOrderSwatches={handleOrderSwatches}
          />
        )}

        {activeView === 'about' && (
          <>
            <AboutSection />
            <ContactSection />
          </>
        )}

        {activeView === 'contact' && <ContactSection />}

        {activeView === 'admin' && (
          <AdminDashboard
            properties={properties}
            inquiries={inquiries}
            metrics={metrics}
            onAddProperty={() => {
              setPropertyToEdit(null);
              setIsAddEditOpen(true);
            }}
            onEditProperty={(prop) => {
              setPropertyToEdit(prop);
              setIsAddEditOpen(true);
            }}
            onDeleteProperty={handleDeleteProperty}
            onUpdateInquiryStatus={handleUpdateInquiryStatus}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer
        onNavigateSection={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Property Modals */}
      <PropertyDetailsModal
        property={selectedPropertyForDetails}
        onClose={() => setSelectedPropertyForDetails(null)}
        onSubmitInquiry={handleInquirySubmit}
      />

      <AddEditPropertyModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        propertyToEdit={propertyToEdit}
        onSave={handleSaveProperty}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'ADMIN' || user.role === 'AGENT') {
            setActiveView('admin');
          }
        }}
      />
    </div>
  );
}
