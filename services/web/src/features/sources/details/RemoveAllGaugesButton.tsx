import Button from '@material-ui/core/Button';
import React from 'react';
import { Mutation } from 'react-apollo';
import { DeleteButton } from '../../../components';
import { REMOVE_ALL_GAUGES, Result, Vars } from './removeAllGauges.mutation';

interface Props {
  sourceId: string;
}

const renderButton = (
  onClick: React.MouseEventHandler<{}>,
  disabled: boolean,
) => (
  <Button variant="contained" onClick={onClick} disabled={disabled}>
    Remove all
  </Button>
);

const RemoveAllGaugesButton: React.FC<Props> = ({ sourceId }) => (
  <Mutation<Result, Vars>
    mutation={REMOVE_ALL_GAUGES}
    variables={{ sourceId }}
    refetchQueries={['listGauges']}
  >
    {(mutate) => (
      <DeleteButton deleteHandler={mutate as any} renderButton={renderButton} />
    )}
  </Mutation>
);

export default RemoveAllGaugesButton;
