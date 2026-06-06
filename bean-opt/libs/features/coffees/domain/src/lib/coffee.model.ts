export interface CoffeeTarget {
  id: string;
  coffeeId: string;
  tasteProfile: string;
  minYield: number | null;
  maxYield: number | null;
  minPreinfusionTime: number | null;
  maxPreinfusionTime: number | null;
  minExtractionTime: number | null;
  maxExtractionTime: number | null;
  minFlowRate: number | null;
  maxFlowRate: number | null;
  createdAt: string;
}

export interface Coffee {
  id: string;
  userId: string;
  name: string;
  roaster: string | null;
  roastProfile: 'light' | 'medium' | 'dark' | null;
  description: string | null;
  url: string | null;
  pricePerKg: number | null;
  notes: string | null;
  active: boolean;
  createdAt: string;
  targets?: CoffeeTarget[];
}
