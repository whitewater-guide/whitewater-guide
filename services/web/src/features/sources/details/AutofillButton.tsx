import Button from '@material-ui/core/Button';
import React from 'react';
import useAutofill from './useAutofill';

interface Props {
  sourceId: string;
}

const AutofillButton: React.FC<Props> = React.memo(({ sourceId }) => {
  const onClick = useAutofill(sourceId);
  return (
    <Button variant="contained" onClick={onClick}>
      Autofill
    </Button>
  );
});

AutofillButton.displayName = 'AutofillButton';

export default AutofillButton;
