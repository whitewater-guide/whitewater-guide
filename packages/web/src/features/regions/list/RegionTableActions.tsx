import { AdminOnly } from '@whitewater-guide/clients';
import React from 'react';

import { ClickBlocker, DeleteButton, IconLink } from '../../../components';
import { paths } from '../../../utils';
import { ListedRegionFragment } from './listRegions.generated';

interface Props {
  region: ListedRegionFragment;
  onRemove: (id?: string) => void;
}

const RegionTableActions = React.memo<Props>((props) => {
  const { region, onRemove } = props;
  const { id: regionId, editable } = region;
  return (
    <ClickBlocker>
      {editable && <IconLink to={paths.settings({ regionId })} icon="edit" />}
      <AdminOnly>
        <DeleteButton id={regionId} deleteHandler={onRemove} />
        <IconLink to={paths.admin({ regionId })} icon="settings" />
      </AdminOnly>
    </ClickBlocker>
  );
});

RegionTableActions.displayName = 'RegionTableActions';

export default RegionTableActions;
