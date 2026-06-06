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
    const calculatedFlowRate = reading.extractionTime > 0
      ? Number((reading.totalYield / reading.extractionTime).toFixed(3))
      : 0;

    const { error } = await this.supabase
      .from('espresso_readings')
      .upsert({
        id: reading.id,
        user_id: reading.userId,
        coffee_id: reading.coffeeId,
        workflow_id: reading.workflowId,
        setup_id: reading.setupId,
        coffee_mass_in: reading.coffeeMassIn,
        warming_shot: reading.warmingShot,
        preinfusion_time: reading.preinfusionTime,
        extraction_time: reading.extractionTime,
        total_yield: reading.totalYield,
        flow_rate: calculatedFlowRate,
        flavour_balance: reading.flavourBalance,
        rating: reading.rating,
        comments: reading.comments,
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
      coffeeId: row.coffee_id,
      workflowId: row.workflow_id,
      setupId: row.setup_id,
      coffeeMassIn: Number(row.coffee_mass_in),
      warmingShot: Boolean(row.warming_shot),
      preinfusionTime: Number(row.preinfusion_time),
      extractionTime: Number(row.extraction_time),
      totalYield: Number(row.total_yield),
      flowRate: Number(row.flow_rate),
      flavourBalance: Number(row.flavour_balance),
      rating: Number(row.rating),
      comments: row.comments,
      createdAt: row.created_at,
    };
  }

  private mapReadings(rows: any[]): EspressoReading[] {
    return rows.map((row) => this.mapReading(row));
  }
}
