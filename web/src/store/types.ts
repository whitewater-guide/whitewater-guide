import { Store as ApolloStore } from 'apollo-client/store';
import { RegionsState } from '../ww-clients/features/regions';

interface PersistentState {
  regions: RegionsState;
}

interface TransientState {
  apollo: ApolloStore;
}

export interface RootState {
  persistent: PersistentState;
  transient: TransientState;
}
