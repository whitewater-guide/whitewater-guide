import { useAuth } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, PartialIconProps } from 'react-native-paper';
import MDCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../theme';
import Screens from '../screen-names';

const styles = StyleSheet.create({
  fb: {
    marginTop: theme.margin.single,
  },
});

interface Props {
  label: string;
}

export const FacebookButton: React.FC<Props> = React.memo(({ label }) => {
  const { service, loading } = useAuth();
  const { navigate } = useNavigation();
  const [fbPressed, setFbPressed] = useState(false);
  const signInWithFB = useCallback(() => {
    setFbPressed(true);
    service.signIn('facebook').then(({ success, isNew }) => {
      setFbPressed(false);
      if (!success) {
        return;
      }
      if (isNew) {
        navigate(Screens.Auth.Welcome, { verified: true });
      } else {
        navigate('RegionsList');
      }
    });
  }, [service.signIn, navigate, setFbPressed]);

  const renderIcon = useCallback(
    ({ size, color }: PartialIconProps) => (
      <MDCommunity
        name="facebook-box"
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
});

FacebookButton.displayName = 'FacebookButton';
