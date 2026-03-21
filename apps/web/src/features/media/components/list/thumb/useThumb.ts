import { getVideoThumb } from '@whitewater-guide/clients';
import { MediaKind } from '@whitewater-guide/schema';
import { useEffect, useRef, useState } from 'react';

import { S3_HOST } from '../../../../../environment';
import type { ListedMedia } from '../types';
import { THUMB_HEIGHT } from './constants';
import type { ThumbState } from './types';

function getThumbURL(media: ListedMedia): string {
  const thumb = media.thumb ?? media.url;
  return thumb?.startsWith('http') ? thumb : `${S3_HOST}/temp/${thumb}`;
}

export default function useThumb(media: ListedMedia): ThumbState {
  const [state, setState] = useState<ThumbState>({});
  const mediaRef = useRef(media);
  mediaRef.current = media;
  const { id } = media;

  useEffect(() => {
    const setThumb = async () => {
      if (mediaRef.current.kind === MediaKind.Photo) {
        setState({
          thumb: getThumbURL(mediaRef.current),
          height: THUMB_HEIGHT,
        });
      } else if (mediaRef.current.kind === MediaKind.Video) {
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
