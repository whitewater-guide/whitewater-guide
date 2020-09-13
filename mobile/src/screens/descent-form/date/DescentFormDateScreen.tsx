import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { Screens } from '~/core/navigation';
import theme from '~/theme';

import { DescentFormScreen } from '../DescentFormContext';
import DatePicker from './DatePicker';
import { DescentFormDateNavProps } from './types';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.margin.single,
  },
});

export const DescentFormDateScreen: React.FC<DescentFormDateNavProps> = ({
  navigation,
}) => {
  const { navigate } = navigation;
  const { t } = useTranslation();
  const onNext = useCallback(() => {
    navigate(Screens.DESCENT_FORM_LEVEL);
  }, [navigate]);
  return (
    <DescentFormScreen safeBottom={true}>
      <View style={styles.content}>
        <DatePicker name="startedAt" />
        <Button mode="contained" onPress={onNext}>
          {t('commons:next')}
        </Button>
      </View>
    </DescentFormScreen>
  );
};
