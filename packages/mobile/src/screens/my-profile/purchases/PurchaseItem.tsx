import type { NamedNode } from '@whitewater-guide/schema';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption, Subheading } from 'react-native-paper';

import theme from '../../../theme';

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
  region?: NamedNode;
  group?: NamedNode;
  last: boolean;
}

const PurchaseItem: React.FC<Props> = ({ last, region, group }) => {
  const [t] = useTranslation();
  if (!region && !group) {
    return null;
  }
  const title = region ? region.name : group?.name;
  const description = region
    ? t('screens:myprofile.purchases.region')
    : t('screens:myprofile.purchases.group');
  return (
    <View style={[styles.container, last && styles.last]}>
      <Subheading style={styles.noMargin}>{title}</Subheading>
      <Caption style={styles.noMargin}>{description}</Caption>
    </View>
  );
};

export default PurchaseItem;
