
import { GoogleGenAI, Type } from "@google/genai";
import { ItineraryDay } from "../types";

export const generateItinerary = async (destination: string, duration: number): Promise<ItineraryDay[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
