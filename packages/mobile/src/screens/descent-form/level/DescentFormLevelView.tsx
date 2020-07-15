import { LevelInput } from '@whitewater-guide/logbook-schema';
import { useField, useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { Screens } from '~/core/navigation';
import NumericField from '~/forms/NumericField';
import TextField from '~/forms/TextField';
import { DescentFormDateNavProps } from '~/screens/descent-form/date/types';
import { DescentFormScreen, useUpstreamSection } from '../DescentFormContext';
import { DescentFormData } from '../types';
import { DescentChartLayout } from './chart';

const DescentFormLevelView: React.FC<DescentFormDateNavProps> = ({
  navigation,
}) => {
  const { navigate } = navigation;
  const { t } = useTranslation();
  const { upstreamSection } = useUpstreamSection();
  const [{ value: startedAt }] = useField<Date>('startedAt');
  const { setFieldValue } = useFormikContext<DescentFormData>();
  const onLoaded = useCallback(
    (value?: LevelInput) => {
      setFieldValue('level', value);
    },
    [setFieldValue],
  );
  const onNext = useCallback(() => {
    navigate(Screens.DESCENT_FORM_COMMENT);
  }, [navigate]);
  return (
    <DescentFormScreen padding={true}>
      <NumericField
        name="level.value"
        label={t('screens:descentForm.level.valueLabel')}
      />
      <TextField
        name="level.unit"
        label={t('screens:descentForm.level.unitLabel')}
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="off"
      />
      {upstreamSection?.gauge && (
        <DescentChartLayout
          section={upstreamSection}
          startedAt={startedAt}
          onLoaded={onLoaded}
        />
      )}
      <Button mode="contained" onPress={onNext}>
        {t('commons:next')}
      </Button>
    </DescentFormScreen>
  );
};

export default DescentFormLevelView;
