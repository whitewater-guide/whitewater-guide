import React from 'react';
import { ItemType, LOADING_ITEM_PREFIX, NEW_SECTION } from './types';
import { LogbookSectionInput } from '@whitewater-guide/logbook-schema';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ITEM_HEIGHT } from './constants';
import theme from '~/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from '~/components/Icon';
import { useTranslation } from 'react-i18next';
import SectionListItem from './SectionListItem';

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.lightBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
  },
  addText: {
    fontSize: 14,
    color: theme.colors.textMain,
  },
});

interface Props {
  item: ItemType;
  onSelect?: (value: LogbookSectionInput) => void;
  onAdd?: () => void;
}

const SearchListItem: React.FC<Props> = ({ item, onAdd, onSelect }) => {
  const { t } = useTranslation();
  if (item.id === NEW_SECTION) {
    return (
      <TouchableOpacity onPress={onAdd}>
        <View style={styles.container}>
          <Icon icon="plus" />
          <Text>{t('screens:descentForm.section.addListItem')}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  if (item.id.indexOf(LOADING_ITEM_PREFIX) === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }
  return <SectionListItem onPress={onSelect} section={item as any} />;
};

export default SearchListItem;
