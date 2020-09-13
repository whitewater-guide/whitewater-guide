import React from 'react';

import { Styles } from '../../styles';
import { MediaImg } from '../MediaImg';
import { LightboxItem } from './types';

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
  currentIndex: number;
  data: LightboxItem;
  interactionIsIdle: boolean;
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
