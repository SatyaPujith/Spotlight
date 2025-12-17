export enum MessageRole {
  User = 'user',
  System = 'system',
  Assistant = 'model'
}

export enum IntelligenceType {
  Overview = 'overview',
  Comparison = 'comparison',
  Recommendation = 'recommendation',
  Reservation = 'reservation',
  Idle = 'idle'
}

export interface Business {
  id: string;
  name: string;
  category: string;
  price: string; // $, $$, $$$, $$$$
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  address: string;
  hours?: string; // e.g. "Open until 10:00 PM"
  tags: string[]; // e.g., "Cozy", "Date Night"
  whyThisPlace?: string; // AI generated explanation
  highlight?: string; // Short snippet
}

export interface LocationSummary {
  areaName: string;
  description: string;
  dominantCategories: string[];
  vibe: string; // e.g., "Lively", "Residential"
  averagePrice: string;
}

export interface ComparisonPoint {
  attribute: string;
  businessA: string; // Description for business A
  businessB: string; // Description for business B
  winnerId?: string; // Optional ID of the better one for this attribute
}

export interface IntelligenceData {
  type: IntelligenceType;
  locationSummary?: LocationSummary;
  businesses?: Business[];
  comparisonPoints?: ComparisonPoint[];
  reservationDetails?: {
    businessId: string;
    businessName: string;
    partySize: number;
    time: string;
    date: string;
    status: 'pending' | 'confirmed';
  };
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
  savedPlaces?: Business[]; // Added persistence for saved places
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  intelligence: IntelligenceData;
  lastUpdated: number;
}

export interface AppState {
  view: 'landing' | 'auth' | 'app'; // New view state
  user: User | null;
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  isSidebarOpen: boolean; // UI state for sidebar
  showProfile: boolean; // UI state for profile modal
  savedBusinesses: Business[]; // Local state for current user's saved items
}