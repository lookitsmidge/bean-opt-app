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
        .select('*, coffee_targets(*)')
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
        .select('*, coffee_targets(*)')
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
        roast_profile: coffee.roastProfile,
        description: coffee.description,
        url: coffee.url,
        price_per_kg: coffee.pricePerKg,
        notes: coffee.notes,
        active: coffee.active,
        created_at: coffee.createdAt,
      });

    if (error) throw error;

    // Delete existing targets to prevent orphans and cleanly overwrite
    const { error: deleteError } = await this.supabase
      .from('coffee_targets')
      .delete()
      .eq('coffee_id', coffee.id);

    if (deleteError) throw deleteError;

    // Insert new targets
    if (coffee.targets && coffee.targets.length > 0) {
      const { error: targetsError } = await this.supabase
        .from('coffee_targets')
        .insert(
          coffee.targets.map((t) => ({
            id: t.id,
            coffee_id: coffee.id,
            taste_profile: t.tasteProfile,
            min_yield: t.minYield,
            max_yield: t.maxYield,
            min_preinfusion_time: t.minPreinfusionTime,
            max_preinfusion_time: t.maxPreinfusionTime,
            min_extraction_time: t.minExtractionTime,
            max_extraction_time: t.maxExtractionTime,
            min_flow_rate: t.minFlowRate,
            max_flow_rate: t.maxFlowRate,
            created_at: t.createdAt,
          }))
        );

      if (targetsError) throw targetsError;
    }
  }

  async deleteCoffee(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('coffees')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapCoffee(row: any): Coffee {
    const targets = (row.coffee_targets || [])
      .map((t: any) => ({
        id: t.id,
        coffeeId: t.coffee_id,
        tasteProfile: t.taste_profile,
        minYield: t.min_yield ? Number(t.min_yield) : null,
        maxYield: t.max_yield ? Number(t.max_yield) : null,
        minPreinfusionTime: t.min_preinfusion_time ? Number(t.min_preinfusion_time) : null,
        maxPreinfusionTime: t.max_preinfusion_time ? Number(t.max_preinfusion_time) : null,
        minExtractionTime: t.min_extraction_time ? Number(t.min_extraction_time) : null,
        maxExtractionTime: t.max_extraction_time ? Number(t.max_extraction_time) : null,
        minFlowRate: t.min_flow_rate ? Number(t.min_flow_rate) : null,
        maxFlowRate: t.max_flow_rate ? Number(t.max_flow_rate) : null,
        createdAt: t.created_at,
      }))
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      roaster: row.roaster,
      roastProfile: row.roast_profile,
      description: row.description,
      url: row.url,
      pricePerKg: row.price_per_kg ? Number(row.price_per_kg) : null,
      notes: row.notes,
      active: Boolean(row.active),
      createdAt: row.created_at,
      targets,
    };
  }

  private mapCoffees(rows: any[]): Coffee[] {
    return rows.map((row) => this.mapCoffee(row));
  }
}
