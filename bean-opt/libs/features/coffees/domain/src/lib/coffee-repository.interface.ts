import { Observable } from 'rxjs';
import { Coffee } from './coffee.model';

export interface ICoffeeRepository {
  getCoffees(userId: string): Observable<Coffee[]>;
  getCoffeeById(id: string): Observable<Coffee | null>;
  saveCoffee(coffee: Coffee): Promise<void>;
  deleteCoffee(id: string): Promise<void>;
}
