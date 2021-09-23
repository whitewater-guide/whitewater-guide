import { useNetInfo } from '@react-native-community/netinfo';
import { useCallback } from 'react';

import showSnackbarError from '~/components/showSnackbarError';

import { useToggleFavoriteRegionMutation } from './toggleFavoriteRegion.generated';

type Hook = [() => void, boolean];

export default function useToggleFavoriteRegion(
  id: string,
  favorite?: boolean | null,
): Hook {
  const [mutate, { loading }] = useToggleFavoriteRegionMutation();
  const { isInternetReachable } = useNetInfo();

  const toggleFavorite = useCallback(() => {
    mutate({
      variables: { id, favorite: !favorite },
      optimisticResponse: isInternetReachable
        ? {
            toggleFavoriteRegion: {
              __typename: 'Region',
              id,
              favorite: !favorite,
            },
          }
        : undefined,
    }).catch((e) => {
      showSnackbarError(e);
    });
  }, [mutate, id, favorite, isInternetReachable]);

  return [toggleFavorite, loading];
}
