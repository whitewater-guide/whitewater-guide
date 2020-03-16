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
import theme from '../../../../theme';
import EmptyListPlaceholder from './EmptyListPlaceholder';
import RiversListHeader from './RiversListHeader';
import RiversListItem from './RiversListItem';
import useRiversQuery from './useRiversQuery';

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

const RiverScreen: React.FC = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const { values, setFieldValue } = useFormikContext<any>();
  const value = values.river;
  const onChange = useCallback(
    (v: NamedNode) => {
      setFieldValue('river', v);
      goBack();
    },
    [setFieldValue, goBack],
  );
  const [search, onChangeInput, loading, rivers] = useRiversQuery(
    value ? value.name : '',
  );
  const renderItem: ListRenderItem<NamedNode> = useCallback(
    ({ item }) => (
      <RiversListItem id={item.id} name={item.name} onPress={onChange} />
    ),
    [onChange],
  );
  return (
    <Screen>
      <Searchbar
        placeholder={t('screens:addSection.river.searchPlaceholder')}
        onChangeText={onChangeInput}
        value={search}
        style={styles.searchBar}
        autoCorrect={false}
        autoCompleteType="off"
        autoFocus={true}
        testID="river-searchbar"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kav}
        keyboardVerticalOffset={82}
      >
        <Surface style={styles.content}>
          <FlatList<NamedNode>
            data={rivers}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={
              <RiversListHeader
                search={search}
                onPress={onChange}
                loading={loading}
              />
            }
            ListEmptyComponent={<EmptyListPlaceholder search={search} />}
            getItemLayout={getItemLayout}
            keyboardShouldPersistTaps="always"
          />
        </Surface>
      </KeyboardAvoidingView>
    </Screen>
  );
};

RiverScreen.displayName = 'RiverScreen';

export default RiverScreen;
