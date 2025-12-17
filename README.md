# Spotlight

**AI-Powered Local Business Discovery Platform**

Spotlight is a next-generation conversational AI platform that transforms how people discover, compare, and interact with local businesses. Powered by Yelp's AI API, Spotlight delivers intelligent, context-aware recommendations through natural language conversations.

---

## Overview

Spotlight reimagines local business discovery by combining the power of conversational AI with Yelp's comprehensive business database. Instead of scrolling through endless search results, users simply describe what they're looking for in natural language, and Spotlight's AI delivers personalized, intelligent recommendations.

### The Problem
Traditional business search requires users to:
- Navigate complex filter systems
- Browse through dozens of results
- Manually compare businesses
- Switch between multiple apps for reservations

### The Solution
Spotlight provides:
- **Natural Language Interface**: Ask questions like you would ask a friend
- **Intelligent Recommendations**: AI understands context and intent
- **Seamless Reservations**: Book directly without leaving the app
- **Smart Comparisons**: Data-driven business analysis

---

## Features

### � Cmonversational Discovery
Transform how you find local businesses with natural language queries.

```
"Find a quiet coffee shop for working in downtown"
"What's the best Italian restaurant near me?"
"I need a gym with good reviews and flexible hours"
```

The AI understands nuanced requests and delivers relevant results.

### 🤖 Intelligent Recommendations
Every recommendation comes with AI-generated insights:
- **Why This Place**: Personalized explanation of why each business matches your needs
- **Highlight Features**: Key attributes that stand out
- **Context Awareness**: Recommendations adapt to time, occasion, and preferences

### 📊 Smart Business Comparisons
Make informed decisions with side-by-side analysis:
- Multi-attribute comparison across businesses
- AI-powered winner determination
- Detailed breakdown of strengths and trade-offs

### 🍽️ Integrated Reservations
Seamless booking experience:
- Real-time availability checking
- Instant confirmation
- Support for thousands of restaurants across US & Canada
- Full reservation lifecycle management

### 👤 Personalized Profiles
Build your local discovery history:
- Save favorite businesses
- Track recommendation history
- Personalized suggestions based on preferences
- Secure authentication with JWT

### 🌍 Location Intelligence
Smart geographic handling:
- Accurate market coverage representation
- Location-aware recommendations
- Support for US and Canadian markets
- Clear communication for coverage boundaries

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   React App     │  │   Mobile Web    │                  │
│  │   (TypeScript)  │  │   (Responsive)  │                  │
│  └────────┬────────┘  └────────┬────────┘                  │
└───────────┼─────────────────────┼───────────────────────────┘
            │                     │
            ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Express.js Server                       │   │
│  │  • Authentication Middleware                         │   │
│  │  • Request Validation                                │   │
│  │  • Response Caching                                  │   │
│  │  • Rate Limiting                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
            │                     │
            ▼                     ▼
┌─────────────────────┐  ┌─────────────────────┐
│   Yelp AI API       │  │   MongoDB Atlas     │
│   • Business Data   │  │   • User Profiles   │
│   • AI Processing   │  │   • Saved Places    │
│   • Reservations    │  │   • Session Data    │
└─────────────────────┘  └─────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 + TypeScript | Modern, type-safe UI |
| Styling | Tailwind CSS | Responsive design system |
| Build | Vite | Fast development and bundling |
| Backend | Node.js + Express | RESTful API server |
| AI Engine | Yelp AI API | Business intelligence |
| Database | MongoDB Atlas | Persistent data storage |
| Auth | JWT + bcrypt | Secure authentication |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account
- Yelp AI API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spotlight
   ```

2. **Install dependencies**
   
   Frontend:
   ```bash
   npm install
   ```
   
   Backend:
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Configure environment variables**
   
   Create `.env` in the project root:
   ```env
   VITE_API_URL=http://localhost:3001
   YELP_AI_API_KEY=your_yelp_ai_api_key
   YELP_CLIENT_ID=your_yelp_client_id
   ```
   
   Create `server/.env` in the server folder:
   ```env
   YELP_AI_API_KEY=your_yelp_ai_api_key
   YELP_CLIENT_ID=your_yelp_client_id
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/spotlight
   JWT_SECRET=your_secure_jwt_secret_key
   PORT=3001
   ```

4. **Start development servers**
   
   Terminal 1 - Backend:
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 - Frontend:
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`

---

## API Reference

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

### Business Discovery

#### Chat with AI
```http
POST /api/chat
Content-Type: application/json
Authorization: Bearer <token>

{
  "history": [],
  "message": "Find the best sushi in San Francisco"
}
```

