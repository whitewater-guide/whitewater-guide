import React from 'react';
import { Appbar } from 'react-native-paper';

interface HeaderLeftProps {
  topLevel: boolean;
  canGoBack: boolean;
  onBack: () => void;
  onMenu: () => void;
}

const HeaderLeft: React.FC<HeaderLeftProps> = React.memo(
  ({ topLevel, canGoBack, onBack, onMenu }) => {
    if (canGoBack && !topLevel) {
      return <Appbar.BackAction onPress={onBack} testID="header:back" />;
    }
    return (
      <Appbar.Action
        icon="menu"
        onPress={onMenu}
        isLeading
        testID="header:menu"
      />
    );
  },
);

HeaderLeft.displayName = 'HeaderLeft';

export default HeaderLeft;
