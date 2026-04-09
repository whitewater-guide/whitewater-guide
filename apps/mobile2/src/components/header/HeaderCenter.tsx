import type { ReactNode, RefObject } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, TextInput } from 'react-native';
import { Appbar } from 'react-native-paper';

import theme from '../../theme';

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 18,
    paddingLeft: 8,
    alignSelf: 'stretch',
    minWidth: 0,
    color: theme.colors.textMain,
  },
});

interface HeaderCenterProps {
  title?: ReactNode;
  searchActive?: boolean;
  searchInput?: string;
  setSearchInput?: (input: string) => void;
  searchInputRef?: RefObject<TextInput | null>;
  searchPlaceholderKey?: string;
}

const HeaderCenter = memo(
  ({
    title,
    searchActive,
    searchInput,
    setSearchInput,
    searchInputRef,
    searchPlaceholderKey = 'commons:defaultSearchPlaceholder',
  }: HeaderCenterProps) => {
    const { t } = useTranslation();
    if (searchActive) {
      return (
        <TextInput
          ref={searchInputRef}
          style={styles.input}
          placeholder={t(searchPlaceholderKey)}
          placeholderTextColor={theme.colors.border}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          accessibilityRole="search"
          onChangeText={setSearchInput}
          value={searchInput}
        />
      );
    }
    return (
      <Appbar.Content
        title={typeof title === 'string' ? title : (title ?? '')}
        onPress={Keyboard.dismiss}
      />
    );
  },
);

HeaderCenter.displayName = 'HeaderCenter';

export default HeaderCenter;
