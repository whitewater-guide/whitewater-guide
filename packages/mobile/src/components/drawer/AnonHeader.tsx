import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { loginWithFB } from '../../core/auth/actions';
import { WithT } from '../../i18n';
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

interface DispatchProps {
  onPress: () => void;
}

type Props = DispatchProps & WithT;

const AnonHeaderView: React.StatelessComponent<Props> = ({ onPress, t }) => (
  <Touchable onPress={onPress}>
    <View style={styles.container}>
      <Icon icon="fa-facebook-f" color={theme.colors.textLight} style={styles.icon} />
      <Text large>{t('drawer:facebookLogin')}</Text>
    </View>
  </Touchable>
);

const container = compose(
  connect<{}, DispatchProps>(undefined, { onPress: () => loginWithFB.started({}) }),
  translate(),
);

const AnonHeader = container(AnonHeaderView);

export default AnonHeader;
