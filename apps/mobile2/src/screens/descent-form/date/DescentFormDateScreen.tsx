import { Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import Screen from '../../../components/Screen';
import { Screens } from '../../../core/navigation';
import getSectionTimezone from '../../../features/descents/getSectionTimezone';
import theme from '../../../theme';
import { useDescentFormDraft } from '../DescentFormDraftContext';
import DatePicker from './DatePicker';
import type { DescentFormDateScreenProps } from './navigation-types';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: theme.margin.single,
  },
  spacer: { flex: 1 },
});

function DescentFormDateScreen({ navigation }: DescentFormDateScreenProps) {
  const { t } = useTranslation();
  const { draft, setDraft } = useDescentFormDraft();
  const timezone = getSectionTimezone(draft.section);

  const initialValues = useMemo(
    () => ({ startedAt: draft.startedAt ?? new Date().toISOString() }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onNext = useCallback(
    (values: { startedAt: string }) => {
      setDraft((prev) => ({ ...prev, startedAt: values.startedAt }));
      navigation.navigate(Screens.DESCENT_FORM_LEVEL);
    },
    [setDraft, navigation],
  );

  return (
    <Formik initialValues={initialValues} onSubmit={onNext}>
      {({ submitForm }) => (
        <Screen safeBottom>
          <View style={styles.content}>
            <TextInput
              label={t('screens:descentForm.date.startedAt.timezone')}
              value={timezone}
              mode="outlined"
              editable={false}
              autoFocus={false}
              autoComplete="off"
            />
            <DatePicker name="startedAt" timezone={timezone} />
            <View style={styles.spacer} />
            <Button mode="contained" onPress={submitForm}>
              {t('commons:next')}
            </Button>
          </View>
        </Screen>
      )}
    </Formik>
  );
}

export default DescentFormDateScreen;
