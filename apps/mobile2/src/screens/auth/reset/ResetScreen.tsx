import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Screens } from '../../../core/navigation';
import theme from '../../../theme';
import AuthScreenBase from '../AuthScreenBase';
import MissingParams from './MissingParams';
import type { ResetScreenProps } from './navigation-types';
import ResetForm from './ResetForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.margin.double,
  },
});

export function ResetScreen({ route }: ResetScreenProps) {
  const { token } = route.params ?? {};
  const { t } = useTranslation();

  return (
    <AuthScreenBase testID={`screen:${Screens.AUTH_RESET}`}>
      <View style={styles.container}>
        <Text variant="titleLarge">{t('screens:auth.reset.title')}</Text>
        <Text variant="bodyMedium">{t('screens:auth.reset.description')}</Text>
        {token ? <ResetForm id="" token={token} /> : <MissingParams />}
      </View>
    </AuthScreenBase>
  );
}
