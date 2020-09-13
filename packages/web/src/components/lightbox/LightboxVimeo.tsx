import { getVimeoId } from '@whitewater-guide/clients';
import React from 'react';

interface Props {
  url?: string;
}

const LightboxVimeo: React.FC<Props> = React.memo(({ url }) => {
  const videoId = getVimeoId(url);
  return videoId ? (
    <iframe
      src={`https://player.vimeo.com/video/${videoId}`}
      width="640"
      height="360"
      title="The New Vimeo Player (You Know, For Videos)"
    />
  ) : null;
});

LightboxVimeo.displayName = 'LightboxVimeo';

export default LightboxVimeo;
