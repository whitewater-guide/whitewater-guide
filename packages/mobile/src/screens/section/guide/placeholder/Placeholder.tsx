import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';
import { WithT } from '../../../../i18n';
import { WithNode } from '../../../../ww-clients/apollo';
import { Region } from '../../../../ww-commons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props extends WithT {
  region: WithNode<Region>;
}

const Placeholder: React.SFC<Props> = ({ region: { node }, t }) => {
  if (node.premium && !node.hasPremiumAccess) {
    return (
      <Caption>Premium guidebook</Caption>
    );
  }
  return (
    <View style={styles.container}>
      <Caption>
        {t('section:guide.noData')}
      </Caption>
    </View>
  );
};

export default Placeholder;
