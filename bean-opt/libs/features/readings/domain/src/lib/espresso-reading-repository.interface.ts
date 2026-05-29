import { Observable } from 'rxjs';
import { EspressoReading } from './espresso-reading.model';

export interface IEspressoReadingRepository {
  getReadings(userId: string): Observable<EspressoReading[]>;
  getReadingById(id: string): Observable<EspressoReading | null>;
  saveReading(reading: EspressoReading): Promise<void>;
  deleteReading(id: string): Promise<void>;
}
