import type { NamedNode } from '@whitewater-guide/schema';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Searchbar } from 'react-native-paper';

import Screen from '../../../components/Screen';
import theme from '../../../theme';
import { useAddSectionDraft } from '../AddSectionDraftContext';
import type { RiverScreenProps } from './navigation-types';
import type { RiversListDataItem } from './types';
import useRiversSearch from './useRiversSearch';

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  searchBar: {
    margin: theme.margin.single,
  },
  content: {
    paddingHorizontal: theme.margin.single,
  },
});

function RiverScreen({ route, navigation }: RiverScreenProps) {
  const { region } = route.params;
  const { t } = useTranslation();
  const { goBack } = navigation;
  const { draft, setDraft } = useAddSectionDraft();

  const onChange = useCallback(
    (river: NamedNode) => {
      setDraft((prev) => ({ ...prev, river }));
      goBack();
    },
    [setDraft, goBack],
  );

  const { search, onSearch, ...listProps } = useRiversSearch(
    region ?? null,
    draft.river?.name ?? '',
    onChange,
  );

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.kav} behavior="padding">
        <Searchbar
          placeholder={t('screens:addSection.river.searchPlaceholder')}
          onChangeText={onSearch}
          value={search}
          style={styles.searchBar}
          autoCorrect={false}
          autoComplete="off"
          autoFocus
          testID="river-searchbar"
          mode="view"
        />
        <SectionList<RiversListDataItem>
          {...listProps}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

export default RiverScreen;
