import FontIcon from 'material-ui/FontIcon';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface Props extends LinkProps {
  icon: string;
}

export const IconLink: React.StatelessComponent<Props> = ({
  icon,
  ...props
}) => (
  <Link {...props}>
    <FontIcon className="material-icons">{icon}</FontIcon>
  </Link>
);
