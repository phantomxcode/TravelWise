<div align="center">
  <img src="public/logo.png" alt="TravelWise Logo" width="150" height="150" />
  
  # ✈️ TravelWise
  
  ### AI-Powered Travel Planning Made Simple 
  
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
  [![Gemini](https://img.shields.io/badge/Gemini-AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
  
  [Live Demo](#) • [Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack)
</div>

---

## 🌟 What is TravelWise?

**TravelWise** is a modern travel planning application that combines the power of AI with intuitive design. Plan your trips, generate personalized itineraries, and get smart budget analysis — all in one beautiful interface.

<div align="center">
  <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop" alt="Travel Banner" width="100%" style="border-radius: 12px; margin: 20px 0;" />
</div>

---

## ✨ Features

### 🤖 AI-Powered Itineraries
Let Google's Gemini AI generate personalized day-by-day travel plans based on your destination and trip duration.

### 💰 Smart Budget Analysis
Get detailed budget insights including:
- **Budget Score** (1-100) rating
- Category breakdowns with percentages
- Money-saving tips specific to your destination
- Warnings about potential budget issues

### 🗺️ Interactive Maps
Preview your destinations with beautiful map integrations before you go.

### 📱 Modern UI/UX
- Animated hero section with image accordion
- Apple-style dock navigation
- Glassmorphism effects
- Smooth Framer Motion animations
- Fully responsive design

### 💾 Cloud Persistence
All your trips are securely stored in Supabase with full CRUD operations.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/travelwise.git
cd travelwise

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### Environment Setup

Edit `.env.local` with your credentials:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the SQL script in Supabase SQL Editor:
```sql
-- See supabase/SETUP_DATABASE.sql for full schema
```

### Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS, Framer Motion |
| **AI** | Google Gemini 2.5 Flash |
| **Database** | Supabase (PostgreSQL) |
| **Routing** | React Router DOM 7 |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
travelwise/
├── components/
│   ├── ui/               # shadcn-style components
│   │   ├── button.tsx
│   │   ├── dock.tsx      # Apple-style navigation
│   │   └── hero-accordion.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── pages/
│   ├── Home.tsx          # Landing page with hero
│   ├── Trips.tsx         # Trip listing
│   ├── CreateTrip.tsx    # Trip creation form
│   └── TripDetails.tsx   # Trip details + AI features
├── services/
│   ├── geminiService.ts  # AI itinerary & budget
│   ├── supabaseClient.ts # Database client
│   └── tripService.ts    # CRUD operations
└── public/
    └── logo.png          # TravelWise logo
```

---

## 🎨 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>🏠 Home</strong></td>
      <td align="center"><strong>📋 Trip Details</strong></td>
    </tr>
    <tr>
      <td>Hero with image accordion</td>
      <td>AI itinerary & budget analysis</td>
    </tr>
  </table>
</div>

---

## 🔑 Key Features Explained

### AI Itinerary Generation
```typescript
// Generates personalized daily plans
const itinerary = await generateItinerary("Paris", 5);
// Returns: Day 1: Eiffel Tower, Louvre...
```

### Budget Analysis
```typescript
// Get AI-powered budget insights
const analysis = await analyzeBudget("Tokyo", 7, {
  transport: 500,
  accommodation: 1000,
  food: 400,
  activities: 300
});
// Returns: Score, tips, warnings, breakdowns
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  Made with ❤️ using React, Gemini AI & Supabase
  
  **[⬆ Back to Top](#-travelwise)**
</div>
