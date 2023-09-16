import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Button } from 'react-native-paper';
import MDCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

import { Screens } from '~/core/navigation';

import type { AuthMainNavProp } from './types';

interface Props {
  label: string;
}

const LocalButton: React.FC<Props> = ({ label }) => {
  const renderIcon = useCallback(
    ({ size, color }: any) => (
      <MDCommunity
        name="email"
        size={1.6 * size}
        color={color}
        style={{ width: 1.6 * size }}
      />
    ),
    [],
  );
  const paddedLabel = `  ${label.trim()}`;
  const { navigate } = useNavigation<AuthMainNavProp>();
  const onPress = useCallback(
    () => navigate(Screens.AUTH_REGISTER),
    [navigate],
  );
  return (
    <Button
      mode="contained"
      icon={renderIcon}
      onPress={onPress}
      testID="auth-main-local"
    >
      {paddedLabel}
    </Button>
  );
};

export default LocalButton;
