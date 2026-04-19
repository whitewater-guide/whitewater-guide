import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DescentLevelInput } from '@whitewater-guide/schema';
import { Formik, useFormikContext } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button } from 'react-native-paper';

import Screen from '../../../components/Screen';
import type { RootStackParamsList } from '../../../core/navigation';
import { Screens } from '../../../core/navigation';
import NumericField from '../../../forms/NumericField';
import TextField from '../../../forms/TextField';
import theme from '../../../theme';
import { useDescentFormDraft } from '../DescentFormDraftContext';
import type { DescentFormData } from '../types';
import DescentChartLayout from './DescentChartLayout';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.DESCENT_FORM_LEVEL
>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fields: {
    paddingHorizontal: theme.margin.single,
  },
  nextButton: {
    margin: theme.margin.single,
  },
});

type LevelValues = Pick<DescentFormData, 'level'>;

interface ContentProps {
  onSubmit: () => void;
}

function LevelFormContent({ onSubmit }: ContentProps) {
  const { t } = useTranslation();
  const { draft } = useDescentFormDraft();
  const { setFieldValue } = useFormikContext<LevelValues>();
  const { section, startedAt } = draft;

  const [scrollHeight, setScrollHeight] = useState(0);
  const onScrollLayout = useCallback((e: LayoutChangeEvent) => {
    setScrollHeight(e.nativeEvent.layout.height);
  }, []);

  const onLoaded = useCallback(
    (value?: DescentLevelInput) => {
      setFieldValue('level', value ?? null);
    },
    [setFieldValue],
  );

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView bottomOffset={35} onLayout={onScrollLayout}>
        <View style={{ minHeight: scrollHeight }}>
          <View style={styles.fields}>
            <NumericField
              name="level.value"
              label={t('screens:descentForm.level.valueLabel')}
              helperText={
                section && 'gauge' in section && section.gauge
                  ? `@ ${section.gauge.name}`
                  : undefined
              }
            />
            <TextField
              name="level.unit"
              label={t('screens:descentForm.level.unitLabel')}
              helperText={t('screens:descentForm.level.unitHelper')}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
            />
          </View>
          {!!section && !!startedAt && !!scrollHeight && (
            <DescentChartLayout
              section={section}
              startedAt={startedAt}
              onLoaded={onLoaded}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
      <Button mode="contained" onPress={onSubmit} style={styles.nextButton}>
        {t('commons:next')}
      </Button>
    </View>
  );
}

function DescentFormLevelScreen({ navigation }: Props) {
  const { draft, setDraft } = useDescentFormDraft();

  const initialValues = useMemo<LevelValues>(
    () => ({ level: draft.level ?? null }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onNext = useCallback(
    (values: LevelValues) => {
      setDraft((prev) => ({ ...prev, level: values.level }));
      navigation.navigate(Screens.DESCENT_FORM_COMMENT);
    },
    [setDraft, navigation],
  );

  return (
    <Screen safeBottom style={styles.container}>
      <Formik initialValues={initialValues} onSubmit={onNext}>
        {({ submitForm }) => <LevelFormContent onSubmit={submitForm} />}
      </Formik>
    </Screen>
  );
}

export default DescentFormLevelScreen;
