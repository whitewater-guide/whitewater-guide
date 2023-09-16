import type { MediaWithThumbFragment } from '@whitewater-guide/schema';
import React from 'react';
import { Linking } from 'react-native';
import { List } from 'react-native-paper';

import Icon from '~/components/Icon';

interface Props {
  blog: MediaWithThumbFragment;
}

const renderIcon = () => <Icon icon="link" />;

const BlogItem: React.FC<Props> = ({ blog }) => {
  const copyright = blog.copyright ? `© ${blog.copyright}` : undefined;
  const onPress = React.useCallback(() => {
    Linking.openURL(blog.url).catch(() => {
      // do not care if we cannot open it
    });
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
