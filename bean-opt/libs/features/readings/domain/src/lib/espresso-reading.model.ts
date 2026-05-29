export interface EspressoReading {
  id: string;
  userId: string;
  coffeeMass: number;      // in grams
  waterMass: number;       // in grams (yield)
  extractionTime: number;  // in seconds
  notes?: string;
  createdAt: string;
}
