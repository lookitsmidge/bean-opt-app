export interface CoffeeMachine {
  id: string;
  userId: string;
  name: string;
  manufacturer: string | null;
  active: boolean;
  createdAt: string;
}
