import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { CoffeeGrinderState } from './coffee-grinder.store';
import { CoffeeGrinder, COFFEE_GRINDER_REPOSITORY_TOKEN } from '@boa/features/equipment/domain';

export function withCoffeeGrinderCommands() {
  return signalStoreFeature(
    { state: type<CoffeeGrinderState>() },
    withMethods((store, repo = inject(COFFEE_GRINDER_REPOSITORY_TOKEN)) => ({
      async addGrinder(item: CoffeeGrinder) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.saveGrinder(item);
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
      async deleteGrinder(id: string) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.deleteGrinder(id);
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
