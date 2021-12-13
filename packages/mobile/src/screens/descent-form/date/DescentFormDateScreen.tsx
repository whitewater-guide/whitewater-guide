import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import Spacer from '~/components/Spacer';
import { Screens } from '~/core/navigation';
import getSectionTimezone from '~/features/descents/getSectionTimezone';
import { DescentFormData } from '~/screens/descent-form/types';
import theme from '~/theme';

import { DescentFormScreen } from '../DescentFormContext';
import DatePicker from './DatePicker';
import { DescentFormDateNavProps } from './types';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: theme.margin.single,
  },
});

export const DescentFormDateScreen: React.FC<DescentFormDateNavProps> = ({
  navigation,
}) => {
  const { navigate } = navigation;
  const { t } = useTranslation();
  const {
    values: { section },
  } = useFormikContext<DescentFormData>();
  const timezone = getSectionTimezone(section);

  const onNext = useCallback(() => {
    navigate(Screens.DESCENT_FORM_LEVEL);
  }, [navigate]);

  return (
    <DescentFormScreen safeBottom>
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
        <Spacer />
        <Button mode="contained" onPress={onNext}>
          {t('commons:next')}
        </Button>
      </View>
    </DescentFormScreen>
  );
};
