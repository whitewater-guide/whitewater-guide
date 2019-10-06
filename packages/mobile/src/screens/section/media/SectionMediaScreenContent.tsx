import { BannerPlacement, Section } from '@whitewater-guide/commons';
import { PhotoGallery } from 'components/photo-gallery';
import groupBy from 'lodash/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Platform, StatusBar } from 'react-native';
import { Title } from 'react-native-paper';
import { RegionBanners } from '../../../features/banners';
import BlogList from './BlogList';
import PhotoGrid from './PhotoGrid';
import VideoList from './VideoList';

interface Props {
  section: Section | null;
}

interface State {
  openPhotoIndex: number;
}

class SectionMediaScreenContent extends React.PureComponent<
  Props & WithTranslation,
  State
> {
  state: State = {
    openPhotoIndex: -1,
  };

  onPhotoIndexChanged = (openPhotoIndex: number) =>
    this.setState({ openPhotoIndex });

  onGalleryClose = () => this.setState({ openPhotoIndex: -1 });

  render() {
    const { section, t } = this.props;
    const nodes = section && section.media ? section.media.nodes : [];
    const groups = groupBy(nodes, 'kind');
    const { openPhotoIndex } = this.state;
    // TODO: There's a known bug on Android that prevents hiding of StatusBar with Modal
    // https://github.com/react-native-community/react-native-modal/issues/50
    // https://github.com/react-native-community/react-native-statusbar/issues/6
    // https://github.com/facebook/react-native/issues/9090#issuecomment-337624981
    return (
      <React.Fragment>
        <StatusBar hidden={Platform.OS === 'ios' && openPhotoIndex >= 0} />
        <Title>{t('section:media.photo')}</Title>
        <PhotoGrid photos={groups.photo} onPress={this.onPhotoIndexChanged} />
        <Title>{t('section:media.video')}</Title>
        <VideoList videos={groups.video} />
        <Title>{t('section:media.blog')}</Title>
        <BlogList blogs={groups.blog} />
        <RegionBanners placement={BannerPlacement.MOBILE_SECTION_MEDIA} />
        <PhotoGallery
          photos={groups.photo}
          index={this.state.openPhotoIndex}
          onClose={this.onGalleryClose}
        />
      </React.Fragment>
    );
  }
}

export default withTranslation()(SectionMediaScreenContent);
