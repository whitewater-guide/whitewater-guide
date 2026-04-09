import { memo, useCallback } from 'react';
import { Appbar } from 'react-native-paper';

import theme from '../../theme';

interface HeaderLeftProps {
  topLevel: boolean;
  canGoBack: boolean;
  onBack: () => void;
  onMenu: () => void;
  searchActive?: boolean;
  setSearchActive?: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchInput?: (input: string) => void;
}

const HeaderLeft = memo(
  ({
    topLevel,
    canGoBack,
    onBack,
    onMenu,
    searchActive,
    setSearchActive,
    setSearchInput,
  }: HeaderLeftProps) => {
    const cancelSearch = useCallback(() => {
      setSearchActive?.(false);
      setSearchInput?.('');
    }, [setSearchActive, setSearchInput]);

    if (searchActive) {
      return (
        <Appbar.Action
          icon="chevron-left"
          size={36}
          onPress={cancelSearch}
          color={theme.colors.primary}
          isLeading
          testID="header:search-back"
        />
      );
    }
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

HeaderLeft.displayName = 'HeaderLeft';

export default HeaderLeft;
