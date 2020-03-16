import React, { useCallback } from 'react';
import { Appbar } from 'react-native-paper';
import theme from '~/theme';

interface Props {
  element?: React.ReactNode;
  hasPrevious: boolean;
  topLevel?: boolean;
  onMenu: () => void;
  onBack: () => void;
  headerTintColor?: string;

  searchActive?: boolean;
  setSearchActive?: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchInput?: (input: string) => void;
}

const HeaderLeft: React.FC<Props> = React.memo((props) => {
  const {
    element,
    hasPrevious,
    topLevel,
    onMenu,
    onBack,
    headerTintColor,
    searchActive,
    setSearchActive,
    setSearchInput,
  } = props;

  const cancelSearch = useCallback(() => {
    if (setSearchActive) {
      setSearchActive(false);
    }
    if (setSearchInput) {
      setSearchInput('');
    }
  }, [setSearchActive, setSearchInput]);

  if (searchActive) {
    return (
      <Appbar.Action
        icon="chevron-left"
        size={36}
        onPress={cancelSearch}
        color={theme.colors.primary}
        testID="header-search-back"
      />
    );
  }
  if (element !== undefined) {
    return element as any;
  }
  if (hasPrevious || !topLevel) {
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
});

HeaderLeft.displayName = 'HeaderLeft';

export default HeaderLeft;
