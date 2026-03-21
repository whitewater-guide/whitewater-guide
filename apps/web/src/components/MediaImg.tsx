import React from 'react';
import type { ImgProps } from 'react-image';
import { Img } from 'react-image';
import type { Overwrite } from 'utility-types';

import { S3_HOST } from '../environment';

type Props = Overwrite<ImgProps, { src: string }>;

export const MediaImg = React.memo<Props>(({ src, ...props }) => {
  let source = [src];
  if (!src.startsWith('http')) {
    source = [...source, `${S3_HOST}/media/${src}`, `${S3_HOST}/temp/${src}`];
  }
  return <Img {...props} src={source} />;
});

MediaImg.displayName = 'MediaImg';
