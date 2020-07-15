import { useNavigation } from '@react-navigation/native';
import { getValidationErrors } from '@whitewater-guide/clients';
import {
  LogbookDescentAll,
  MutationUpsertLogbookDescentArgs,
} from '@whitewater-guide/logbook-schema';
import { FormikHelpers } from 'formik';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useSnackbarMessage } from '~/components/snackbar';
import { DescentFormData } from './types';

const UPSERT_DESCENT = gql`
  mutation upsertLogbookDescent(
    $descent: LogbookDescentInput!
    $shareToken: String
  ) {
    upsertLogbookDescent(descent: $descent, shareToken: $shareToken) {
      ...logbookDescentAll
    }
  }
  ${LogbookDescentAll}
`;

export default () => {
  const { t } = useTranslation();
  const [mutate] = useMutation<any, MutationUpsertLogbookDescentArgs>(
    UPSERT_DESCENT,
  );
  const { goBack } = useNavigation();
  const setSnackbar = useSnackbarMessage();
  return useCallback(
    (data: DescentFormData, helpers: FormikHelpers<DescentFormData>) =>
      mutate({
        variables: {
          descent: {
            ...data,
            startedAt: data.startedAt.toISOString(),
          },
        },
        refetchQueries: ['listMyLogbookDescents'],
      })
        .then((resp) => {
          if (resp.errors) {
            setSnackbar(resp.errors[0]);
            helpers.setErrors(getValidationErrors(resp.errors));
          } else {
            setSnackbar({
              short: data.id
                ? t('screens:descentForm.updateSuccessMessage')
                : t('screens:descentForm.createSuccessMessage'),
            });
            goBack();
          }
        })
        .catch((error: Error) => {
          setSnackbar(error);
        }),
    [mutate, goBack, setSnackbar, t],
  );
};
