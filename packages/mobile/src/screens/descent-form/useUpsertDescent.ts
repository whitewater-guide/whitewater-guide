import { useNavigation } from '@react-navigation/native';
import { getValidationErrors } from '@whitewater-guide/clients';
import { omitTypename } from '@whitewater-guide/commons';
import { FormikHelpers } from 'formik';
import gql from 'graphql-tag';
import isNil from 'lodash/isNil';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';

import { useSnackbarMessage } from '~/components/snackbar';

import { DescentFormData } from './types';

const UPSERT_DESCENT = gql`
  mutation upsertDescent($descent: DescentInput!, $shareToken: String) {
    upsertDescent(descent: $descent, shareToken: $shareToken) {
      id

      startedAt
      duration
      level {
        value
        unit
      }
      comment
      public

      createdAt
      updatedAt

      section {
        id
        name
        river {
          id
          name
        }
        region {
          id
          name
        }
      }
    }
  }
`;

export default () => {
  const { t } = useTranslation();
  const [mutate] = useMutation(UPSERT_DESCENT);
  const { goBack } = useNavigation();
  const setSnackbar = useSnackbarMessage();
  return useCallback(
    (
      { section, level, ...data }: DescentFormData,
      helpers: FormikHelpers<DescentFormData>,
    ) =>
      mutate({
        variables: {
          descent: {
            ...omitTypename(data),
            level: isNil(level?.value) ? null : level,
            sectionId: section.id,
          },
        },
        refetchQueries: ['listMyDescents'],
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
        .catch(() => {
          setSnackbar({
            short: t('common:networkError'),
            error: true,
          });
        }),
    [mutate, goBack, setSnackbar, t],
  );
};
