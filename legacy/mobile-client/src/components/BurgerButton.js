import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from './index';
import { toggleDrawer } from '../core/actions';

const BurgerButton = ({ onPress }) => (
  <Icon
    primary
    icon="menu"
    width={64}
    height={45}
    onPress={onPress}
  />
);

BurgerButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default connect(undefined, { onPress: () => toggleDrawer() })(BurgerButton);
