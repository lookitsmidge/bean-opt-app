export interface Coffee {
  id: string;
  userId: string;
  name: string;
  roaster: string | null;
  roastDate: string | null; // ISO string or YYYY-MM-DD
  notes: string | null;
  active: boolean;
  createdAt: string;
}
