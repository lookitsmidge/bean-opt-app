import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { CoffeeState } from './coffee.store';
import { Coffee, COFFEE_REPOSITORY_TOKEN } from '@boa/features/coffees/domain';

export function withCoffeeCommands() {
  return signalStoreFeature(
    { state: type<CoffeeState>() },
    withMethods((store, repo = inject(COFFEE_REPOSITORY_TOKEN)) => ({
      async addCoffee(item: Coffee) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.saveCoffee(item);
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
      async deleteCoffee(id: string) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.deleteCoffee(id);
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
