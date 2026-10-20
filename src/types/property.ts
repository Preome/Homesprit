export type PropertyType = 'House' | 'Apartment' | 'Commercial';
export type ListingType = 'Sale' | 'Rent';
export type PropertyStatus = 'Available' | 'Under Contract' | 'Sold' | 'Leased';

export interface PropertyLocation {
  address: string;
  neighborhood: string;
  city: string;
  zip: string;
}

export interface AgentContact {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  type: PropertyType;
  listingType: ListingType;
  price: number;
  priceUnit?: string; // e.g. "/ month" for rent
  location: PropertyLocation;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  description: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  status: PropertyStatus;
  agent: AgentContact;
  yearBuilt: number;
  createdAt: string;
}

export type InquiryStatus = 'New' | 'Contacted' | 'Viewing Scheduled' | 'Archived';

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface AdminMetrics {
  totalProperties: number;
  activeListings: number;
  totalInquiries: number;
  portfolioValue: number;
}
