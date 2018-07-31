import groupBy from 'lodash/groupBy';
import React from 'react';
import { translate } from 'react-i18next';
import { StatusBar } from 'react-native';
import { Title } from 'react-native-paper';
import { WithT } from '../../../i18n';
import { Section } from '../../../ww-commons';
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

class SectionMediaScreenContent extends React.PureComponent<Props & WithT, State> {

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

        <PhotoGallery photos={groups.photo} index={this.state.openPhotoIndex} onClose={this.onGalleryClose} />
      </React.Fragment>
    );
  }

}

export default translate()(SectionMediaScreenContent);
