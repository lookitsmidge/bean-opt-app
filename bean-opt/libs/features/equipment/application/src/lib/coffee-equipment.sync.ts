import { signalStoreFeature, type, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { CoffeeEquipmentState } from './coffee-equipment.store';
import { COFFEE_EQUIPMENT_REPOSITORY_TOKEN } from '@boa/features/equipment/domain';

export function withCoffeeEquipmentSync() {
  return signalStoreFeature(
    { state: type<CoffeeEquipmentState>() },
    withMethods((store, repo = inject(COFFEE_EQUIPMENT_REPOSITORY_TOKEN)) => ({
      loadEquipments: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((userId) =>
            repo.getEquipments(userId).pipe(
              tap((items) => {
                patchState(store, { items, loading: false });
              }),
              catchError((error: any) => {
                console.error('CoffeeEquipment sync error:', error);
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
