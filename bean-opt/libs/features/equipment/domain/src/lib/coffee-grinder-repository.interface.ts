import { Observable } from 'rxjs';
import { CoffeeGrinder } from './coffee-grinder.model';

export interface ICoffeeGrinderRepository {
  getGrinders(userId: string): Observable<CoffeeGrinder[]>;
  getGrinderById(id: string): Observable<CoffeeGrinder | null>;
  saveGrinder(grinder: CoffeeGrinder): Promise<void>;
  deleteGrinder(id: string): Promise<void>;
}
