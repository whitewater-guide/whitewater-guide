import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { Media } from '@whitewater-guide/commons';
import React from 'react';
import { IconButtonWithData } from '../../../components';

interface Props {
  editable: boolean;
  media: Media[];
  onEdit?: (media: Media) => void;
  onRemove?: (media: Media) => void;
}

const BlogsList: React.FC<Props> = (props) => {
  const { media, editable, onEdit, onRemove } = props;
  return (
    <List>
      {media.map((item) => (
        <ListItem key={item.id}>
          <ListItemText secondary={item.copyright}>
            <a href={item.url} target="_blank">
              {item.description}
            </a>
          </ListItemText>
          {editable && (
            <ListItemSecondaryAction>
              <IconButtonWithData<Media>
                icon="edit"
                data={item}
                onPress={onEdit!}
              />
              <IconButtonWithData<Media>
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
