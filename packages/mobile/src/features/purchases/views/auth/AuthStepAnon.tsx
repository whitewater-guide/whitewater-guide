import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, Paragraph, Subheading } from 'react-native-paper';
import Screens from '../../../../screens/screen-names';
import theme from '../../../../theme';

const styles = StyleSheet.create({
  button: {
    marginTop: theme.margin.double,
  },
});

interface Props {
  onCancel?: () => void;
}

const AuthStepAnon: React.FC<Props> = ({ onCancel }) => {
  const navigation = useNavigation();
  const signIn = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    navigation.navigate(Screens.Auth.Main);
  }, [navigation, onCancel]);
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Subheading>{t('features:purchases.auth.anon.header')}</Subheading>
      <Paragraph>{t('features:purchases.auth.anon.description')}</Paragraph>
      <Button mode="contained" style={styles.button} onPress={signIn}>
        {t('features:purchases.auth.anon.button')}
      </Button>
    </React.Fragment>
  );
};

export default AuthStepAnon;
