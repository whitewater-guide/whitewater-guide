import { Media } from '@whitewater-guide/commons';
import React from 'react';
import { Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Icon } from '../../../components';
import theme from '../../../theme';
import LoadableImage from './LoadableImage';

const styles = StyleSheet.create({
  headerOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  headerInner: {
    height: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 4,
    paddingBottom: 4 + getBottomSpace(),
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.32)',
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
    <View style={styles.headerOuter}>
      <SafeAreaView />
      <View style={styles.headerInner}>
        <Icon
          large={true}
          icon="close"
          onPress={this.props.onClose}
          color={theme.colors.textLight}
        />
      </View>
    </View>
  );

  renderFooter = (index?: number) => {
    const { photos } = this.props;
    if (index === undefined || !photos) {
      return <View />;
    }
    // There's a bug in react-native-image-viewer where it returns -1 index
    const { description, copyright } = photos[Math.max(0, index)];
    return (
      <View>
        <Text style={styles.footerDescription}>
          {description}
          {copyright && (
            <Text style={styles.footerCopyright}>{`\n © ${copyright}`}</Text>
          )}
        </Text>
      </View>
    );
  };

  renderIndicator = (index: number = 0, total: number = 0) => (
    <View style={styles.indicator}>
      <Text style={styles.indicatorText}>{`${index}/${total}`}</Text>
    </View>
  );

  renderImage = (props: any) => <LoadableImage {...props} />;

  render() {
    const { photos, index, onClose } = this.props;
    if (!photos) {
      return null;
    }
    const imageUrls = photos.map(({ image, resolution }) => {
      const width = resolution ? resolution[0] : 0;
      const height = resolution ? resolution[1] : 0;
      return {
        url: image!,
        width,
        height,
      };
    });
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
