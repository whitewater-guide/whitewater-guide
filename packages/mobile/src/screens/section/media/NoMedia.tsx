import type { MediaKind } from '@whitewater-guide/schema';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';

import { PHOTO_SIZE } from '../../../features/media';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: PHOTO_SIZE,
  },
});

interface Props {
  kind: MediaKind;
}

const NoMedia: React.FC<Props> = ({ kind }) => {
  const [t] = useTranslation();
  const text = t(`screens:section.media.noMedia.${kind}`);
  return (
    <View style={styles.container}>
      <Subheading>{text}</Subheading>
    </View>
  );
};

export default NoMedia;
