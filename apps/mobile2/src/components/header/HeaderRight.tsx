import type { ReactNode } from 'react';
import { memo, useCallback } from 'react';
import { Appbar } from 'react-native-paper';

import theme from '../../theme';

interface HeaderRightProps {
  element?: ReactNode;
  searchAvailable?: boolean;
  searchActive?: boolean;
  setSearchActive?: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchInput?: (input: string) => void;
}

const HeaderRight = memo(
  ({
    element,
    searchAvailable,
    searchActive,
    setSearchActive,
    setSearchInput,
  }: HeaderRightProps) => {
    const toggleSearch = useCallback(() => {
      setSearchActive?.((m) => !m);
    }, [setSearchActive]);

    const resetSearch = useCallback(() => {
      setSearchInput?.('');
    }, [setSearchInput]);

    if (searchActive) {
      return (
        <Appbar.Action
          icon="close-circle"
          size={18}
          color={theme.colors.componentBorder}
          testID="header:search-clear"
          onPress={resetSearch}
        />
      );
    }

    return (
      <>
        {searchAvailable && (
          <Appbar.Action
            icon="magnify"
            color={theme.colors.textLight}
            testID="header:search-button"
            onPress={toggleSearch}
          />
        )}
        {element ?? null}
      </>
    );
  },
);

HeaderRight.displayName = 'HeaderRight';

export default HeaderRight;
