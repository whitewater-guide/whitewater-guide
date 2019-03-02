import { BannerKind, BannerSource } from '@whitewater-guide/commons';
import React from 'react';
import Iframe from 'react-iframe';
import { S3_HOST } from '../../../environment';
import { Styles } from '../../../styles';

const styles: Styles = {
  container: {
    width: 512,
    height: 171,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'scale-down',
  },
};

interface Props {
  source: BannerSource;
}

class BannerPreview extends React.PureComponent<Props> {
  renderImage = () => {
    const {
      source: { src },
    } = this.props;
    return <img style={styles.image} src={`${S3_HOST}/banners/${src}`} />;
  };

  renderWebView = () => {
    const {
      source: { src, ratio },
    } = this.props;
    const safeRatio = ratio || 4;
    return (
      <Iframe
        width="512px"
        height={`${Math.ceil(512 / safeRatio)}px`}
        url={src}
        styles={{ overflow: 'hidden' }}
      />
    );
  };

  render() {
    const {
      source: { kind },
    } = this.props;
    return (
      <div style={styles.container}>
        {kind === BannerKind.Image ? this.renderImage() : this.renderWebView()}
      </div>
    );
  }
}

export default BannerPreview;
