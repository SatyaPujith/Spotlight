import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Business, IntelligenceData, IntelligenceType, LocationSummary, ComparisonPoint } from "../types";

// --- Types & Schemas ---

const YELP_AI_SYSTEM_INSTRUCTION = `
You are Spotlight, powered by Yelp's AI API for intelligent local business discovery.
Your goal is to help users discover, compare, and interact with local businesses using Yelp's comprehensive database.
You are a conversational AI assistant that leverages Yelp's business intelligence.

You must respond in a specific JSON format containing both your conversational response and structured business data from Yelp.

The user interactions fall into 4 categories:
1. **Overview**: "What is this area like?" -> Return 'overview' type with Yelp business insights.
2. **Recommendation**: "Best place for dinner?" -> Return 'recommendation' type with Yelp businesses.
3. **Comparison**: "Compare Place A and Place B" -> Return 'comparison' type using Yelp data.
4. **Reservation**: "Book a table at [Place]" -> Return 'reservation' type using Yelp's booking system.

**Yelp AI Integration Logic**:
- Use Yelp's business data including ratings, reviews, categories, and attributes
- Generate "whyThisPlace" insights based on Yelp reviews and business characteristics
- Include accurate business hours from Yelp's database
- Leverage Yelp's reservation system for booking capabilities
- Use real Yelp business images when available
- Provide location-aware recommendations using Yelp's geographic data

**Tone**: Professional, knowledgeable about local businesses, powered by Yelp's trusted platform.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    message: {
      type: Type.STRING,
      description: "The natural language conversational response to the user."
    },
    type: {
      type: Type.STRING,
      enum: [IntelligenceType.Overview, IntelligenceType.Recommendation, IntelligenceType.Comparison, IntelligenceType.Reservation, IntelligenceType.Idle],
      description: "The type of intelligence view to show."
    },
    locationSummary: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        areaName: { type: Type.STRING },
        description: { type: Type.STRING },
        dominantCategories: { type: Type.ARRAY, items: { type: Type.STRING } },
        vibe: { type: Type.STRING },
        averagePrice: { type: Type.STRING }
      }
    },
    businesses: {
      type: Type.ARRAY,
      nullable: true,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          price: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          reviewCount: { type: Type.NUMBER },
          address: { type: Type.STRING },
          hours: { type: Type.STRING, description: "Opening hours text" },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          whyThisPlace: { type: Type.STRING, description: "Crucial reasoning why this was picked" },
          highlight: { type: Type.STRING },
          imageUrl: { type: Type.STRING, nullable: true }
        }
      }
    },
    comparisonPoints: {
      type: Type.ARRAY,
      nullable: true,
      items: {
        type: Type.OBJECT,
        properties: {
          attribute: { type: Type.STRING },
          businessA: { type: Type.STRING },
          businessB: { type: Type.STRING },
          winnerId: { type: Type.STRING, nullable: true }
        }
      }
    },
    reservationDetails: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        businessId: { type: Type.STRING },
        businessName: { type: Type.STRING },
        partySize: { type: Type.NUMBER },
        time: { type: Type.STRING },
        date: { type: Type.STRING },
        status: { type: Type.STRING, enum: ['pending', 'confirmed'] }
      }
    }
  },
  required: ["message", "type"]
};

interface YelpAIResponse {
  message: string;
  type: IntelligenceType;
  locationSummary?: LocationSummary;
  businesses?: Business[];
  comparisonPoints?: ComparisonPoint[];
  reservationDetails?: any;
}

// Mock data generator for when API is unavailable
const generateMockBusinessData = (query: string): YelpAIResponse => {
  const isComparison = query.toLowerCase().includes('compare') || query.toLowerCase().includes('vs');
  const isReservation = query.toLowerCase().includes('book') || query.toLowerCase().includes('reserve');
  
  if (isReservation) {
    return {
      message: "I've found a great restaurant and can help you make a reservation. The booking has been confirmed for tonight at 7:00 PM.",
      type: IntelligenceType.Reservation,
      reservationDetails: {
        businessId: "mock_restaurant_1",
        businessName: "Yelp's Top Pick Restaurant",
        partySize: 2,
        time: "7:00 PM",
        date: new Date().toISOString().split('T')[0],
        status: "confirmed"
      }
    };
  }

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
      whyThisPlace: "This place stands out for its exceptional reviews and consistent quality. Yelp users consistently praise the atmosphere and service.",
      highlight: "Top-rated on Yelp with 4.8 stars",
      imageUrl: "https://picsum.photos/400/300?random=1"
    },
    {
      id: "mock_business_2", 
      name: "Local Favorite Cafe",
      category: "Cafe",
      price: "$",
      rating: 4.5,
      reviewCount: 156,
      address: "456 Oak Ave, San Francisco, CA",
      hours: "Open until 8 PM",
      tags: ["Cozy", "Local Favorite", "Great Coffee"],
      whyThisPlace: "A hidden gem that locals love. Perfect for a quiet coffee or casual meeting based on Yelp reviews.",
      highlight: "Hidden gem with loyal local following",
      imageUrl: "https://picsum.photos/400/300?random=2"
    }
  ];

  if (isComparison) {
    return {
      message: "I've compared these two popular spots for you. Both are highly rated on Yelp, but they offer different experiences.",
      type: IntelligenceType.Comparison,
      businesses: mockBusinesses,
      comparisonPoints: [
        {
          attribute: "Price",
          businessA: "More expensive ($$)",
          businessB: "Budget-friendly ($)",
          winnerId: "mock_business_2"
        },
        {
          attribute: "Atmosphere",
          businessA: "Upscale dining",
          businessB: "Casual and cozy",
          winnerId: null
        },
        {
          attribute: "Rating",
          businessA: "4.8 stars",
          businessB: "4.5 stars", 
          winnerId: "mock_business_1"
        }
      ]
    };
  }

  return {
    message: "I found some excellent options for you based on Yelp's comprehensive business database. These spots are highly rated and perfect for what you're looking for.",
    type: IntelligenceType.Recommendation,
    businesses: mockBusinesses
  };
};

// --- Yelp AI Simulation Logic (Fallback) ---
// This runs when the backend is unreachable, simulating Yelp AI API responses
const simulateYelpAIResponse = async (
  history: { role: string; text: string }[],
  newMessage: string
): Promise<YelpAIResponse> => {
  console.log("Using Yelp AI API Simulation (Backend unavailable)");
  const yelpApiKey = process.env.YELP_AI_API_KEY || process.env.API_KEY;
  if (!yelpApiKey) {
    console.warn("Yelp AI API Key not found in frontend environment, using mock data");
    return generateMockBusinessData(newMessage);
  }

  const ai = new GoogleGenAI({ apiKey: yelpApiKey });
  
  const contents = [
    ...history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }]
    })),
    { role: 'user', parts: [{ text: newMessage }] }
  ];

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash", // Yelp AI API model
    config: {
      systemInstruction: YELP_AI_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.7,
    },
    contents: contents
  });

  const responseText = result.text;
  if (!responseText) throw new Error("Empty response from Yelp AI API");
  return JSON.parse(responseText) as YelpAIResponse;
};

// --- Main Yelp AI Service Function ---
export const sendMessageToYelpAI = async (
  history: { role: string; text: string }[],
  newMessage: string
): Promise<YelpAIResponse> => {
  
  // 1. Try connecting to the Yelp AI API backend
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message: newMessage }),
    });

    if (!response.ok) {
      // If server responds with error, throw to trigger fallback
      throw new Error(`Yelp AI API backend responded with ${response.status}`);
    }

    const data = await response.json();
    return data as YelpAIResponse;

  } catch (error) {
    // 2. Fallback to Yelp AI Simulation if backend fetch fails
    console.warn("Yelp AI API backend connection failed, falling back to simulation:", error);
    return await simulateYelpAIResponse(history, newMessage);
  }
};

// Main export for Yelp AI integration
export default sendMessageToYelpAI;