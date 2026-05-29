import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseService } from '@boa/infra-util';
import { EspressoReading, IEspressoReadingRepository } from '@boa/features/readings/domain';

@Injectable({
  providedIn: 'root',
})
export class SupabaseEspressoReadingRepository implements IEspressoReadingRepository {
  private supabase = inject(SupabaseService).client;

  getReadings(userId: string): Observable<EspressoReading[]> {
    return new Observable<EspressoReading[]>((subscriber) => {
      this.supabase
        .from('espresso_readings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(this.mapReadings(data || []));
        });
    });
  }

  getReadingById(id: string): Observable<EspressoReading | null> {
    return new Observable<EspressoReading | null>((subscriber) => {
      this.supabase
        .from('espresso_readings')
        .select('*')
        .eq('id', id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(data ? this.mapReading(data) : null);
        });
    });
  }

  async saveReading(reading: EspressoReading): Promise<void> {
    const { error } = await this.supabase
      .from('espresso_readings')
      .upsert({
        id: reading.id,
        user_id: reading.userId,
        coffee_mass: reading.coffeeMass,
        water_mass: reading.waterMass,
        extraction_time: reading.extractionTime,
        notes: reading.notes,
        created_at: reading.createdAt,
      });

    if (error) throw error;
  }

  async deleteReading(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('espresso_readings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapReading(row: any): EspressoReading {
    return {
      id: row.id,
      userId: row.user_id,
      coffeeMass: Number(row.coffee_mass),
      waterMass: Number(row.water_mass),
      extractionTime: Number(row.extraction_time),
      notes: row.notes || undefined,
      createdAt: row.created_at,
    };
  }

  private mapReadings(rows: any[]): EspressoReading[] {
    return rows.map((row) => this.mapReading(row));
  }
}
