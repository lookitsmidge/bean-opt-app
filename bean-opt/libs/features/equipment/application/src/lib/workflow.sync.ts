import { signalStoreFeature, type, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { WorkflowState } from './workflow.store';
import { WORKFLOW_REPOSITORY_TOKEN } from '@boa/features/equipment/domain';

export function withWorkflowSync() {
  return signalStoreFeature(
    { state: type<WorkflowState>() },
    withMethods((store, repo = inject(WORKFLOW_REPOSITORY_TOKEN)) => ({
      loadWorkflows: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((userId) =>
            repo.getWorkflows(userId).pipe(
              tap((items) => {
                patchState(store, { items, loading: false });
              }),
              catchError((error: any) => {
                console.error('Workflow sync error:', error);
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
