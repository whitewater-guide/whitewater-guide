import { Box } from '@material-ui/core';
import React from 'react';

import { Loading, Multicomplete } from '../../../../components';
import { useRegionGroupsQuery } from './regionGroups.generated';
import useAddToGroup from './useAddToGroup';
import useRemoveFromGroup from './useRemoveFromGroup';

interface Props {
  regionId: string;
}

export const RegionGroups = React.memo<Props>(({ regionId }) => {
  const { data, loading } = useRegionGroupsQuery({
    fetchPolicy: 'network-only',
    variables: { regionId },
  });
  const addToGroup = useAddToGroup(regionId);
  const removeFromGroup = useRemoveFromGroup(regionId);
  if (loading || !data) {
    return <Loading />;
  }
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Multicomplete
        options={data.allGroups?.nodes ?? []}
        values={data.regionGroups?.nodes ?? []}
        onAdd={addToGroup}
        onDelete={removeFromGroup}
        label="Groups"
        placeholder="Groups"
      />
    </Box>
  );
});

RegionGroups.displayName = 'RegionGroups';
