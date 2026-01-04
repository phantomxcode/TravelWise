# TravelWise - AI-Powered Travel Planning App

## Tech Stack
- React 19 + TypeScript + Vite 6
- Supabase (PostgreSQL) 
- Google GenAI SDK (Gemini)
- Framer Motion + Lucide Icons
- Tailwind CSS

## Key Features
1. **Video Hero Section** - Background video with email signup
2. **Apple-Style Dock** - Magnifying navigation 
3. **AI Itineraries** - Gemini generates daily plans
4. **AI Budget Analysis** - Score, tips, warnings
5. **Indian Rupee (₹)** - All prices in INR

## Color Palette (Purple-Free)
- Primary: Blue (#3b82f6)
- Accent: Teal (#14b8a6)
- Neutral: Slate
- Success: Green
- Warning: Amber/Orange

## Custom Fonts
- Fugaz One (headlines)
- Young Serif (headings)  
- Inter (body)

## Structure
```
components/
├── ui/
│   ├── button.tsx
│   ├── dock.tsx
│   └── hero-with-video.tsx
├── Navbar.tsx
├── Footer.tsx
pages/
├── Home.tsx
├── TripDetails.tsx
├── CreateTrip.tsx
└── Trips.tsx
services/
├── geminiService.ts
├── supabaseClient.ts
└── tripService.ts
```

## Setup
```bash
npm install
# Configure .env.local
# Run SETUP_DATABASE.sql in Supabase
npm run dev
```
