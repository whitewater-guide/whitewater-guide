import React from 'react';
import { Linking } from 'react-native';
import { ListItem } from 'react-native-paper';
import { Media } from '../../../ww-commons';

interface Props {
  blog: Media;
}

class BlogItem extends React.PureComponent<Props> {
  onPress = () => Linking.openURL(this.props.blog.url).catch(() => {});

  render() {
    const { blog } = this.props;
    const copyright = blog.copyright ? `© ${blog.copyright}` : undefined;
    return (
      <ListItem
        title={blog.description}
        description={copyright}
        icon="link"
        onPress={this.onPress}
      />
    );
  }
}

export default BlogItem;
