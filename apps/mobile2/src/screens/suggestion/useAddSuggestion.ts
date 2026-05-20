import { fetch as fetchNetinfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getValidationErrors } from '@whitewater-guide/clients';
import type { SuggestionInput } from '@whitewater-guide/schema';
import type { FormikHelpers } from 'formik';
import { useCallback } from 'react';
import { Keyboard } from 'react-native';

import { showSnackbar, showSnackbarError } from '../../components/snackbar';
import type { RootStackParamsList, Screens } from '../../core/navigation';
import { i18n } from '../../i18n';
import { useAddSuggestionMutation } from './addSuggestion.generated';

export default () => {
  const [mutate] = useAddSuggestionMutation();
  const { goBack } =
    useNavigation<
      NativeStackNavigationProp<RootStackParamsList, typeof Screens.SUGGESTION>
    >();
  return useCallback(
    (suggestion: SuggestionInput, helpers: FormikHelpers<SuggestionInput>) => {
      Keyboard.dismiss();
      return mutate({ variables: { suggestion } })
        .then((resp) => {
          if (resp.errors) {
            showSnackbarError(resp.errors[0] as unknown as Error);
            helpers.setErrors(getValidationErrors(resp.errors as any[]));
          } else {
            showSnackbar(i18n.t('screens:suggestion.successMessage'));
            goBack();
          }
        })
        .catch((error: Error) => {
          let offline = false;
          fetchNetinfo()
            .then(({ isInternetReachable }) => {
              offline = isInternetReachable === false;
            })
            .finally(() => {
              if (offline) {
                showSnackbar(i18n.t('common:networkError'));
              } else {
                showSnackbarError(error);
              }
            });
        });
    },
    [mutate, goBack],
  );
};
