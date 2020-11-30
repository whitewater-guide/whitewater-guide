import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { NamedNode } from '@whitewater-guide/commons';
import React, { useCallback, useState } from 'react';
import { IconButtonWithData } from '../../../../components';
import { UserFinder } from '../../../users';

interface Props {
  onAdd: (userId: string) => void;
}

const EditorListFooter: React.FC<Props> = React.memo((props) => {
  const [user, setUser] = useState<NamedNode | null>(null);
  const onAdd = useCallback(
    (id: string) => {
      props.onAdd(id);
      setUser(null);
    },
    [props.onAdd, setUser],
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
          onPress={onAdd}
          disabled={!user}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
});

EditorListFooter.displayName = 'EditorListFooter';

export default EditorListFooter;