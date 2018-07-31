import groupBy from 'lodash/groupBy';
import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { StatusBar } from 'react-native';
import { Title } from 'react-native-paper';
import { RegionBanners } from '../../../features/banners';
import { BannerPlacement, Section } from '../../../ww-commons';
import BlogList from './BlogList';
import PhotoGallery from './PhotoGallery';
import PhotoGrid from './PhotoGrid';
import VideoList from './VideoList';

interface Props {
  section: Section | null;
}

interface State {
  openPhotoIndex: number;
}

class SectionMediaScreenContent extends React.PureComponent<Props & WithI18n, State> {

  state: State = {
    openPhotoIndex: -1,
  };

  onPhotoIndexChanged = (openPhotoIndex: number) => this.setState({ openPhotoIndex });

  onGalleryClose = () => this.setState({ openPhotoIndex: -1 });

  render() {
    const { section, t } = this.props;
    const nodes = (section && section.media) ? section.media.nodes : [];
    const groups = groupBy(nodes, 'kind');
    return (
      <React.Fragment>
        <StatusBar hidden={this.state.openPhotoIndex >= 0} />
        <Title>{t('section:media.photo')}</Title>
        <PhotoGrid photos={groups.photo} onPress={this.onPhotoIndexChanged} />
        <Title>{t('section:media.video')}</Title>
        <VideoList videos={groups.video} />
        <Title>{t('section:media.blog')}</Title>
        <BlogList blogs={groups.blog} />
        <RegionBanners placement={BannerPlacement.MOBILE_SECTION_MEDIA} />
        <PhotoGallery photos={groups.photo} index={this.state.openPhotoIndex} onClose={this.onGalleryClose} />
      </React.Fragment>
    );
  }

}

export default withI18n()(SectionMediaScreenContent);
