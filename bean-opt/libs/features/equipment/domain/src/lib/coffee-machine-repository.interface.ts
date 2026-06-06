import { Observable } from 'rxjs';
import { CoffeeMachine } from './coffee-machine.model';

export interface ICoffeeMachineRepository {
  getMachines(userId: string): Observable<CoffeeMachine[]>;
  getMachineById(id: string): Observable<CoffeeMachine | null>;
  saveMachine(machine: CoffeeMachine): Promise<void>;
  deleteMachine(id: string): Promise<void>;
}
