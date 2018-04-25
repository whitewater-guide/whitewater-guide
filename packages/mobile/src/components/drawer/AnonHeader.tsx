import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
    alignItems: 'center',
    justifyContent: 'center',
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
      <View style={styles.icon}>
        <Svg viewBox="0 0 264 512" height={24} width={24}>
          <Path
            fill="#FFFFFF"
            d="M76.7 512V283H0v-91h76.7v-71.7C76.7 42.4 124.3 0 193.8 0c33.3 0 61.9 2.5 70.2 3.6V85h-48.2c-37.8 0-45.1 18-45.1 44.3V192H256l-11.7 91h-73.6v229"
          />
        </Svg>
    </View>
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