**Response:**
```json
{
  "message": "Here are the top sushi restaurants in San Francisco...",
  "type": "recommendation",
  "businesses": [
    {
      "id": "business_id",
      "name": "Sushi Master",
      "category": "Japanese",
      "rating": 4.8,
      "reviewCount": 342,
      "price": "$$$",
      "address": "123 Main St, San Francisco, CA",
      "whyThisPlace": "Known for exceptional omakase...",
      "imageUrl": "https://..."
    }
  ]
}
```

### Saved Businesses

#### Get Saved Businesses
```http
GET /api/saved-businesses
Authorization: Bearer <token>
```

#### Save a Business
```http
POST /api/saved-businesses
Content-Type: application/json
Authorization: Bearer <token>

{
  "business": {
    "id": "business_id",
    "name": "Business Name",
    ...
  }
}
```

#### Remove Saved Business
```http
DELETE /api/saved-businesses/:businessId
Authorization: Bearer <token>
```

---

## Project Structure

```
spotlight/
├── server/                     # Backend (Node.js + Express)
│   ├── index.js               # Express server with Yelp AI API
│   ├── database.js            # MongoDB operations
│   ├── package.json           # Backend dependencies
│   └── .env                   # Backend environment variables
│
├── components/                 # React components
│   ├── IntelligencePanel.tsx  # Business display panel
│   └── MessageBubble.tsx      # Chat message component
│
├── services/                   # Frontend services
│   ├── yelpAIService.ts       # Yelp AI API integration
│   └── authService.ts         # Authentication service
│
├── App.tsx                     # Main React application
├── types.ts                    # TypeScript definitions
├── index.html                  # HTML entry point
├── index.tsx                   # React entry point
├── index.css                   # Global styles
├── vite.config.ts             # Vite configuration
├── vite-env.d.ts              # Vite type declarations
├── tsconfig.json              # TypeScript configuration
├── package.json               # Frontend dependencies
└── .env                        # Frontend environment variables
```

---

## Configuration

### Environment Variables

#### Frontend (`.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `YELP_AI_API_KEY` | Yelp AI API key (fallback) | No |
| `YELP_CLIENT_ID` | Yelp client ID | No |

#### Backend (`server/.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `YELP_AI_API_KEY` | Yelp AI API authentication key | Yes |
| `YELP_CLIENT_ID` | Yelp application client ID | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `PORT` | Backend server port (default: 3001) | No |

### Yelp AI API Setup

1. Register for Yelp AI API access
2. Create an application to obtain credentials
3. Configure API key and Client ID in environment variables
4. Ensure your application complies with Yelp's API terms of service

---

## Performance Optimizations

### Response Caching
- In-memory cache for frequently requested data
- 5-minute TTL for business recommendations
- Reduces API calls by up to 80%

### Lazy Loading
- Components loaded on demand
- Optimized bundle splitting
- Fast initial page load

### Database Indexing
- Indexed user queries for fast lookups
- Optimized MongoDB aggregations
- Efficient saved business retrieval

---

## Security

### Authentication
- JWT-based stateless authentication
- Secure password hashing with bcrypt (12 rounds)
- Token expiration and refresh handling

### Data Protection
- Environment variable management for secrets
- MongoDB connection encryption (TLS)
- Input validation and sanitization
- XSS and CSRF protection

### API Security
- Rate limiting on endpoints
- Request validation middleware
- Secure headers configuration

---

## Deployment

### Deploy to Render

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Deploy Backend (Web Service)
1. Go to [render.com](https://render.com) and create a **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `spotlight-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables:
   ```
   YELP_AI_API_KEY=your_key
   YELP_CLIENT_ID=your_client_id
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```
5. Deploy and copy your backend URL (e.g., `https://spotlight-backend.onrender.com`)

#### Step 3: Deploy Frontend (Static Site)
1. Create a **Static Site** on Render
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `spotlight-frontend`
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://spotlight-backend.onrender.com
   ```
   (Use your actual backend URL from Step 2)
5. Deploy!

#### Step 4: Configure MongoDB
1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (Allow from anywhere)

Your app is now live! 🎉

### Alternative Platforms

| Platform | Frontend | Backend |
|----------|----------|---------|
| Render | ✅ Static Site | ✅ Web Service |
| Vercel | ✅ Recommended | ❌ Not supported |
| Netlify | ✅ Supported | ❌ Not supported |
| Railway | ✅ Supported | ✅ Recommended |
| Heroku | ❌ Not ideal | ✅ Supported |

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Yelp](https://www.yelp.com) for providing the AI API platform
- [React](https://reactjs.org) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [MongoDB](https://www.mongodb.com) for database services

---

<p align="center">
  <strong>Spotlight</strong> — Discover Local, Intelligently
</p>