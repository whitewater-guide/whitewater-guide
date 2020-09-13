import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import MDCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

import { Screens } from '~/core/navigation';

import theme from '../../theme';
import { AuthStackNavProp } from './types';

const styles = StyleSheet.create({
  fb: {
    marginTop: theme.margin.single,
  },
});

interface Props {
  label: string;
}

export const FacebookButton: React.FC<Props> = ({ label }) => {
  const { service, loading } = useAuth();
  const { navigate } = useNavigation<AuthStackNavProp>();
  const [fbPressed, setFbPressed] = useState(false);
  const signInWithFB = useCallback(() => {
    setFbPressed(true);
    service.signIn('facebook').then(({ success, isNew }) => {
      setFbPressed(false);
      if (!success) {
        return;
      }
      if (isNew) {
        navigate(Screens.AUTH_WELCOME, { verified: true });
      } else {
        navigate(Screens.REGIONS_LIST);
      }
    });
  }, [service.signIn, navigate, setFbPressed]);

  const renderIcon = useCallback(
    ({ size, color }: any) => (
      <MDCommunity
        name="facebook"
        size={1.8 * size}
        color={color}
        style={{ width: 1.8 * size }}
      />
    ),
    [],
  );
  const paddedLabel = '  ' + label.trim();

  return (
    <Button
      mode="contained"
      color={theme.colors.facebook}
      icon={renderIcon}
      style={styles.fb}
      onPress={loading ? undefined : signInWithFB}
      disabled={loading && !fbPressed}
      loading={loading && fbPressed}
    >
      {paddedLabel}
    </Button>
  );
};
