import React, { useState, useEffect } from 'react';
import { Property, PropertyType, ListingType, PropertyStatus } from '../types/property';
import { X, Building, Check, Sparkles } from 'lucide-react';

interface AddEditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyToEdit: Property | null;
  onSave: (propertyData: Partial<Property>) => Promise<void>;
}

export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({
  isOpen,
  onClose,
  propertyToEdit,
  onSave,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(propertyToEdit?.title || '');
  const [type, setType] = useState<PropertyType>(propertyToEdit?.type || 'House');
  const [listingType, setListingType] = useState<ListingType>(propertyToEdit?.listingType || 'Sale');
  const [price, setPrice] = useState(propertyToEdit?.price || 1500000);
  const [priceUnit, setPriceUnit] = useState(propertyToEdit?.priceUnit || '');
  const [address, setAddress] = useState(propertyToEdit?.location.address || '');
  const [neighborhood, setNeighborhood] = useState(propertyToEdit?.location.neighborhood || '');
  const [city, setCity] = useState(propertyToEdit?.location.city || 'San Francisco, CA');
  const [zip, setZip] = useState(propertyToEdit?.location.zip || '94105');
  const [bedrooms, setBedrooms] = useState(propertyToEdit?.bedrooms ?? 3);
  const [bathrooms, setBathrooms] = useState(propertyToEdit?.bathrooms ?? 2.5);
  const [areaSqFt, setAreaSqFt] = useState(propertyToEdit?.areaSqFt ?? 2400);
  const [yearBuilt, setYearBuilt] = useState(propertyToEdit?.yearBuilt ?? 2024);
  const [description, setDescription] = useState(
    propertyToEdit?.description || 'Stunning architectural property featuring tailored finishes and natural light.'
  );
  const [amenitiesString, setAmenitiesString] = useState(
    propertyToEdit?.amenities.join(', ') || 'Smart Home Automation, Floor-to-Ceiling Windows, Heated Floors'
  );
  const [imageUrl, setImageUrl] = useState(
    propertyToEdit?.images[0] || '/src/assets/images/villa_glass_architecture_1792504953976.jpg'
  );
  const [featured, setFeatured] = useState(propertyToEdit?.featured || false);
  const [status, setStatus] = useState<PropertyStatus>(propertyToEdit?.status || 'Available');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presetImages = [
    { label: 'Glass Villa Exterior', url: '/src/assets/images/villa_glass_architecture_1792504953976.jpg' },
    { label: 'Skyline Penthouse', url: '/src/assets/images/penthouse_city_view_1792504953868.jpg' },
    { label: 'Cedar Suburban Residence', url: '/src/assets/images/modern_suburban_house_1792504955204.jpg' },
    { label: 'Modern Commercial Hub', url: '/src/assets/images/commercial_modern_building_1792504955712.jpg' },
    { label: 'Architectural Living Room', url: '/src/assets/images/hero_homesprit_living_1792504084898.jpg' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const amenities = amenitiesString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<Property> = {
      title,
      type,
      listingType,
      price: Number(price),
      priceUnit: listingType === 'Rent' ? (priceUnit || '/ month') : undefined,
      location: {
        address,
        neighborhood,
        city,
        zip,
      },
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqFt: Number(areaSqFt),
      yearBuilt: Number(yearBuilt),
      description,
      amenities,
      images: [imageUrl],
      featured,
      status,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div 
        className="bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950">
                {propertyToEdit ? 'Edit Property Listing' : 'Add New Property Listing'}
              </h3>
              <div className="text-xs text-neutral-500 font-mono">
                Homesprit Real Estate Portfolio Management
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Property Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Bel-Air Horizon Glass Villa"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Property Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              >
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Listing Type</label>
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value as ListingType)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              >
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              >
                <option value="Available">Available</option>
                <option value="Under Contract">Under Contract</option>
                <option value="Sold">Sold</option>
                <option value="Leased">Leased</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Price (USD)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md font-mono focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            {listingType === 'Rent' && (
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Price Unit</label>
                <input
                  type="text"
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  placeholder="e.g. / month"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 1420 Bel-Air Crest Road"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Neighborhood</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. Bel-Air"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">City & State</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min={0}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md font-mono focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Bathrooms</label>
              <input
                type="number"
                step="0.5"
                min={1}
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md font-mono focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Area (sq ft)</label>
              <input
                type="number"
                min={100}
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md font-mono focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Year Built</label>
              <input
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(Number(e.target.value))}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md font-mono focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              value={amenitiesString}
              onChange={(e) => setAmenitiesString(e.target.value)}
              placeholder="Private Pool, Wine Cellar, Smart Home Automation, EV Charging..."
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Select Property Image</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
              {presetImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setImageUrl(img.url)}
                  className={`relative aspect-4/3 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    imageUrl === img.url ? 'border-neutral-950 ring-2 ring-neutral-300' : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured-check"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <label htmlFor="featured-check" className="font-semibold text-neutral-900 cursor-pointer">
              Mark as Featured Trophy Property
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Saving to Database...' : propertyToEdit ? 'Save Changes' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
