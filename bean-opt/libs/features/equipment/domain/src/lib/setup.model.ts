export interface Setup {
  id: string;
  userId: string;
  name: string;
  machineId: string | null;
  grinderId: string | null;
  active: boolean;
  createdAt: string;
  equipmentIds?: string[];
}
