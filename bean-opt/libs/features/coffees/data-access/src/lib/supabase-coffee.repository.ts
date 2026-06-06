import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseService } from '@boa/infra-util';
import { Coffee, ICoffeeRepository } from '@boa/features/coffees/domain';

@Injectable({
  providedIn: 'root',
})
export class SupabaseCoffeeRepository implements ICoffeeRepository {
  private supabase = inject(SupabaseService).client;

  getCoffees(userId: string): Observable<Coffee[]> {
    return new Observable<Coffee[]>((subscriber) => {
      this.supabase
        .from('coffees')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(this.mapCoffees(data || []));
        });
    });
  }

  getCoffeeById(id: string): Observable<Coffee | null> {
    return new Observable<Coffee | null>((subscriber) => {
      this.supabase
        .from('coffees')
        .select('*')
        .eq('id', id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(data ? this.mapCoffee(data) : null);
        });
    });
  }

  async saveCoffee(coffee: Coffee): Promise<void> {
    const { error } = await this.supabase
      .from('coffees')
      .upsert({
        id: coffee.id,
        user_id: coffee.userId,
        name: coffee.name,
        roaster: coffee.roaster,
        roast_date: coffee.roastDate || null,
        notes: coffee.notes,
        active: coffee.active,
        created_at: coffee.createdAt,
      });

    if (error) throw error;
  }

  async deleteCoffee(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('coffees')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapCoffee(row: any): Coffee {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      roaster: row.roaster,
      roastDate: row.roast_date,
      notes: row.notes,
      active: Boolean(row.active),
      createdAt: row.created_at,
    };
  }

  private mapCoffees(rows: any[]): Coffee[] {
    return rows.map((row) => this.mapCoffee(row));
  }
}
