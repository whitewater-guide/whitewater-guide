import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface Props extends LinkProps {
  icon: string;
}

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <Link innerRef={ref as any} {...props} />,
);

export const IconLink: React.FC<Props> = ({ icon, ...props }) => {
  // Workaround: IconButton doesn't have component prop in typedefs
  const Component = IconButton as any;
  return (
    <Component {...props} component={AdapterLink}>
      <Icon>{icon}</Icon>
    </Component>
  );
};
