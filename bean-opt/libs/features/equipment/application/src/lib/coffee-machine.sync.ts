import { signalStoreFeature, type, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { CoffeeMachineState } from './coffee-machine.store';
import { COFFEE_MACHINE_REPOSITORY_TOKEN } from '@boa/features/equipment/domain';

export function withCoffeeMachineSync() {
  return signalStoreFeature(
    { state: type<CoffeeMachineState>() },
    withMethods((store, repo = inject(COFFEE_MACHINE_REPOSITORY_TOKEN)) => ({
      loadMachines: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((userId) =>
            repo.getMachines(userId).pipe(
              tap((items) => {
                patchState(store, { items, loading: false });
              }),
              catchError((error: any) => {
                console.error('CoffeeMachine sync error:', error);
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
