import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { NamedNode } from '@whitewater-guide/commons';
import React from 'react';
import { DeleteButton } from '../../../../components';

interface Props {
  user: NamedNode;
  onRemove: (userId: string) => void;
}

const EditorListItem: React.FC<Props> = React.memo((props) => {
  const { user, onRemove } = props;
  return (
    <ListItem>
      <ListItemText>{user.name}</ListItemText>
      <ListItemSecondaryAction>
        <DeleteButton id={user.id} deleteHandler={onRemove} />
      </ListItemSecondaryAction>
    </ListItem>
  );
});

EditorListItem.displayName = 'EditorListItem';

export default EditorListItem;
