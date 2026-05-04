import { useNavigation } from '@react-navigation/native';
import isNil from 'lodash/isNil';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { showSnackbar, showSnackbarError } from '../../components/snackbar';
import { Screens } from '../../core/navigation';
import { useDescentFormDraft } from './DescentFormDraftContext';
import type { DescentFormSectionScreenProps } from './section/navigation-types';
import type { DescentFormData } from './types';
import { useUpsertDescentMutation } from './upsertDescent.generated';

export default function useUpsertDescent() {
  const [mutate] = useUpsertDescentMutation();
  const { t } = useTranslation();
  const navigation =
    useNavigation<DescentFormSectionScreenProps['navigation']>();
  const { resetDraft } = useDescentFormDraft();

  return useCallback(
    async ({ section, level, ...data }: DescentFormData) => {
      try {
        const resp = await mutate({
          variables: {
            descent: {
              ...data,
              level: isNil(level?.value) ? null : level,
              sectionId: section.id,
            },
          },
          refetchQueries: ['listMyDescents'],
        });
        if (resp.errors?.length) {
          showSnackbarError(resp.errors[0].message);
        } else {
          showSnackbar(
            t(
              data.id
                ? 'screens:descentForm.updateSuccessMessage'
                : 'screens:descentForm.createSuccessMessage',
            ),
          );
          resetDraft();
          navigation.navigate(Screens.LOGBOOK);
        }
      } catch {
        showSnackbarError(t('common:networkError'));
      }
    },
    [mutate, t, navigation, resetDraft],
  );
}
