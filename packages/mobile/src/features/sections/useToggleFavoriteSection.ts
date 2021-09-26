import { useNetInfo } from '@react-native-community/netinfo';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import showSnackbarError from '~/components/showSnackbarError';

import { useToggleFavoriteSectionMutation } from './toggleFavoriteSection.generated';

type Hook = [() => Promise<void>, boolean];

export default function useToggleFavoriteSection(
  id: string,
  favorite?: boolean | null,
): Hook {
  const [mutate] = useToggleFavoriteSectionMutation();
  const { isInternetReachable } = useNetInfo();

  const [{ loading }, toggleFavorite] = useAsyncFn(async () => {
    await mutate({
      variables: { id, favorite: !favorite },
      optimisticResponse: isInternetReachable
        ? {
            toggleFavoriteSection: {
              __typename: 'Section',
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
