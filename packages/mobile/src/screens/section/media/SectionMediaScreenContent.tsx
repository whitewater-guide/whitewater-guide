import { ROOT_LICENSE, useSection } from '@whitewater-guide/clients';
import { BannerPlacement } from '@whitewater-guide/schema';
import groupBy from 'lodash/groupBy';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StatusBar } from 'react-native';
import { Title } from 'react-native-paper';

import { PhotoGallery } from '~/components/photo-gallery';

import { RegionBanners } from '../../../features/banners';
import BlogList from './BlogList';
import PhotoGrid from './PhotoGrid';
import VideoList from './VideoList';

const SectionMediaScreenContent: React.FC = () => {
  const { t } = useTranslation();
  const [openPhotoIndex, setOpenPhotoIndex] = useState(-1);
  const section = useSection();
  const nodes = section?.media?.nodes ?? [];
  const groups = groupBy(nodes, 'kind');
  // TODO: There's a known bug on Android that prevents hiding of StatusBar with Modal
  // https://github.com/react-native-community/react-native-modal/issues/50
  // https://github.com/react-native-community/react-native-statusbar/issues/6
  // https://github.com/facebook/react-native/issues/9090#issuecomment-337624981
  return (
    <>
      <StatusBar hidden={Platform.OS === 'ios' && openPhotoIndex >= 0} />

      <Title>{t('section:media.photo')}</Title>
      <PhotoGrid photos={groups.photo} onPress={setOpenPhotoIndex} />

      <Title>{t('section:media.video')}</Title>
      <VideoList videos={groups.video} />

      <Title>{t('section:media.blog')}</Title>
      <BlogList blogs={groups.blog} />

      <RegionBanners placement={BannerPlacement.MobileSectionMedia} />

      <PhotoGallery
        sectionLicense={
          section?.license ?? section?.region?.license ?? ROOT_LICENSE
        }
        photos={groups.photo}
        index={openPhotoIndex}
        onClose={() => setOpenPhotoIndex(-1)}
      />
    </>
  );
};

export default SectionMediaScreenContent;
