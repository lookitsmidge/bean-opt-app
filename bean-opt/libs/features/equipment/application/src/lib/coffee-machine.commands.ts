import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { CoffeeMachineState } from './coffee-machine.store';
import { CoffeeMachine, COFFEE_MACHINE_REPOSITORY_TOKEN } from '@boa/features/equipment/domain';

export function withCoffeeMachineCommands() {
  return signalStoreFeature(
    { state: type<CoffeeMachineState>() },
    withMethods((store, repo = inject(COFFEE_MACHINE_REPOSITORY_TOKEN)) => ({
      async addMachine(item: CoffeeMachine) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.saveMachine(item);
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
      async deleteMachine(id: string) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.deleteMachine(id);
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
