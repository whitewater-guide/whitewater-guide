import React from 'react';
import { Linking } from 'react-native';
import { Body, ListItem, Thumbnail, Text } from 'native-base';
import { propType } from 'graphql-anywhere';
import { MediaFragments } from '../../../commons/features/sections';
import getVideoThumb from '../../../commons/utils/getVideoThumb';

class MediaItem extends React.PureComponent {

  static propTypes = {
    data: propType(MediaFragments.Core).isRequired,
  };

  constructor(props) {
    super(props);
    const { type, url } = props.data;
    this.state = {
      thumb: (type === 'video' || type === 'blog') ? null : url,
    };
  }

  async componentDidMount() {
    if (this.props.data.type === 'video') {
      const thumb = await getVideoThumb(this.props.data.url);
      this.setState({ thumb });
    }
  }

  onPress = () => Linking.openURL(this.props.data.url).catch(() => {});

  render() {
    const { description, copyright } = this.props.data;
    return (
      <ListItem button onPress={this.onPress}>
        <Thumbnail square size={80} source={{ uri: this.state.thumb }} />
        <Body>
          <Text>{description}</Text>
          <Text note>{copyright}</Text>
        </Body>
      </ListItem>
    );
  }
}

export default MediaItem;
