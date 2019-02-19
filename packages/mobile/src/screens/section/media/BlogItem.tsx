import { Media } from '@whitewater-guide/commons';
import React from 'react';
import { Linking } from 'react-native';
import { List } from 'react-native-paper';
import { Icon } from '../../../components';

interface Props {
  blog: Media;
}

class BlogItem extends React.PureComponent<Props> {
  onPress = () => Linking.openURL(this.props.blog.url).catch(() => {});

  renderIcon = () => <Icon icon="link" />;

  render() {
    const { blog } = this.props;
    const copyright = blog.copyright ? `© ${blog.copyright}` : undefined;
    return (
      <List.Item
        title={blog.description}
        description={copyright}
        left={this.renderIcon}
        onPress={this.onPress}
      />
    );
  }
}

export default BlogItem;
