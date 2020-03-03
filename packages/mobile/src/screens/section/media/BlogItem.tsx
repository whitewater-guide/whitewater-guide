import { Media } from '@whitewater-guide/commons';
import Icon from 'components/Icon';
import React from 'react';
import { Linking } from 'react-native';
import { List } from 'react-native-paper';

interface Props {
  blog: Media;
}

const renderIcon = () => <Icon icon="link" />;

const BlogItem: React.FC<Props> = ({ blog }) => {
  const copyright = blog.copyright ? `© ${blog.copyright}` : undefined;
  const onPress = React.useCallback(() => {
    Linking.openURL(blog.url).catch(() => {});
  }, [blog]);
  return (
    <List.Item
      title={blog.description}
      description={copyright}
      left={renderIcon}
      onPress={onPress}
    />
  );
};

export default BlogItem;
