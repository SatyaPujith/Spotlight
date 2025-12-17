import { Business } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// Get stored token
const getToken = (): string | null => {
  return localStorage.getItem('spotlight_token');
};

// Set token in localStorage
const setToken = (token: string): void => {
  localStorage.setItem('spotlight_token', token);
};

// Remove token from localStorage
const removeToken = (): void => {
  localStorage.removeItem('spotlight_token');
};

// API request helper with auth
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth functions
export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    setToken(response.token);
    return response;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    setToken(response.token);
    return response;
  },

  async getProfile(): Promise<{ user: AuthUser }> {
    return apiRequest('/auth/profile');
  },

  logout(): void {
    removeToken();
    localStorage.removeItem('spotlight_user');
    localStorage.removeItem('spotlight_sessions');
    localStorage.removeItem('spotlight_saved_businesses');
  },

  isAuthenticated(): boolean {
    return !!getToken();
  }
};

// Saved businesses functions
export const savedBusinessesService = {
  async getSavedBusinesses(): Promise<{ savedBusinesses: Business[] }> {
    return apiRequest('/saved-businesses');
  },

  async saveBusiness(business: Business): Promise<{ message: string }> {
    return apiRequest('/saved-businesses', {
      method: 'POST',
      body: JSON.stringify({ business }),
    });
  },

  async removeSavedBusiness(businessId: string): Promise<{ message: string }> {
    return apiRequest(`/saved-businesses/${businessId}`, {
      method: 'DELETE',
    });
  }
};