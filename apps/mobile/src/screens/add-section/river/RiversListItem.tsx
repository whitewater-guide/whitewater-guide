import type { NamedNode } from '@whitewater-guide/schema';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Subheading } from 'react-native-paper';

import theme from '~/theme';

import RiversListItemBody from './RiversListItemBody';
import RiversListRiverItem from './RiversListRiverItem';
import type { RiversListDataItem } from './types';

const styles = StyleSheet.create({
  loading: {
    backgroundColor: theme.colors.primaryBackground,
    justifyContent: 'center',
  },
});

interface Props {
  item: RiversListDataItem;
  onSelect?: (node: NamedNode) => void;
}

const RiversListItem: React.FC<Props> = ({ item, onSelect }) => {
  const { t } = useTranslation();
  switch (item.__typename) {
    case 'Loading':
      return (
        <RiversListItemBody style={styles.loading}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </RiversListItemBody>
      );
    case 'NotFound':
      return (
        <RiversListItemBody disabled>
          <Subheading>{t(item.id)}</Subheading>
        </RiversListItemBody>
      );
    case 'AddNewRiverItem':
    case 'River':
      return (
        <RiversListRiverItem
          id={item.id}
          name={item.name}
          onSelect={onSelect}
        />
      );
    default:
      return null;
  }
};

export default RiversListItem;
