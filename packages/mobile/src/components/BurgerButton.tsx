import React from 'react';
import { connect } from 'react-redux';
import { toggleDrawer } from '../core/actions';
import { Icon, IconProps } from './Icon';

const BurgerButtonView: React.StatelessComponent<IconProps> = ({ onPress }) => (
  <Icon
    primary
    icon="menu"
    width={64}
    height={45}
    onPress={onPress}
  />
);

export const BurgerButton: React.ComponentType = connect<{}, Pick<IconProps, 'onPress'>>(
  undefined,
  { onPress: () => toggleDrawer(null) },
)(BurgerButtonView);
