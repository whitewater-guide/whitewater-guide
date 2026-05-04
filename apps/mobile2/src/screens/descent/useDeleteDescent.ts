import { useNavigation } from '@react-navigation/native';

import { showSnackbar, showSnackbarError } from '../../components/snackbar';
import { i18n } from '../../i18n';
import { useDeleteDescentMutation } from './deleteDescent.generated';
import type { DescentScreenProps } from './navigation-types';

export default function useDeleteDescent(descentId: string) {
  const { goBack } = useNavigation<DescentScreenProps['navigation']>();
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
            showSnackbarError(resp.errors[0] as unknown as Error);
          } else {
            goBack();
            showSnackbar(i18n.t('screens:descent.deleteSuccess'));
          }
        })
        .catch((error: Error) => {
          showSnackbarError(error);
        }),
  };
}
