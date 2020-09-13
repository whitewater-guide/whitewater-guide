import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';

import { IconButtonWithData } from '../../../../components';
import { MediaOrInput } from './types';

interface Props {
  editable: boolean;
  media: MediaOrInput[];
  onEdit?: (media: MediaOrInput) => void;
  onRemove?: (media: MediaOrInput) => void;
}

const BlogsList: React.FC<Props> = (props) => {
  const { media, editable, onEdit, onRemove } = props;
  return (
    <List>
      {media.map((item, index) => (
        <ListItem key={item.id || item.url || `item${index}`}>
          <ListItemText secondary={item.copyright}>
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.description}
            </a>
          </ListItemText>
          {editable && (
            <ListItemSecondaryAction>
              <IconButtonWithData<MediaOrInput>
                icon="edit"
                data={item}
                onPress={onEdit!}
              />
              <IconButtonWithData<MediaOrInput>
                icon="delete_forever"
                data={item}
                onPress={onRemove!}
              />
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default BlogsList;
