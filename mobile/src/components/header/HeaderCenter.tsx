import React from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, TextInput } from 'react-native';
import { Appbar } from 'react-native-paper';

import theme from '~/theme';

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

interface Props {
  title?: React.ReactNode;
  headerTintColor?: string;

  searchActive?: boolean;
  setSearchInput?: (input: string) => void;
  searchString: string;
  searchPlaceholderKey?: string;
  searchInputRef: React.RefObject<TextInput>;
}

const HeaderCenter: React.FC<Props> = React.memo((props: Props) => {
  const {
    title,
    headerTintColor,
    setSearchInput,
    searchActive,
    searchString,
    searchPlaceholderKey = 'commons:defaultSearchPlaceholder',
    searchInputRef,
  } = props;
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
        accessibilityTraits="search"
        accessibilityRole="search"
        onChangeText={setSearchInput}
        value={searchString}
      />
    );
  }
  return (
    <Appbar.Content
      title={title}
      onPress={Keyboard.dismiss}
      color={headerTintColor}
    />
  );
});

HeaderCenter.displayName = 'HeaderCenter';

export default HeaderCenter;
