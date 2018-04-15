import React from 'react';
import { StyleSheet, View } from 'react-native';
import I18n from '../../i18n';
import theme from '../../theme';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { Touchable } from '../Touchable';

const styles = StyleSheet.create({
  icon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.facebook,
    marginRight: theme.margin.single,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.margin.single,
    marginBottom: theme.margin.single,
  },
});

const AnonHeader: React.StatelessComponent = () => (
  <Touchable>
    <View style={styles.container}>
      <Icon icon="fa-facebook-f" color={theme.colors.textLight} style={styles.icon} />
      <Text large>{I18n.t('drawer.facebookLogin')}</Text>
    </View>
  </Touchable>
);

export default AnonHeader;
