import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface Props extends LinkProps {
  icon?: string;
}

export const IconLink = React.forwardRef(
  ({ icon, children, ...props }: Props, ref) => {
    // Workaround: IconButton doesn't have component prop in typedefs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

IconLink.displayName = 'IconLink';
