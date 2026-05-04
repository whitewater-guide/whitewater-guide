import type { ListRenderItemInfo } from '@shopify/flash-list';
import { FlashList } from '@shopify/flash-list';
import type { NamedNode, RefInput } from '@whitewater-guide/schema';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Searchbar } from 'react-native-paper';

import Screen from '../../../components/Screen';
import theme from '../../../theme';
import { useAddSectionDraft } from '../AddSectionDraftContext';
import EmptyListPlaceholder from './EmptyListPlaceholder';
import type { ListedGaugeFragment } from './findGauges.generated';
import GaugeListHeader from './GaugeListHeader';
import GaugesListItem from './GaugesListItem';
import GaugesListSeparator from './GaugesListSeparator';
import type { GaugeScreenProps } from './navigation-types';
import useGaugesQuery from './useGaugesQuery';

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  searchBar: {
    marginTop: theme.margin.single,
    marginHorizontal: theme.margin.single,
  },
  content: {
    padding: theme.margin.single,
  },
});

const keyExtractor = ({ id }: NamedNode) => id;

function GaugeScreen({ route, navigation }: GaugeScreenProps) {
  const { region } = route.params;
  const { t } = useTranslation();
  const { goBack } = navigation;
  const { draft, setDraft } = useAddSectionDraft();
  const value = draft.gauge;

  const onChange = useCallback(
    (gauge: RefInput) => {
      setDraft((prev) => ({ ...prev, gauge }));
      goBack();
    },
    [setDraft, goBack],
  );

  const [search, onChangeInput, loading, gauges] = useGaugesQuery(
    region,
    value?.name ?? '',
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ListedGaugeFragment>) => (
      <GaugesListItem gauge={item} onPress={onChange} />
    ),
    [onChange],
  );

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.kav} behavior="padding">
        <Searchbar
          placeholder={t('screens:addSection.gauge.searchPlaceholder')}
          onChangeText={onChangeInput}
          value={search}
          style={styles.searchBar}
          autoCorrect={false}
          autoComplete="off"
          autoFocus
          testID="gauge-searchbar"
        />
        <FlashList<ListedGaugeFragment>
          contentContainerStyle={styles.content}
          data={gauges}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={<GaugeListHeader loading={loading} />}
          ListEmptyComponent={<EmptyListPlaceholder search={search} />}
          ItemSeparatorComponent={GaugesListSeparator}
          keyboardShouldPersistTaps="always"
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

export default GaugeScreen;
