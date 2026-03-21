import List from '@material-ui/core/List';
import React from 'react';

import { Loading } from '../../../../components';
import EditorListFooter from './EditorListFooter';
import EditorListItem from './EditorListItem';
import { useRegionEditorsQuery } from './regionEditors.generated';
import useAddEditor from './useAddEditor';
import useRemoveEditor from './useRemoveEditor';

interface Props {
  regionId: string;
}

export const RegionEditors = React.memo<Props>(({ regionId }) => {
  const { data, loading } = useRegionEditorsQuery({
    fetchPolicy: 'network-only',
    variables: {
      regionId,
    },
  });
  const removeEditor = useRemoveEditor(regionId);
  const addEditor = useAddEditor(regionId);
  if (loading) {
    return <Loading />;
  }
  const editors = data?.editors || [];
  return (
    <List>
      {editors.map((user) => (
        <EditorListItem key={user.id} user={user} onRemove={removeEditor} />
      ))}
      <EditorListFooter onAdd={addEditor} />
    </List>
  );
});

RegionEditors.displayName = 'RegionEditors';
