import { getVideoThumb } from '@whitewater-guide/clients';
import { MediaKind } from '@whitewater-guide/commons';
import { useEffect, useRef, useState } from 'react';

import { S3_HOST } from '../../../../../environment';
import { MediaOrInput } from '../types';
import { THUMB_HEIGHT } from './constants';
import { ThumbState } from './types';

function getThumbURL(media: MediaOrInput): string {
  const thumb = media.thumb ?? media.url;
  return thumb.startsWith('http') ? thumb : `${S3_HOST}/temp/${thumb}`;
}

export default function useThumb(media: MediaOrInput): ThumbState {
  const [state, setState] = useState<ThumbState>({});
  const mediaRef = useRef(media);
  mediaRef.current = media;
  const { id } = media;

  useEffect(() => {
    const setThumb = async () => {
      if (mediaRef.current.kind === MediaKind.photo) {
        setState({
          thumb: getThumbURL(mediaRef.current),
          height: THUMB_HEIGHT,
        });
      } else if (mediaRef.current.kind === MediaKind.video) {
        const videoThumb = await getVideoThumb(
          mediaRef.current.url,
          THUMB_HEIGHT,
        );
        if (videoThumb) {
          const scale = THUMB_HEIGHT / videoThumb.height;
          const width = videoThumb.width * scale;
          setState({ thumb: videoThumb.thumb, height: THUMB_HEIGHT, width });
        }
      }
    };
    setThumb().catch(() => {
      // ignore
    });
  }, [id, mediaRef, setState]);

  return state;
}
