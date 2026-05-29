import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { EspressoReadingState } from './espresso-reading.store';
import { EspressoReading } from '@boa/features/readings/domain';
import { ESPRESSO_READING_REPOSITORY_TOKEN } from '@boa/features/readings/domain';

export function withEspressoReadingCommands() {
  return signalStoreFeature(
    { state: type<EspressoReadingState>() },
    withMethods((store, repo = inject(ESPRESSO_READING_REPOSITORY_TOKEN)) => ({
      async addReading(item: EspressoReading) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.saveReading(item);
          patchState(store, (state) => ({
            items: [...state.items, item],
            loading: false,
          }));
        } catch (e: any) {
          patchState(store, { loading: false, error: e.message });
          throw e;
        }
      },
      async deleteReading(id: string) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.deleteReading(id);
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
