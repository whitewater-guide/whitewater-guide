import List from '@material-ui/core/List';
import React from 'react';
import { useQuery } from 'react-apollo';

import { Loading } from '../../../../components';
import EditorListFooter from './EditorListFooter';
import EditorListItem from './EditorListItem';
import { QResult, QVars, REGION_EDITORS_QUERY } from './editors.query';
import useAddEditor from './useAddEditor';
import useRemoveEditor from './useRemoveEditor';

interface Props {
  regionId: string;
}

export const RegionEditors: React.FC<Props> = React.memo(({ regionId }) => {
  const { data, loading } = useQuery<QResult, QVars>(REGION_EDITORS_QUERY, {
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
  const editors = (data && data.editors) || [];
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
