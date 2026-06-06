import { signalStoreFeature, type, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { CoffeeGrinderState } from './coffee-grinder.store';
import { COFFEE_GRINDER_REPOSITORY_TOKEN } from '@boa/features/equipment/domain';

export function withCoffeeGrinderSync() {
  return signalStoreFeature(
    { state: type<CoffeeGrinderState>() },
    withMethods((store, repo = inject(COFFEE_GRINDER_REPOSITORY_TOKEN)) => ({
      loadGrinders: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((userId) =>
            repo.getGrinders(userId).pipe(
              tap((items) => {
                patchState(store, { items, loading: false });
              }),
              catchError((error: any) => {
                console.error('CoffeeGrinder sync error:', error);
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
