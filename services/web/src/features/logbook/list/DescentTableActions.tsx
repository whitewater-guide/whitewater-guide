import { LogbookDescent } from '@whitewater-guide/logbook-schema';
import React from 'react';
import { ClickBlocker, DeleteButton, IconLink } from '../../../components';
import { paths } from '../../../utils';

interface Props {
  descent: LogbookDescent;
  onRemove?: (id?: string) => void;
}

const DescentTableActions: React.FC<Props> = React.memo((props) => {
  const { descent, onRemove } = props;
  const { id: descentId } = descent;
  return (
    <ClickBlocker>
      <IconLink to={paths.settings({ descentId })} icon="edit" />
      <DeleteButton id={descentId} deleteHandler={onRemove} />
    </ClickBlocker>
  );
});

DescentTableActions.displayName = 'DescentTableActions';

export default DescentTableActions;
