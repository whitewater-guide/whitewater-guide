import Button from '@material-ui/core/Button';
import React from 'react';
import { Mutation } from 'react-apollo';

import { DeleteButton } from '../../../components';
import { REMOVE_ALL_GAUGES, Result, Vars } from './removeAllGauges.mutation';

interface Props {
  sourceId: string;
}

const RemoveAllGaugesButton: React.FC<Props> = ({ sourceId }) => (
  <Mutation<Result, Vars>
    mutation={REMOVE_ALL_GAUGES}
    variables={{ sourceId }}
    refetchQueries={['listGauges']}
  >
    {(mutate) => (
      <DeleteButton deleteHandler={mutate as any}>
        <Button variant="contained">Remove all</Button>
      </DeleteButton>
    )}
  </Mutation>
);

export default RemoveAllGaugesButton;
