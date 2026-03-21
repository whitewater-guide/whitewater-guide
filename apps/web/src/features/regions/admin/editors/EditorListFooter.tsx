import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import type { NamedNode } from '@whitewater-guide/schema';
import React, { useCallback, useState } from 'react';

import { IconButtonWithData } from '../../../../components';
import { UserFinder } from '../../../users';

interface Props {
  onAdd: (userId: string) => void;
}

const EditorListFooter = React.memo<Props>((props) => {
  const { onAdd } = props;
  const [user, setUser] = useState<NamedNode | null>(null);

  const handleAdd = useCallback(
    (id: string) => {
      onAdd(id);
      setUser(null);
    },
    [onAdd, setUser],
  );

  return (
    <ListItem>
      <ListItemText>
        <UserFinder value={user} onChange={setUser} />
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButtonWithData
          data={user ? user.id : null}
          icon="add"
          onPress={handleAdd}
          disabled={!user}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
});

EditorListFooter.displayName = 'EditorListFooter';

export default EditorListFooter;
