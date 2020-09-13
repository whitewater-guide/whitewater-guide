import { getYoutubeId } from '@whitewater-guide/clients';
import React from 'react';
import YouTube from 'react-youtube';

interface Props {
  url?: string;
}

const LightboxYoutube: React.FC<Props> = React.memo(({ url }) => {
  const videoId = getYoutubeId(url);
  return videoId ? <YouTube videoId={videoId} /> : null;
});

LightboxYoutube.displayName = 'LightboxYoutube';

export default LightboxYoutube;
