import PropTypes from 'prop-types';
import React from 'react';
import { flattenProp, hoistStatics } from 'recompose';
import groupBy from 'lodash/groupBy';
import { Screen, TabIcon, Text } from '../../../components';
import PhotoGrid from './PhotoGrid';
import PhotoGallery from './PhotoGallery';
import VideoList from './VideoList';
import I18n from '../../../i18n';

class SectionMediaScreen extends React.PureComponent {

  static propTypes = {
    section: PropTypes.object,
  };

  static navigationOptions = {
    tabBarIcon: () => <TabIcon icon="photos" />,
  };

  state = {
    openPhotoIndex: -1,
  };

  onPhotoIndexChanged = openPhotoIndex => this.setState({ openPhotoIndex });

  onGalleryClose = () => this.setState({ openPhotoIndex: -1 });

  render() {
    const groups = groupBy(this.props.section.media, 'type');
    return (
      <Screen>
        <Text paddingHorizontal={4}>{I18n.t('section.media.photos')}</Text>
        <PhotoGrid photos={groups.photo} onPress={this.onPhotoIndexChanged} />
        <Text paddingHorizontal={4}>{I18n.t('section.media.videos')}</Text>
        <VideoList videos={groups.video} />
        {
          groups.photo &&
          <PhotoGallery photos={groups.photo} index={this.state.openPhotoIndex} onClose={this.onGalleryClose} />
        }
      </Screen>
    );
  }

}

const container = flattenProp('screenProps');
export default hoistStatics(container)(SectionMediaScreen);
