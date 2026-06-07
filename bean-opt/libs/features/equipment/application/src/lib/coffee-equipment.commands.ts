import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { CoffeeEquipmentState } from './coffee-equipment.store';
import { CoffeeEquipment, COFFEE_EQUIPMENT_REPOSITORY_TOKEN } from '@boa/features/equipment/domain';

export function withCoffeeEquipmentCommands() {
  return signalStoreFeature(
    { state: type<CoffeeEquipmentState>() },
    withMethods((store, repo = inject(COFFEE_EQUIPMENT_REPOSITORY_TOKEN)) => ({
      async addEquipment(item: CoffeeEquipment) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.saveEquipment(item);
          patchState(store, (state) => {
            const index = state.items.findIndex((x) => x.id === item.id);
            const items = [...state.items];
            if (index > -1) {
              items[index] = item;
            } else {
              items.push(item);
            }
            return { items, loading: false };
          });
        } catch (e: any) {
          patchState(store, { loading: false, error: e.message });
          throw e;
        }
      },
      async deleteEquipment(id: string) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.deleteEquipment(id);
          patchState(store, (state) => ({
            items: state.items.filter((item) => item.id !== id),
            loading: false,
          }));
        } catch (e: any) {
          patchState(store, { loading: false, error: e.message });
          throw e;
        }
      },
    })),
  );
}
