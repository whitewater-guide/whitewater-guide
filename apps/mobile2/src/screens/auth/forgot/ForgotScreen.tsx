import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Screens } from '../../../core/navigation';
import theme from '../../../theme';
import AuthScreenBase from '../AuthScreenBase';
import ForgotForm from './ForgotForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.margin.double,
  },
});

export function ForgotScreen() {
  const { t } = useTranslation();

  return (
    <AuthScreenBase testID={`screen:${Screens.AUTH_FORGOT}`}>
      <View style={styles.container}>
        <Text variant="titleLarge">{t('screens:auth.forgot.title')}</Text>
        <Text variant="bodyMedium">{t('screens:auth.forgot.description')}</Text>
        <ForgotForm />
      </View>
    </AuthScreenBase>
  );
}
