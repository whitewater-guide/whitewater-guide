import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption, Subheading } from 'react-native-paper';
import theme from '../../../theme';
import { Group } from '@whitewater-guide/commons';
import { Region } from '@whitewater-guide/commons';

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.margin.single,
    alignItems: 'flex-start',
  },
  noMargin: {
    marginVertical: 0,
  },
  last: {
    marginBottom: 0,
  },
});

interface Props {
  region?: Region;
  group?: Group;
  last: boolean;
}

const PurchaseItem: React.SFC<Props & WithI18n> = ({
  last,
  region,
  group,
  t,
}) => {
  if (!region && !group) {
    return null;
  }
  const title = region ? region.name : group!.name;
  const description = region
    ? t('myProfile:purchases.region')
    : t('myProfile:purchases.group');
  return (
    <View style={[styles.container, last && styles.last]}>
      <Subheading style={styles.noMargin}>{title}</Subheading>
      <Caption style={styles.noMargin}>{description}</Caption>
    </View>
  );
};

export default withI18n()(PurchaseItem);
