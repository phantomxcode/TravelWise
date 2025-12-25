
export interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: string[];
}

export interface TripBudget {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  itinerary: ItineraryDay[];
  budget: TripBudget;
}
