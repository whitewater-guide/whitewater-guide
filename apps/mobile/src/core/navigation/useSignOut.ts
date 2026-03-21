import { useApolloClient } from '@apollo/client';
import { useAuth } from '@whitewater-guide/clients';
import { useEffect } from 'react';

import { apolloCachePersistor } from '~/core/apollo';

import type { RootStackNav } from './navigation-params';
import { Screens } from './screen-names';

export default function useSignOut({ reset }: RootStackNav) {
  const { service } = useAuth();
  const apollo = useApolloClient();

  useEffect(
    () =>
      service.on('sign-out', async (_force: boolean) => {
        reset({
          index: 0,
          routes: [
            {
              name: Screens.ROOT_STACK,
              state: {
                index: 0,
                routes: [{ name: Screens.REGIONS_LIST }],
              },
            },
          ],
        });
        // See https://github.com/apollographql/apollo-cache-persist/issues/34#issuecomment-371177206 for explanation
        apolloCachePersistor.pause();
        await apolloCachePersistor.purge();
        await apollo.resetStore();
        apolloCachePersistor.resume();
      }),
    [service, apollo, reset],
  );
}
