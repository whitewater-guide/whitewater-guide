import React from 'react';

import type { Styles } from '../../styles';
import { MediaImg } from '../MediaImg';
import type { LightboxItem } from './types';

const styles: Styles = {
  container: {
    position: 'relative',
    textAlign: 'center',
  },
  img: {
    height: 'auto',
    maxHeight: 'calc(100vh - 150px)',
    maxWidth: '100%',
    userSelect: 'none',
  },
};

interface Props {
  data: LightboxItem;
}

const LightboxPhotoView: React.FC<Props> = ({ data }) => {
  const src = data.image || data.url;
  return (
    <div style={styles.container}>
      {src && <MediaImg src={src} style={styles.img} />}
    </div>
  );
};

export default LightboxPhotoView;
