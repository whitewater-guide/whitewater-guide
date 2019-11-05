import { getFacebookId } from '@whitewater-guide/clients';
import React from 'react';

interface Props {
  url?: string;
}

const LightboxFacebook: React.FC<Props> = React.memo(({ url }) => {
  const videoId = getFacebookId(url);
  return videoId ? (
    <div
      className="fb-video"
      data-href={`https://www.facebook.com/facebook/videos/${videoId}/`}
      data-width="500"
      data-show-text="false"
    />
  ) : null;
});

LightboxFacebook.displayName = 'LightboxVimeo';

export default LightboxFacebook;
