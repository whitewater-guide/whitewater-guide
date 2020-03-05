import React from 'react';
import { Appbar } from 'react-native-paper';

interface Props {
  headerLeft?: React.ReactElement | null;
  index: number;
  topLevel?: boolean;
  onMenu: () => void;
  onBack: () => void;
  headerTintColor?: string;
}

const HeaderLeft: React.FC<Props> = (props) => {
  const {
    headerLeft,
    index,
    topLevel,
    onMenu,
    onBack,
    headerTintColor,
  } = props;
  if (headerLeft === null || !!headerLeft) {
    return headerLeft;
  }
  if (index || !topLevel) {
    return (
      <Appbar.Action
        icon="chevron-left"
        size={36}
        onPress={onBack}
        color={headerTintColor}
        testID="header-back"
      />
    );
  }
  return (
    <Appbar.Action
      icon="menu"
      onPress={onMenu}
      color={headerTintColor}
      testID="header-menu"
    />
  );
};

export default HeaderLeft;
