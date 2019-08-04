import { isVimeo, isYoutube } from '@whitewater-guide/clients';
import React from 'react';
import { Styles } from '../../styles';
import LightboxVimeo from './LightboxVimeo';
import LightboxYoutube from './LightboxYoutube';
import { LightboxItem } from './types';

const styles: Styles = {
  container: {
    width: '100%',
    height: 'calc(100vh - 150px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: 640,
    height: 360,
  },
};

interface Props {
  currentIndex: number;
  data: LightboxItem;
  interactionIsIdle: boolean;
}

const LightboxVideoView: React.FC<Props> = React.memo((props) => {
  const url = props.data.url;
  return (
    <div style={styles.container}>
      <div style={styles.video}>
        {isYoutube(url) && <LightboxYoutube url={url} />}
        {isVimeo(url) && <LightboxVimeo url={url} />}
      </div>
    </div>
  );
});

LightboxVideoView.displayName = 'LightboxVideoView';

export default LightboxVideoView;
