import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseService } from '@boa/infra-util';
import { CoffeeMachine, ICoffeeMachineRepository } from '@boa/features/equipment/domain';

@Injectable({
  providedIn: 'root',
})
export class SupabaseCoffeeMachineRepository implements ICoffeeMachineRepository {
  private supabase = inject(SupabaseService).client;

  getMachines(userId: string): Observable<CoffeeMachine[]> {
    return new Observable<CoffeeMachine[]>((subscriber) => {
      this.supabase
        .from('coffee_machines')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(this.mapMachines(data || []));
        });
    });
  }

  getMachineById(id: string): Observable<CoffeeMachine | null> {
    return new Observable<CoffeeMachine | null>((subscriber) => {
      this.supabase
        .from('coffee_machines')
        .select('*')
        .eq('id', id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(data ? this.mapMachine(data) : null);
        });
    });
  }

  async saveMachine(machine: CoffeeMachine): Promise<void> {
    const { error } = await this.supabase
      .from('coffee_machines')
      .upsert({
        id: machine.id,
        user_id: machine.userId,
        name: machine.name,
        manufacturer: machine.manufacturer,
        active: machine.active,
        created_at: machine.createdAt,
      });

    if (error) throw error;
  }

  async deleteMachine(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('coffee_machines')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapMachine(row: any): CoffeeMachine {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      manufacturer: row.manufacturer,
      active: Boolean(row.active),
      createdAt: row.created_at,
    };
  }

  private mapMachines(rows: any[]): CoffeeMachine[] {
    return rows.map((row) => this.mapMachine(row));
  }
}
