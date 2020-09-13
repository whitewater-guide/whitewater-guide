import { useNavigation } from '@react-navigation/native';
import { NamedNode } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
} from 'react-native';
import { Searchbar, Surface } from 'react-native-paper';

import { Screen } from '~/components/Screen';

import theme from '../../../theme';
import EmptyListPlaceholder from './EmptyListPlaceholder';
import GaugeListHeader from './GaugeListHeader';
import GaugesListItem from './GaugesListItem';
import { ListedGauge } from './types';
import useGaugesQuery from './useGaugesQuery';

const styles = StyleSheet.create({
  searchBar: {
    marginTop: theme.margin.single,
    marginHorizontal: theme.margin.single,
  },
  content: {
    flex: 1,
    margin: theme.margin.single,
    elevation: 4,
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
  const renderItem: ListRenderItem<ListedGauge> = useCallback(
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
        autoCompleteType="off"
        autoFocus={true}
        testID="gauge-searchbar"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kav}
        keyboardVerticalOffset={82}
      >
        <Surface style={styles.content}>
          <FlatList<ListedGauge>
            data={gauges}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={<GaugeListHeader loading={loading} />}
            ListEmptyComponent={<EmptyListPlaceholder search={search} />}
            getItemLayout={getItemLayout}
            keyboardShouldPersistTaps="always"
          />
        </Surface>
      </KeyboardAvoidingView>
    </Screen>
  );
};

GaugeScreen.displayName = 'GaugeScreen';

export default GaugeScreen;
