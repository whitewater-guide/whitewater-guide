import { AppleButton as NativeAppleButton } from '@invertase/react-native-apple-authentication';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Screens } from '~/core/navigation';
import { AuthStackNavProp } from '~/screens/auth/types';
import theme from '~/theme';

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginTop: theme.margin.single,
    height: 35,
  },
});

const AppleButton: React.FC = () => {
  const { service, loading } = useAuth();
  const { navigate } = useNavigation<AuthStackNavProp>();
  const signInWithApple = useCallback(() => {
    service.signIn('apple').then(({ success, isNew }) => {
      if (!success) {
        return;
      }
      if (isNew) {
        navigate(Screens.AUTH_WELCOME, { verified: true });
      } else {
        navigate(Screens.REGIONS_LIST);
      }
    });
  }, [service.signIn, navigate]);
  return (
    <NativeAppleButton
      buttonStyle={NativeAppleButton.Style.BLACK}
      buttonType={NativeAppleButton.Type.SIGN_UP}
      onPress={loading ? undefined : signInWithApple}
      style={styles.button}
    />
  );
};

export default AppleButton;
