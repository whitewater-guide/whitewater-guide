import React, { useCallback } from 'react';
import { Button, PartialIconProps } from 'react-native-paper';
import MDCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from 'react-navigation-hooks';
import Screens from '../../screen-names';

interface Props {
  label: string;
}

const LocalButton: React.FC<Props> = ({ label }) => {
  const renderIcon = useCallback(
    ({ size, color }: PartialIconProps) => (
      <MDCommunity
        name="email"
        size={1.6 * size}
        color={color}
        style={{ width: 1.6 * size }}
      />
    ),
    [],
  );
  const paddedLabel = '  ' + label.trim();
  const { navigate } = useNavigation();
  const onPress = useCallback(() => navigate(Screens.Auth.Register), [
    navigate,
  ]);
  return (
    <Button mode="contained" icon={renderIcon} onPress={onPress}>
      {paddedLabel}
    </Button>
  );
};

export default LocalButton;
