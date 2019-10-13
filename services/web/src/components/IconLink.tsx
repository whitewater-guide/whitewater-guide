import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface Props extends LinkProps {
  icon?: string;
}

export const IconLink: React.FC<Props> = React.forwardRef(
  ({ icon, children, ...props }, ref) => {
    // Workaround: IconButton doesn't have component prop in typedefs
    const Component = IconButton as any;
    const iconElement = icon ? (
      <Icon>{icon}</Icon>
    ) : (
      React.Children.only(children)
    );
    return (
      <Component {...props} ref={ref} component={Link}>
        {iconElement}
      </Component>
    );
  },
);
