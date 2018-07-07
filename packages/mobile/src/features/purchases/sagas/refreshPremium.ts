import { apply } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { getApolloClient } from '../../../core/apollo';
import { RefreshPremiumPayload } from '../types';
import { PREMIUM_DIALOG_QUERY } from './premiumDialog.query';

export function* refreshPremium(action: Action<RefreshPremiumPayload>) {
  const client = getApolloClient();
  yield apply(
    client,
    client.query,
    [{
      query: PREMIUM_DIALOG_QUERY,
      variables: action.payload,
      fetchPolicy: 'network-only',
    }],
  );
}
