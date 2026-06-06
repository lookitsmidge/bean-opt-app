import { signalStoreFeature, type, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { SetupState } from './setup.store';
import { SETUP_REPOSITORY_TOKEN } from '@boa/features/equipment/domain';

export function withSetupSync() {
  return signalStoreFeature(
    { state: type<SetupState>() },
    withMethods((store, repo = inject(SETUP_REPOSITORY_TOKEN)) => ({
      loadSetups: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((userId) =>
            repo.getSetups(userId).pipe(
              tap((items) => {
                patchState(store, { items, loading: false });
              }),
              catchError((error: any) => {
                console.error('Setup sync error:', error);
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
