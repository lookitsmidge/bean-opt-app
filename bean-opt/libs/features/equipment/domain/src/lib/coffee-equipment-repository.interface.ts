import { Observable } from 'rxjs';
import { CoffeeEquipment } from './coffee-equipment.model';

export interface ICoffeeEquipmentRepository {
  getEquipments(userId: string): Observable<CoffeeEquipment[]>;
  getEquipmentById(id: string): Observable<CoffeeEquipment | null>;
  saveEquipment(equipment: CoffeeEquipment): Promise<void>;
  deleteEquipment(id: string): Promise<void>;
}
