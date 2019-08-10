import { Box } from '@material-ui/core';
import React from 'react';
import { useQuery } from 'react-apollo';
import { Loading, Multicomplete } from '../../../../components';
import { QResult, QVars, REGION_GROUPS_QUERY } from './regionGroups.query';
import useAddToGroup from './useAddToGroup';
import useRemoveFromGroup from './useRemoveFromGroup';

interface Props {
  regionId: string;
}

export const RegionGroups: React.FC<Props> = React.memo(({ regionId }) => {
  const { data, loading } = useQuery<QResult, QVars>(REGION_GROUPS_QUERY, {
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
        options={data.allGroups.nodes || []}
        values={data.regionGroups.nodes || []}
        onAdd={addToGroup}
        onDelete={removeFromGroup}
        label="Groups"
        placeholder="Groups"
      />
    </Box>
  );
});

RegionGroups.displayName = 'RegionGroups';
