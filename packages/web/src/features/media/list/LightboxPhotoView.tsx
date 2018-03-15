import * as React from 'react';
import { Styles } from '../../../styles';
import { Media } from '../../../ww-commons/index';

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
  return (
    <div style={styles.container}>
      <img src={data.url} style={styles.img} />
    </div>
  );
};

export default LightboxPhotoView;
