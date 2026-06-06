import { signalStore, withState } from '@ngrx/signals';
import { CoffeeMachine } from '@boa/features/equipment/domain';
import { withCoffeeMachineSync } from './coffee-machine.sync';
import { withCoffeeMachineCommands } from './coffee-machine.commands';

export interface CoffeeMachineState {
  items: CoffeeMachine[];
  loading: boolean;
  error: string | null;
}

const initialState: CoffeeMachineState = {
  items: [],
  loading: false,
  error: null,
};

export const CoffeeMachineStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCoffeeMachineSync(),
  withCoffeeMachineCommands(),
);
