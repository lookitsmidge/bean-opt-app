import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseService } from '@boa/infra-util';
import { CoffeeGrinder, ICoffeeGrinderRepository } from '@boa/features/equipment/domain';

@Injectable({
  providedIn: 'root',
})
export class SupabaseCoffeeGrinderRepository implements ICoffeeGrinderRepository {
  private supabase = inject(SupabaseService).client;

  getGrinders(userId: string): Observable<CoffeeGrinder[]> {
    return new Observable<CoffeeGrinder[]>((subscriber) => {
      this.supabase
        .from('coffee_grinders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(this.mapGrinders(data || []));
        });
    });
  }

  getGrinderById(id: string): Observable<CoffeeGrinder | null> {
    return new Observable<CoffeeGrinder | null>((subscriber) => {
      this.supabase
        .from('coffee_grinders')
        .select('*')
        .eq('id', id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(data ? this.mapGrinder(data) : null);
        });
    });
  }

  async saveGrinder(grinder: CoffeeGrinder): Promise<void> {
    const { error } = await this.supabase
      .from('coffee_grinders')
      .upsert({
        id: grinder.id,
        user_id: grinder.userId,
        name: grinder.name,
        manufacturer: grinder.manufacturer,
        active: grinder.active,
        created_at: grinder.createdAt,
      });

    if (error) throw error;
  }

  async deleteGrinder(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('coffee_grinders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapGrinder(row: any): CoffeeGrinder {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      manufacturer: row.manufacturer,
      active: Boolean(row.active),
      createdAt: row.created_at,
    };
  }

  private mapGrinders(rows: any[]): CoffeeGrinder[] {
    return rows.map((row) => this.mapGrinder(row));
  }
}
