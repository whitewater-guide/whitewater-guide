import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { showSnackbar, showSnackbarError } from '../../components/snackbar';
import type { RootStackParamsList } from '../../core/navigation';
import { i18n } from '../../i18n';
import { useDeleteDescentMutation } from './deleteDescent.generated';

export default function useDeleteDescent(descentId: string) {
  const { goBack } =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();
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
