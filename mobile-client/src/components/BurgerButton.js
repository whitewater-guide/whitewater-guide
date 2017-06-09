import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import glamorous from 'glamorous-native';
import theme from '../theme';
import IonIcon from './IonIcon';
import { toggleDrawer } from '../core/actions';

const BurgerButton = ({ onPress }) => (
  <glamorous.View width={64} height={45} alignItems="center" justifyContent="center">
    <IonIcon
      icon="menu"
      size={theme.icons.regular.size}
      color={theme.colors.primary}
      onPress={onPress}
    />
  </glamorous.View>
);

BurgerButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default connect(undefined, { onPress: () => toggleDrawer() })(BurgerButton);
