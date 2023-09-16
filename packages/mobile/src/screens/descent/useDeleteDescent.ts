import { useNavigation } from '@react-navigation/native';

import showSnackbarError from '~/components/showSnackbarError';
import showSnackbarMessage from '~/components/showSnackbarMessage';
import type { RootStackNav } from '~/core/navigation';

import { useDeleteDescentMutation } from './deleteDescent.generated';

export default (descentId: string) => {
  const { goBack } = useNavigation<RootStackNav>();
  const [mutate, { loading }] = useDeleteDescentMutation({
    variables: { id: descentId },
    refetchQueries: ['listMyDescents'],
  });
  return {
    loading,
    deleteDescent: () =>
      mutate()
        .then((resp) => {
          if (resp.errors) {
            showSnackbarError(resp.errors[0]);
          } else {
            goBack();
            showSnackbarMessage('screens:descent.deleteSuccess');
          }
        })
        .catch((error) => {
          showSnackbarError(error);
        }),
  };
};
