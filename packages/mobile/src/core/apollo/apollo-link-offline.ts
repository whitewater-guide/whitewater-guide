// tslint:disable-next-line:no-submodule-imports
import { Observable } from 'apollo-client/util/Observable';
import { ApolloLink, NextLink, Operation } from 'apollo-link';
import { Store } from 'redux';
import { RootState } from '../reducers';

/**
 * The purpose of the link is to proactively determine offline state
 * Otherwise, when offline, a spinner will be displayed and we have to wait before request times out
 */
class OfflineLink extends ApolloLink {
  private _store?: Store<RootState>;

  constructor(store?: Store<RootState>) {
    super();
    this._store = store;
  }

  set store(value: Store<RootState> | undefined) {
    this._store = value;
  }

  request(operation: Operation, forward?: NextLink) {
    if (this._store && !this._store.getState().network.isConnected) {
      return new Observable(() => {
        throw new Error('Network request failed');
      });
    }
    if (forward) {
      return forward(operation);
    }
    return null;
  }
}

export const offlineLink = new OfflineLink();
