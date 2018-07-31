import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Title, TouchableRipple } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { loginWithFB } from '../core/auth/actions';
import theme from '../theme';

const SIZE_REGULAR = 48;
const SIZE_MEDIUM = 40;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: theme.colors.facebook,
    marginRight: theme.margin.single,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRegular: {
    height: SIZE_REGULAR,
    width: SIZE_REGULAR,
    borderRadius: SIZE_REGULAR / 2,
  },
  iconMedium: {
    height: SIZE_MEDIUM,
    width: SIZE_MEDIUM,
    borderRadius: SIZE_MEDIUM / 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.margin.single,
  },
  containerPadding: {
    padding: theme.margin.single,
  },
  fontMedium: {
    fontSize: 18,
    lineHeight: 25,
  },
});

interface OwnProps {
  medium?: boolean;
  padded?: boolean;
}

interface DispatchProps {
  onPress: () => void;
}

type Props = DispatchProps & WithI18n & OwnProps;

const AnonHeaderView: React.StatelessComponent<Props> = ({ onPress, medium, t, padded = true }) => {
  const svgSize = medium ? 26 : 32;
  return (
    <TouchableRipple onPress={onPress}>
      <View style={[styles.container, padded && styles.containerPadding]}>
        <View style={[styles.icon, medium ? styles.iconMedium : styles.iconRegular]}>
          <Svg viewBox="0 0 264 512" width={svgSize} height={svgSize}>
            {/*tslint:disable-next-line*/}
            <Path fill="#FFFFFF"
                  d="M76.7 512V283H0v-91h76.7v-71.7C76.7 42.4 124.3 0 193.8 0c33.3 0 61.9 2.5 70.2 3.6V85h-48.2c-37.8 0-45.1 18-45.1 44.3V192H256l-11.7 91h-73.6v229" />
          </Svg>
        </View>
        <Title style={medium && styles.fontMedium}>{t('drawer:facebookLogin')}</Title>
      </View>
    </TouchableRipple>
  );
};

const container = compose<Props, OwnProps>(
  connect<{}, DispatchProps>(undefined, { onPress: () => loginWithFB.started({}) }),
  withI18n(),
);

export const AnonHeader = container(AnonHeaderView);
