import Button from '@material-ui/core/Button';
import React, { memo } from 'react';

import { DeleteButton } from '../../../components';
import { useRemoveAllGaugesMutation } from './removeAllGauges.generated';

interface Props {
  sourceId: string;
}

const RemoveAllGaugesButton = memo<Props>(({ sourceId }) => {
  const [mutate, { loading }] = useRemoveAllGaugesMutation({
    variables: { sourceId },
    refetchQueries: ['listGauges'],
  });
  return (
    <DeleteButton deleteHandler={() => mutate()} disabled={loading}>
      <Button variant="contained">Remove all</Button>
    </DeleteButton>
  );
});

export default RemoveAllGaugesButton;
