import Button from '@material-ui/core/Button';
import React, { useCallback } from 'react';

import { ClickBlocker, DeleteButton, IconLink } from '../../../components';
import { paths } from '../../../utils';
import AddSectionButton from './AddSectionButton';
import type { ListedRiverFragment } from './listRivers.generated';

interface Props {
  river: ListedRiverFragment;
  onRemove: (id: string) => void;
  onChangeRegion: (id: string) => void;
}

const RiversTableActions = React.memo<Props>((props) => {
  const { river, onRemove, onChangeRegion } = props;
  const {
    id: riverId,
    region: { id: regionId },
  } = river;
  const href = `${paths.to({ regionId, sectionId: 'new' })}?riverId=${riverId}`;
  const handleChnageRegion = useCallback(
    () => onChangeRegion(riverId),
    [onChangeRegion, riverId],
  );
  return (
    <ClickBlocker>
      <IconLink to={paths.settings({ regionId, riverId })} icon="edit" />
      <DeleteButton id={riverId} deleteHandler={onRemove} />
      <AddSectionButton to={href} />
      <Button key="open" onClick={handleChnageRegion}>
        change region
      </Button>
    </ClickBlocker>
  );
});

RiversTableActions.displayName = 'RiversTableActions';

export default RiversTableActions;
