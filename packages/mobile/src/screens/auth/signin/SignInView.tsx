import { useAuth } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { Divider } from '../../../components';
import theme from '../../../theme';
import { AuthScreenBase } from '../AuthScreenBase';
import { FacebookButton } from './FacebookButton';
import { SignInForm } from './SignInForm';

const styles = StyleSheet.create({
  fb: {
    marginTop: theme.margin.single,
  },
});

export const SignInView: React.FC = () => {
  const { service, loading } = useAuth();
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const [fbPressed, setFbPressed] = useState(false);
  const register = useCallback(() => navigate('AuthRegister'), [navigate]);
  const signInWithFB = useCallback(() => {
    setFbPressed(true);
    service.signIn('facebook').then(({ success }) => {
      setFbPressed(false);
      if (success) {
        navigate('RegionsList');
      }
    });
  }, [service.signIn, navigate, setFbPressed]);
  return (
    <AuthScreenBase>
      <View>
        <SignInForm />
        <FacebookButton
          style={styles.fb}
          onPress={loading ? undefined : signInWithFB}
          disabled={loading && !fbPressed}
          loading={loading && fbPressed}
        />
      </View>
      <View>
        <Divider label={t('screens:auth.signin.noAccount')} />
        <Button mode="text" onPress={register} disabled={loading}>
          {t('screens:auth.signin.register')}
        </Button>
      </View>
    </AuthScreenBase>
  );
};
