import { useAuth } from '@whitewater-guide/clients';
import { useEffect } from 'react';
import { useApolloClient } from 'react-apollo';

import { apolloCachePersistor } from '~/core/apollo';

import { RootStackNav } from './navigation-params';
import { Screens } from './screen-names';

export default (navigation: RootStackNav) => {
  const { service } = useAuth();
  const apollo = useApolloClient();
  useEffect(() => {
    return service.on('sign-out', async (force: boolean) => {
      navigation.reset({
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
      apolloCachePersistor.pause();
      await apolloCachePersistor.purge();
      await apollo.resetStore();
      apolloCachePersistor.resume();
    });
  }, []);
};
