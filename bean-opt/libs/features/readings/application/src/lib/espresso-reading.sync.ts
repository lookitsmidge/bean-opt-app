import { signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { EspressoReadingState } from './espresso-reading.store';
import { ESPRESSO_READING_REPOSITORY_TOKEN } from '@boa/features/readings/domain';
import { patchState } from '@ngrx/signals';

export function withEspressoReadingSync() {
  return signalStoreFeature(
    { state: type<EspressoReadingState>() },
    withMethods((store, repo = inject(ESPRESSO_READING_REPOSITORY_TOKEN)) => ({
      loadReadings: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((userId) =>
            repo.getReadings(userId).pipe(
              tap((items) => {
                patchState(store, { items, loading: false });
              }),
              catchError((error: any) => {
                console.error('EspressoReading sync error:', error);
                patchState(store, { loading: false, error: error.message });
                return of([]);
              })
            )
          )
        )
      ),
    })),
  );
}
