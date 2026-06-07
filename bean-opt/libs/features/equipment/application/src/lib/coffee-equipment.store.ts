import { signalStore, withState } from '@ngrx/signals';
import { CoffeeEquipment } from '@boa/features/equipment/domain';
import { withCoffeeEquipmentSync } from './coffee-equipment.sync';
import { withCoffeeEquipmentCommands } from './coffee-equipment.commands';

export interface CoffeeEquipmentState {
  items: CoffeeEquipment[];
  loading: boolean;
  error: string | null;
}

const initialState: CoffeeEquipmentState = {
  items: [],
  loading: false,
  error: null,
};

export const CoffeeEquipmentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCoffeeEquipmentSync(),
  withCoffeeEquipmentCommands(),
);
