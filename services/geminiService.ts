
import { GoogleGenAI, Type } from "@google/genai";
import { ItineraryDay, TripBudget } from "../types";

// Budget Analysis result interface
export interface BudgetAnalysis {
  summary: string;
  categoryBreakdown: {
    category: string;
    percentage: number;
    assessment: string;
    tip: string;
  }[];
  savingsTips: string[];
  warnings: string[];
  overallScore: number; // 1-100
}

export const generateItinerary = async (destination: string, duration: number): Promise<ItineraryDay[]> => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY not found in environment');
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a travel itinerary for ${destination} for ${duration} days. Focus on high-quality titles and a list of specific activities for each day.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dayNumber: { type: Type.INTEGER },
              title: { type: Type.STRING },
              activities: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["dayNumber", "title", "activities"],
            propertyOrdering: ["dayNumber", "title", "activities"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to generate itinerary:", error);
    return [];
  }
};

// AI Budget Analysis using Gemini
export const analyzeBudget = async (
  destination: string,
  duration: number,
  budget: TripBudget
): Promise<BudgetAnalysis | null> => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY not found in environment');
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  const total = budget.transport + budget.accommodation + budget.food + budget.activities;

  if (total === 0) {
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this travel budget for a ${duration}-day trip to ${destination}:
- Transport: $${budget.transport}
- Accommodation: $${budget.accommodation}
- Food: $${budget.food}
- Activities: $${budget.activities}
- Total: $${total}

Provide a detailed analysis including:
1. Overall budget assessment summary
2. Category breakdown with percentages, assessment (good/average/high/low), and specific tips
3. Money-saving tips specific to ${destination}
4. Warnings about potential budget issues
5. Overall budget score (1-100, where 100 is excellent value)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            categoryBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                  assessment: { type: Type.STRING },
                  tip: { type: Type.STRING }
                },
                required: ["category", "percentage", "assessment", "tip"]
              }
            },
            savingsTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            overallScore: { type: Type.INTEGER }
          },
          required: ["summary", "categoryBreakdown", "savingsTips", "warnings", "overallScore"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to analyze budget:", error);
    return null;
  }
};

