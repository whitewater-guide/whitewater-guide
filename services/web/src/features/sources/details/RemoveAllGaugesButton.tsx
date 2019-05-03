import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import { Mutation } from 'react-apollo';
import { DeleteButton } from '../../../components';
import REMOVE_ALL_GAUGES from './removeAllGauges.mutation';

interface Props {
  sourceId: string;
}

const renderButton = (
  onClick: React.MouseEventHandler<{}>,
  disabled: boolean,
) => (
  <FlatButton
    secondary={true}
    label="Remove all"
    onClick={onClick}
    disabled={disabled}
  />
);

const RemoveAllGaugesButton: React.FC<Props> = ({ sourceId }) => (
  <Mutation
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
