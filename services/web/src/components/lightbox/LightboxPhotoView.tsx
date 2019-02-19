import { Media } from '@whitewater-guide/commons';
import React from 'react';
import { Styles } from '../../styles';

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
  data: Media;
  interactionIsIdle: boolean;
}

const LightboxPhotoView: React.StatelessComponent<Props> = ({ data }) => {
  const src =
    process.env.STORYBOOK_ENABLED === 'true' || data.url.includes('/')
      ? data.url
      : `${process.env.REACT_APP_API_HOST}/uploads/media/${data.url}`;
  return (
    <div style={styles.container}>
      <img src={src} style={styles.img} />
    </div>
  );
};

export default LightboxPhotoView;
