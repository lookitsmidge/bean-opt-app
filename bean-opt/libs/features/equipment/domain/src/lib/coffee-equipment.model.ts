export interface CoffeeEquipment {
  id: string;
  userId: string;
  name: string;
  type: string; // 'Basket', 'Portafilter', 'Shaker', 'Tamper', 'WDT', 'Scale', 'Other'
  active: boolean;
  createdAt: string;
}
