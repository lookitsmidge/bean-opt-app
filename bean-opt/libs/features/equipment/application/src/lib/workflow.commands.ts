import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { WorkflowState } from './workflow.store';
import { Workflow, WORKFLOW_REPOSITORY_TOKEN } from '@boa/features/equipment/domain';

export function withWorkflowCommands() {
  return signalStoreFeature(
    { state: type<WorkflowState>() },
    withMethods((store, repo = inject(WORKFLOW_REPOSITORY_TOKEN)) => ({
      async addWorkflow(item: Workflow) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.saveWorkflow(item);
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
      async deleteWorkflow(id: string) {
        try {
          patchState(store, { loading: true, error: null });
          await repo.deleteWorkflow(id);
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
