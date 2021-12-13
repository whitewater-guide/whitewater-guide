import { useLayout } from '@react-native-community/hooks';
import { DescentLevelInput } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native-paper';

import { Screens } from '~/core/navigation';
import NumericField from '~/forms/NumericField';
import TextField from '~/forms/TextField';
import { DescentFormDateNavProps } from '~/screens/descent-form/date/types';

import { DescentFormData } from '../types';
import { DescentChartLayout } from './chart';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const DescentFormLevelView: React.FC<DescentFormDateNavProps> = ({
  navigation,
}) => {
  const { navigate } = navigation;
  const { t } = useTranslation();
  const {
    setFieldValue,
    values: { startedAt, section },
  } = useFormikContext<DescentFormData>();

  const { height, onLayout } = useLayout();

  const onLoaded = useCallback(
    (value?: DescentLevelInput) => {
      setFieldValue('level', value);
    },
    [setFieldValue],
  );

  const onNext = useCallback(() => {
    navigate(Screens.DESCENT_FORM_COMMENT);
  }, [navigate]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView onLayout={onLayout}>
        <View style={{ minHeight: height }}>
          <NumericField
            name="level.value"
            label={t('screens:descentForm.level.valueLabel')}
            helperText={
              'gauge' in section ? `@ ${section.gauge?.name}` : undefined
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
          {'gauge' in section && !!height && (
            <DescentChartLayout
              section={section}
              startedAt={startedAt}
              onLoaded={onLoaded}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
      <Button mode="contained" onPress={onNext}>
        {t('commons:next')}
      </Button>
    </View>
  );
};

export default DescentFormLevelView;
