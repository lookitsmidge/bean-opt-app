import { signalStore, withState } from '@ngrx/signals';
import { Workflow } from '@boa/features/equipment/domain';
import { withWorkflowSync } from './workflow.sync';
import { withWorkflowCommands } from './workflow.commands';

export interface WorkflowState {
  items: Workflow[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkflowState = {
  items: [],
  loading: false,
  error: null,
};

export const WorkflowStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withWorkflowSync(),
  withWorkflowCommands(),
);
