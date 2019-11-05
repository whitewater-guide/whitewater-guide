import React from 'react';
import Img, { ImgProps } from 'react-image';
import { Overwrite } from 'utility-types';
import { S3_HOST } from '../environment';

type Props = Overwrite<ImgProps, { src: string }>;

export const MediaImg: React.FC<Props> = React.memo(({ src, ...props }) => {
  let source = [src];
  if (!src.startsWith('http')) {
    source = [...source, `${S3_HOST}/media/${src}`, `${S3_HOST}/temp/${src}`];
  }
  return <Img {...props} src={source} />;
});

MediaImg.displayName = 'MediaImg';
