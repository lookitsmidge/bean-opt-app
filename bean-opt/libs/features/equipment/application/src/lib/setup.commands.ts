import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { SetupState } from './setup.store';
import { Setup, SETUP_REPOSITORY_TOKEN } from '@boa/features/equipment/domain';

export function withSetupCommands() {
  return signalStoreFeature(
    { state: type<SetupState>() },
    withMethods((store, repo = inject(SETUP_REPOSITORY_TOKEN)) => ({
      async addSetup(item: Setup) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.saveSetup(item);
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
      async deleteSetup(id: string) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.deleteSetup(id);
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
