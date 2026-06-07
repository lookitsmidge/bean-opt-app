import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseService } from '@boa/infra-util';
import { CoffeeEquipment, ICoffeeEquipmentRepository } from '@boa/features/equipment/domain';

@Injectable({
  providedIn: 'root',
})
export class SupabaseCoffeeEquipmentRepository implements ICoffeeEquipmentRepository {
  private supabase = inject(SupabaseService).client;

  getEquipments(userId: string): Observable<CoffeeEquipment[]> {
    return new Observable<CoffeeEquipment[]>((subscriber) => {
      this.supabase
        .from('coffee_equipments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(this.mapEquipments(data || []));
        });
    });
  }

  getEquipmentById(id: string): Observable<CoffeeEquipment | null> {
    return new Observable<CoffeeEquipment | null>((subscriber) => {
      this.supabase
        .from('coffee_equipments')
        .select('*')
        .eq('id', id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(data ? this.mapEquipment(data) : null);
        });
    });
  }

  async saveEquipment(equipment: CoffeeEquipment): Promise<void> {
    const { error } = await this.supabase
      .from('coffee_equipments')
      .upsert({
        id: equipment.id,
        user_id: equipment.userId,
        name: equipment.name,
        type: equipment.type,
        active: equipment.active,
        created_at: equipment.createdAt,
      });

    if (error) throw error;
  }

  async deleteEquipment(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('coffee_equipments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapEquipment(row: any): CoffeeEquipment {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      type: row.type,
      active: Boolean(row.active),
      createdAt: row.created_at,
    };
  }

  private mapEquipments(rows: any[]): CoffeeEquipment[] {
    return rows.map((row) => this.mapEquipment(row));
  }
}
