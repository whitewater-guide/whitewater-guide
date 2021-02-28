import Button from '@material-ui/core/Button';
import React from 'react';
import { useMutation } from 'react-apollo';

import { TOGGLE_ALL_GAUGES } from './toggleAllGauges.mutation';

interface Props {
  label: string;
  sourceId: string;
}

interface Variables {
  sourceId: string;
  enabled: boolean;
}

const DisableAllGaugesButton: React.FC<Props> = ({ label, sourceId }) => {
  const [mutate] = useMutation<unknown, Variables>(TOGGLE_ALL_GAUGES, {
    variables: { sourceId, enabled: false },
  });
  return (
    <Button variant="contained" onClick={() => mutate()}>
      {label}
    </Button>
  );
};

export default DisableAllGaugesButton;
