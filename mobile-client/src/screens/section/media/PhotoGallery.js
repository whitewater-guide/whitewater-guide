import React from 'react';
import PropTypes from 'prop-types';
import { Modal, StyleSheet, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { getUrl } from './MediaConstants';
import { IonIcon, Text } from '../../../components';
import theme from '../../../theme';

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
    backgroundColor: 'rgba(0,0,0,0.32)',
    zIndex: 10,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 60,
    right: 60,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 20,
  },
  indicatorText: {
    color: theme.colors.textLight,
  },
});

class PhotoGallery extends React.PureComponent {
  static propTypes = {
    photos: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      url: PropTypes.string,
      copyright: PropTypes.string,
      description: PropTypes.string,
    })).isRequired,
    index: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  renderHeader = () => (
    <View style={styles.header}>
      <IonIcon
        icon="close"
        size={theme.icons.large.size}
        onPress={this.props.onClose}
        color={theme.colors.textLight}
      />
    </View>
  );

  renderIndicator = (index, total) => (
    <View style={styles.indicator}>
      <Text style={styles.indicatorText}>
        {`${index}/${total}`}
      </Text>
    </View>
  );

  render() {
    const { photos, index, onClose } = this.props;
    const imageUrls = photos.map(({ url }) => getUrl(url));
    return (
      <Modal visible={index >= 0} onRequestClose={onClose}>
        <ImageViewer
          imageUrls={imageUrls}
          index={Math.max(0, index)}
          saveToLocalByLongPress={false}
          renderHeader={this.renderHeader}
          renderIndicator={this.renderIndicator}
        />
      </Modal>
    );
  }
}

export default PhotoGallery;
