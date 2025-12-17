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
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create `.env.local` in the project root:
   ```env
   # Yelp AI API Configuration
   YELP_AI_API_KEY=your_yelp_ai_api_key
   YELP_CLIENT_ID=your_yelp_client_id
   
   # Database Configuration
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/spotlight
   
   # Security
   JWT_SECRET=your_secure_jwt_secret_key
   ```

4. **Start development servers**
   
   Terminal 1 - Backend:
   ```bash
   npm run server:dev
   ```
   
   Terminal 2 - Frontend:
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:3001`

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
├── components/                 # React components
│   ├── IntelligencePanel.tsx  # Business display panel
│   └── MessageBubble.tsx      # Chat message component
├── services/                   # Service layer
│   ├── yelpAIService.ts       # Yelp AI API integration
│   ├── authService.ts         # Authentication service
│   └── database.js            # MongoDB operations
├── App.tsx                     # Main application component
├── types.ts                    # TypeScript definitions
├── server.js                   # Express backend server
├── index.html                  # HTML entry point
├── index.tsx                   # React entry point
├── index.css                   # Global styles
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## Configuration

### Environment Variables

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

### Production Build

```bash
# Build frontend
npm run build

# Start production server
npm run server
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "server"]
```

### Environment Recommendations

| Platform | Frontend | Backend |
|----------|----------|---------|
| Vercel | ✅ Recommended | - |
| Netlify | ✅ Supported | - |
| Railway | - | ✅ Recommended |
| Heroku | - | ✅ Supported |
| AWS | ✅ S3 + CloudFront | ✅ EC2/ECS |

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