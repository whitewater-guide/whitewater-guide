import { List, ListItem } from 'material-ui/List';
import React from 'react';
import { IconButtonWithData } from '../../../components';
import { Styles } from '../../../styles';
import { Media } from '../../../ww-commons';

const styles: Styles = {
  list: {
    maxWidth: 600,
    paddingLeft: 0,
  },
  item: {
    paddingLeft: 0,
  },
  actions: {
    display: 'flex',
    width: 100,
    justifyContent: 'space-between',
  },
};

interface Props {
  editable: boolean;
  media: Media[];
  onEdit?: (media: Media) => void;
  onRemove?: (media: Media) => void;
}

class BlogsList extends React.PureComponent<Props> {
  renderActions = (item: Media) => {
    const { onEdit, onRemove } = this.props;
    return (
      <div style={styles.actions}>
        <IconButtonWithData icon="edit" data={item} onPress={onEdit!} />
        <IconButtonWithData icon="delete_forever" data={item} onPress={onRemove!} />
      </div>
    );
  };

  renderItem = (item: Media) => {
    const { id, description, copyright, url } = item;
    const rightIcon = this.props.editable ? this.renderActions(item) : undefined;
    return (
      <ListItem
        style={styles.item}
        innerDivStyle={styles.item}
        key={id}
        rightIcon={rightIcon}
        primaryText={<a href={url} target="_blank">{description}</a>}
        secondaryText={copyright}
      />
    );
  };

  render() {
    const { media } = this.props;
    return (
      <List style={styles.list}>
        {media.map(m => this.renderItem(m))}
      </List>
    );
  }
}

export default BlogsList;
