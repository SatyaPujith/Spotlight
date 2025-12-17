import { Business, IntelligenceType } from "../types";

// Response type from backend
interface YelpAIResponse {
  message: string;
  type: IntelligenceType;
  locationSummary?: any;
  businesses?: Business[];
  comparisonPoints?: any[];
  reservationDetails?: any;
}

// Fallback mock data when backend is unavailable
const generateMockBusinessData = (query: string): YelpAIResponse => {
  const mockBusinesses: Business[] = [
    {
      id: "mock_business_1",
      name: "Yelp's Top Rated Spot",
      category: "Restaurant",
      price: "$$",
      rating: 4.8,
      reviewCount: 342,
      address: "123 Main St, San Francisco, CA",
      hours: "Open until 10 PM",
      tags: ["Popular", "Highly Rated", "Great Service"],
      whyThisPlace: "This place stands out for its exceptional reviews and consistent quality.",
      highlight: "Top-rated on Yelp with 4.8 stars",
      imageUrl: "https://picsum.photos/400/300?random=1"
    }
  ];

  return {
    message: "Backend is currently unavailable. Please check your connection and try again.",
    type: IntelligenceType.Idle,
    businesses: mockBusinesses
  };
};

// --- Main Yelp AI Service Function ---
export const sendMessageToYelpAI = async (
  history: { role: string; text: string }[],
  newMessage: string
): Promise<YelpAIResponse> => {
  
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message: newMessage }),
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with ${response.status}`);
    }

    const data = await response.json();
    return data as YelpAIResponse;

  } catch (error) {
    console.error("Backend connection failed:", error);
    return generateMockBusinessData(newMessage);
  }
};

// Main export for Yelp AI integration
export default sendMessageToYelpAI;
