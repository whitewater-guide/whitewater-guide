import { useNavigation } from '@react-navigation/native';
import type { NamedNode } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  SectionList,
  StyleSheet,
} from 'react-native';
import { Searchbar } from 'react-native-paper';

import { Screen } from '~/components/Screen';
import theme from '~/theme';

import type { SectionFormInput } from '../types';
import type { RiversListDataItem } from './types';
import useRiversSearch from './useRiversSearch';

const styles = StyleSheet.create({
  searchBar: {
    margin: theme.margin.single,
  },
  content: {
    paddingHorizontal: theme.margin.single,
  },
  kav: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const RiverScreen: React.FC = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const { values, setFieldValue } = useFormikContext<SectionFormInput>();

  const onChange = useCallback(
    (v: NamedNode) => {
      setFieldValue('river', v);
      goBack();
    },
    [setFieldValue, goBack],
  );

  const { search, onSearch, ...listProps } = useRiversSearch(
    values?.river?.name ?? '',
    onChange,
  );
  return (
    <Screen>
      <Searchbar
        placeholder={t('screens:addSection.river.searchPlaceholder')}
        onChangeText={onSearch}
        value={search}
        style={styles.searchBar}
        autoCorrect={false}
        autoComplete="off"
        autoFocus
        testID="river-searchbar"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kav}
        keyboardVerticalOffset={82}
      >
        <SectionList<RiversListDataItem>
          {...listProps}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
        />
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default RiverScreen;
