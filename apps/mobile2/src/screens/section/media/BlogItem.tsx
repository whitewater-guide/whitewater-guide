import type { MediaWithThumbFragment } from '@whitewater-guide/schema';
import { useCallback } from 'react';
import { Linking } from 'react-native';
import { List } from 'react-native-paper';

import Icon from '../../../components/Icon';

interface Props {
  blog: MediaWithThumbFragment;
}

function renderIcon() {
  return <Icon icon="link" narrow />;
}

function BlogItem({ blog }: Props) {
  const copyright = blog.copyright ? `© ${blog.copyright}` : undefined;
  const onPress = useCallback(() => {
    Linking.openURL(blog.url).catch(() => {});
  }, [blog.url]);

  return (
    <List.Item
      title={blog.description}
      description={copyright}
      left={renderIcon}
      onPress={onPress}
    />
  );
}

export default BlogItem;
