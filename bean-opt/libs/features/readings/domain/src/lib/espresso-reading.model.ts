export interface EspressoReading {
  id: string;
  userId: string;
  coffeeId: string | null;
  workflowId: string | null;
  setupId: string | null;
  coffeeMassIn: number;       // 1dp
  warmingShot: boolean;
  preinfusionTime: number;    // 1dp
  extractionTime: number;     // 1dp
  totalYield: number;         // 1dp
  flowRate: number;           // calculated from totalYield / extractionTime
  flavourBalance: number;     // 1 - 10 (Gold Zone: 4 - 6)
  rating: number;             // 0 - 5 stars
  comments: string;
  createdAt: string;
}
