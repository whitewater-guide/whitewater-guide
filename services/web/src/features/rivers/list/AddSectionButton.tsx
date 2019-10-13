import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  to: string;
}

const AddSectionButton: React.FC<Props> = React.memo(({ to }) => {
  return (
    <Button component={Link} to={to}>
      <Icon>add</Icon>
      Add Section
    </Button>
  );
});

AddSectionButton.displayName = 'AddSectionButton';

export default AddSectionButton;
