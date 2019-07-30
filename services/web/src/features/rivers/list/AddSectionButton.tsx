import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

// The usage of React.forwardRef will no longer be required for react-router-dom v6.
// see https://github.com/ReactTraining/react-router/issues/6056
const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <Link innerRef={ref as any} {...props} />,
);

interface Props {
  to: string;
}

const AddSectionButton: React.FC<Props> = React.memo(({ to }) => {
  return (
    <Button component={AdapterLink} to={to}>
      <Icon>add</Icon>
      Add Section
    </Button>
  );
});

AddSectionButton.displayName = 'AddSectionButton';

export default AddSectionButton;
