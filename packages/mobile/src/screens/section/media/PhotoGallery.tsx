import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Icon } from '../../../components';
import theme from '../../../theme';
import { Media } from '../../../ww-commons';
import LoadableImage from './LoadableImage';
import { getUrl } from './MediaConstants';

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
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 4,
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  footer: {
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
  footerDescription: {
    flex: 1,
    color: theme.colors.textLight,
    fontSize: 16,
  },
  footerCopyright: {
    color: theme.colors.textLight,
    fontSize: 12,
  },
});

interface Props {
  photos?: Media[];
  index: number;
  onClose: () => void;
}

class PhotoGallery extends React.PureComponent<Props> {

  renderHeader = () => (
    <View style={styles.header}>
      <Icon
        large
        icon="close"
        onPress={this.props.onClose}
        color={theme.colors.textLight}
      />
    </View>
  );

  renderFooter = (index?: number) => {
    const { photos} = this.props;
    if (index === undefined || !photos) {
      return <View />;
    }
    const { description, copyright } = photos[index];
    return (
      <View style={styles.footer}>
        <Text style={styles.footerDescription}>
          {description}
          {copyright && <Text style={styles.footerCopyright}>{`\n © ${copyright}`}</Text>}
        </Text>
      </View>
    );
  };

  renderIndicator = (index: number = 0, total: number = 0) => (
    <View style={styles.indicator}>
      <Text style={styles.indicatorText}>
        {`${index}/${total}`}
      </Text>
    </View>
  );

  renderImage = (props: any) => (
    <LoadableImage {...props} />
  );

  render() {
    const { photos, index, onClose } = this.props;
    if (!photos) {
      return null;
    }
    const imageUrls = photos.map(({ url }) => getUrl(url));
    return (
      <Modal visible={index >= 0} onRequestClose={onClose}>
        <ImageViewer
          imageUrls={imageUrls}
          index={Math.max(0, index)}
          saveToLocalByLongPress={false}
          renderHeader={this.renderHeader}
          renderIndicator={this.renderIndicator}
          footerContainerStyle={styles.footerContainer}
          renderFooter={this.renderFooter}
          renderImage={this.renderImage}
        />
      </Modal>
    );
  }
}

export default PhotoGallery;
