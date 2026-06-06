import { signalStoreFeature, type, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { CoffeeState } from './coffee.store';
import { COFFEE_REPOSITORY_TOKEN } from '@boa/features/coffees/domain';

export function withCoffeeSync() {
  return signalStoreFeature(
    { state: type<CoffeeState>() },
    withMethods((store, repo = inject(COFFEE_REPOSITORY_TOKEN)) => ({
      loadCoffees: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((userId) =>
            repo.getCoffees(userId).pipe(
              tap((items) => {
                patchState(store, { items, loading: false });
              }),
              catchError((error: any) => {
                console.error('Coffee sync error:', error);
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
