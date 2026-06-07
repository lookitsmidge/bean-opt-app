import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseService } from '@boa/infra-util';
import { Setup, ISetupRepository } from '@boa/features/equipment/domain';

@Injectable({
  providedIn: 'root',
})
export class SupabaseSetupRepository implements ISetupRepository {
  private supabase = inject(SupabaseService).client;

  getSetups(userId: string): Observable<Setup[]> {
    return new Observable<Setup[]>((subscriber) => {
      this.supabase
        .from('setups')
        .select('*, setup_equipments(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(this.mapSetups(data || []));
        });
    });
  }

  getSetupById(id: string): Observable<Setup | null> {
    return new Observable<Setup | null>((subscriber) => {
      this.supabase
        .from('setups')
        .select('*, setup_equipments(*)')
        .eq('id', id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            subscriber.error(error);
            return;
          }
          subscriber.next(data ? this.mapSetup(data) : null);
        });
    });
  }

  async saveSetup(setup: Setup): Promise<void> {
    const { error } = await this.supabase
      .from('setups')
      .upsert({
        id: setup.id,
        user_id: setup.userId,
        name: setup.name,
        machine_id: setup.machineId || null,
        grinder_id: setup.grinderId || null,
        active: setup.active,
        created_at: setup.createdAt,
      });

    if (error) throw error;

    // Sync setup custom tools in setup_equipments junction table
    const { error: deleteError } = await this.supabase
      .from('setup_equipments')
      .delete()
      .eq('setup_id', setup.id);

    if (deleteError) throw deleteError;

    if (setup.equipmentIds && setup.equipmentIds.length > 0) {
      const links = setup.equipmentIds.map((equipId) => ({
        setup_id: setup.id,
        equipment_id: equipId,
      }));
      const { error: insertError } = await this.supabase
        .from('setup_equipments')
        .insert(links);

      if (insertError) throw insertError;
    }
  }

  async deleteSetup(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('setups')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapSetup(row: any): Setup {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      machineId: row.machine_id,
      grinderId: row.grinder_id,
      active: Boolean(row.active),
      createdAt: row.created_at,
      equipmentIds: (row.setup_equipments || []).map((se: any) => se.equipment_id),
    };
  }

  private mapSetups(rows: any[]): Setup[] {
    return rows.map((row) => this.mapSetup(row));
  }
}
