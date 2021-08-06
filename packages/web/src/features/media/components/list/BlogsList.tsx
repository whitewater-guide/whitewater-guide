import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';

import { IconButtonWithData } from '../../../../components';
import { ListedMedia } from './types';

interface Props {
  editable: boolean;
  media: ListedMedia[];
  onEdit?: (media: ListedMedia) => void;
  onRemove?: (media: ListedMedia) => void;
}

const BlogsList: React.FC<Props> = (props) => {
  const { media, editable, onEdit, onRemove } = props;
  return (
    <List>
      {media.map((item, index) => (
        <ListItem key={item.id || item.url || `item${index}`}>
          <ListItemText secondary={item.copyright}>
            <a href={item.url ?? undefined} target="_blank" rel="noreferrer">
              {item.description}
            </a>
          </ListItemText>
          {editable && (
            <ListItemSecondaryAction>
              <IconButtonWithData<ListedMedia>
                icon="edit"
                data={item}
                onPress={onEdit}
              />
              <IconButtonWithData<ListedMedia>
                icon="delete_forever"
                data={item}
                onPress={onRemove}
              />
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default BlogsList;
