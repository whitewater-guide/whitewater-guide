import * as React from 'react';
import YouTube from 'react-youtube';
import { Styles } from '../../../../styles';
import { getVimeoId, getYoutubeId, isVimeo, isYoutube } from '../../../../ww-clients/utils';
import { Media } from '../../../../ww-commons';

const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
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
  data: Media;
  interactionIsIdle: boolean;
}

class VideoPlayer extends React.PureComponent<Props> {
  renderYoutube = (url: string) => {
    const videoId = getYoutubeId(url);
    return (
      videoId && <YouTube videoId={videoId} />
    );
  };

  renderVimeo = (url: string) => {
    const videoId = getVimeoId(url);
    return (
      videoId &&
      (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          width="640"
          height="360"
          title="The New Vimeo Player (You Know, For Videos)"
        />
      )
    );
  };

  renderVideo() {
    const url = this.props.data.url;
    if (isYoutube(url)) {
      return this.renderYoutube(url);
    }
    if (isVimeo(url)) {
      return this.renderVimeo(url);
    }
    return null;
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.video}>
          {this.renderVideo()}
        </div>
      </div>
    );
  }
}

export default VideoPlayer;
