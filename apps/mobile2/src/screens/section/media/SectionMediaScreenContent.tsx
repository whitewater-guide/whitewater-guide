import { ROOT_LICENSE, useSection } from '@whitewater-guide/clients';
import groupBy from 'lodash/groupBy';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import PhotoGallery from '../../../components/photo-gallery/PhotoGallery';
import BlogList from './BlogList';
import PhotoGrid from './PhotoGrid';
import VideoList from './VideoList';

function SectionMediaScreenContent() {
  const { t } = useTranslation();
  const [openPhotoIndex, setOpenPhotoIndex] = useState(-1);
  const section = useSection();
  const nodes = section?.media?.nodes ?? [];
  const groups = groupBy(nodes, 'kind');

  return (
    <>
      <StatusBar hidden={Platform.OS === 'ios' && openPhotoIndex >= 0} />

      <Text variant="titleMedium" style={[styles.heading, styles.photoHeading]}>
        {t('screens:section.media.photo')}
      </Text>
      <PhotoGrid photos={groups.photo} onPress={setOpenPhotoIndex} />

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.heading}>
          {t('screens:section.media.video')}
        </Text>
        <VideoList videos={groups.video} />
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.heading}>
          {t('screens:section.media.blog')}
        </Text>
        <BlogList blogs={groups.blog} />
      </View>

      <PhotoGallery
        sectionLicense={
          section?.license ?? section?.region?.license ?? ROOT_LICENSE
        }
        photos={groups.photo ?? []}
        index={openPhotoIndex}
        onClose={() => setOpenPhotoIndex(-1)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    paddingTop: 8,
  },
  photoHeading: {
    paddingHorizontal: 8,
  },
  section: {
    paddingHorizontal: 8,
    marginTop: 8,
  },
});

export default SectionMediaScreenContent;
