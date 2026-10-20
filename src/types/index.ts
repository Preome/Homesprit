export type Role = 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN';

export type BookingStatus = 
  | 'SCHEDULED' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'QUALITY_CHECK' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: 'Cleaning' | 'Styling' | 'Smart Home' | 'Maintenance';
  tagline: string;
  description: string;
  detailedSpecs: string[];
  durationMinutes: number;
  basePrice: number;
  priceUnit: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  popular?: boolean;
}

export interface Professional {
  id: string;
  name: string;
  roleTitle: string;
  email: string;
  phone: string;
  specialty: string;
  rating: number;
  completedJobs: number;
  avatar: string;
  verified: boolean;
  bio: string;
  availability: 'Available' | 'On Assignment' | 'Off Duty';
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceTitle: string;
  proId?: string;
  proName?: string;
  proAvatar?: string;
  scheduledDate: string;
  timeSlot: string;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: 'PAID' | 'PENDING';
  address: string;
  propertyType: string;
  propertySize: string;
  notes?: string;
  addOns: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  serviceId: string;
  serviceName: string;
  userName: string;
  userLocation: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedBooking: boolean;
}

export interface DbStatus {
  connected: boolean;
  type: 'mongodb_atlas' | 'local_fallback';
  databaseName: string;
  cluster: string;
  user: string;
  host: string;
  collectionsCount?: {
    services: number;
    bookings: number;
    professionals: number;
    reviews: number;
  };
  maskedUri: string;
  message: string;
  latencyMs?: number;
}
