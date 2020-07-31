import { DescentLevelInput } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { Screens } from '~/core/navigation';
import NumericField from '~/forms/NumericField';
import TextField from '~/forms/TextField';
import { DescentFormDateNavProps } from '~/screens/descent-form/date/types';
import { DescentFormData } from '../types';
import { DescentChartLayout } from './chart';

const DescentFormLevelView: React.FC<DescentFormDateNavProps> = ({
  navigation,
}) => {
  const { navigate } = navigation;
  const { t } = useTranslation();
  const {
    setFieldValue,
    values: { startedAt, section },
  } = useFormikContext<DescentFormData>();
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
    <React.Fragment>
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
      {section?.gauge && (
        <DescentChartLayout
          section={section}
          startedAt={startedAt}
          onLoaded={onLoaded}
        />
      )}
      <Button mode="contained" onPress={onNext}>
        {t('commons:next')}
      </Button>
    </React.Fragment>
  );
};

export default DescentFormLevelView;
