import { useNavigation } from '@react-navigation/native';
import type { NamedNode } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { ListRenderItem } from 'react-native';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Searchbar } from 'react-native-paper';

import { Screen } from '~/components/Screen';
import theme from '~/theme';

import EmptyListPlaceholder from './EmptyListPlaceholder';
import type { ListedGaugeFragment } from './findGauges.generated';
import GaugeListHeader from './GaugeListHeader';
import GaugesListItem from './GaugesListItem';
import GaugesListSeparator from './GaugesListSeparator';
import useGaugesQuery from './useGaugesQuery';

const styles = StyleSheet.create({
  searchBar: {
    marginTop: theme.margin.single,
    marginHorizontal: theme.margin.single,
  },
  content: {
    padding: theme.margin.single,
  },
  section: {
    marginVertical: 0,
  },
  kav: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const keyExtractor = ({ id }: NamedNode) => id;
const getItemLayout = (_: any, i: number) => ({
  length: theme.rowHeight,
  offset: theme.rowHeight * i,
  index: i,
});

const GaugeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const { values, setFieldValue } = useFormikContext<any>();
  const value = values.gauge;
  const onChange = useCallback(
    (v: NamedNode) => {
      setFieldValue('gauge', v);
      goBack();
    },
    [setFieldValue, goBack],
  );
  const [search, onChangeInput, loading, gauges] = useGaugesQuery(
    value ? value.name : '',
  );
  const renderItem: ListRenderItem<ListedGaugeFragment> = useCallback(
    ({ item }) => <GaugesListItem gauge={item} onPress={onChange} />,
    [onChange],
  );
  return (
    <Screen>
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kav}
        keyboardVerticalOffset={82}
      >
        <FlatList<ListedGaugeFragment>
          contentContainerStyle={styles.content}
          data={gauges}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={<GaugeListHeader loading={loading} />}
          ListEmptyComponent={<EmptyListPlaceholder search={search} />}
          ItemSeparatorComponent={GaugesListSeparator}
          getItemLayout={getItemLayout}
          keyboardShouldPersistTaps="always"
        />
      </KeyboardAvoidingView>
    </Screen>
  );
};

GaugeScreen.displayName = 'GaugeScreen';

export default GaugeScreen;
