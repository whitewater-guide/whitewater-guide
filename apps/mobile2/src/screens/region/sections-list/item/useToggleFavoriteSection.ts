import { useNetInfo } from '@react-native-community/netinfo';
import { useState } from 'react';

import { showSnackbarError } from '../../../../components/snackbar';
import { useToggleFavoriteSectionMutation } from './toggleFavoriteSection.generated';

type Hook = [toggle: () => Promise<void>, toggling: boolean];

export function useToggleFavoriteSection(
  id: string,
  favorite?: boolean | null,
): Hook {
  const [mutate] = useToggleFavoriteSectionMutation();
  const { isInternetReachable } = useNetInfo();
  const [toggling, setToggling] = useState(false);

  const toggle = async () => {
    setToggling(true);
    try {
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
      });
    } catch (e) {
      showSnackbarError(e as Error);
    } finally {
      setToggling(false);
    }
  };

  return [toggle, toggling];
}
