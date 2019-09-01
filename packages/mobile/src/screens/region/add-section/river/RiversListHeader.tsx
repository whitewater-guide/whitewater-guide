import { NamedNode } from '@whitewater-guide/commons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';
import theme from '../../../../theme';
import RiversListItem from './RiversListItem';

const styles = StyleSheet.create({
  caption: {
    margin: theme.margin.single,
  },
  loadingWrapper: {
    alignSelf: 'stretch',
    height: theme.rowHeight,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: theme.margin.single,
  },
});

interface Props {
  search: string;
  onPress: (node: NamedNode) => void;
  loading: boolean;
}

const RiversListHeader: React.FC<Props> = (props) => {
  const { loading, onPress, search } = props;
  const { t } = useTranslation();
  return (
    <View>
      <Caption style={styles.caption}>
        {t('screens:addSection.river.newSubheader')}
      </Caption>
      <RiversListItem name={search} onPress={onPress} />
      <Caption style={styles.caption}>
        {t('screens:addSection.river.resultsSubheader')}
      </Caption>
      {loading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator color={theme.colors.primary} size="small" />
        </View>
      )}
    </View>
  );
};

RiversListHeader.displayName = 'RiversListHeader';

export default RiversListHeader;
