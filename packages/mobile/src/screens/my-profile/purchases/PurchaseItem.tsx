import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption, Subheading } from 'react-native-paper';
import { WithT } from '../../../i18n';
import theme from '../../../theme';
import { Group } from '../../../ww-commons/features/groups';
import { Region } from '../../../ww-commons/features/regions';

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

interface Props extends WithT {
  region?: Region;
  group?: Group;
  last: boolean;
}

const PurchaseItem: React.SFC<Props> = ({ last, region, group, t }) => {
  if (!region && !group) {
    return null;
  }
  const title = region ? region.name : group!.name;
  const description = region ? t('myProfile:purchases.region') : t('myProfile:purchases.group');
  return (
    <View style={[styles.container, last && styles.last]}>
      <Subheading style={styles.noMargin}>{title}</Subheading>
      <Caption style={styles.noMargin}>{description}</Caption>
    </View>
  );
};

export default translate()(PurchaseItem);
