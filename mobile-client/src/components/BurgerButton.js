import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { toggleDrawer } from '../core/actions';

const BurgerButton = ({ onPress }) => (
  <Button transparent onPress={onPress} >
    <Icon name="menu" />
  </Button>
);

BurgerButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default connect(undefined, { onPress: () => toggleDrawer() })(BurgerButton);
