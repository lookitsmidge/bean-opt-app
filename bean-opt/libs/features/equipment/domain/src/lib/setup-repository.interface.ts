import { Observable } from 'rxjs';
import { Setup } from './setup.model';

export interface ISetupRepository {
  getSetups(userId: string): Observable<Setup[]>;
  getSetupById(id: string): Observable<Setup | null>;
  saveSetup(setup: Setup): Promise<void>;
  deleteSetup(id: string): Promise<void>;
}
