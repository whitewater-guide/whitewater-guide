import { memo } from 'react';
import { Appbar } from 'react-native-paper';

interface HeaderLeftProps {
  topLevel: boolean;
  canGoBack: boolean;
  onBack: () => void;
  onMenu: () => void;
}

const HeaderLeft = memo(
  ({ topLevel, canGoBack, onBack, onMenu }: HeaderLeftProps) => {
    if (canGoBack && !topLevel) {
      return (
        <Appbar.Action
          icon="chevron-left"
          size={36}
          onPress={onBack}
          isLeading
          testID="header:back"
        />
      );
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

export default HeaderLeft;
