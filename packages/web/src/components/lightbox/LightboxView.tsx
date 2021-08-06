import { MediaKind } from '@whitewater-guide/schema';
import React from 'react';

import LightboxPhotoView from './LightboxPhotoView';
import LightboxVideoView from './LightboxVideoView';
import { LightboxItem } from './types';

interface Props {
  currentIndex: number;
  data: LightboxItem;
  interactionIsIdle: boolean;
}

const views = {
  [MediaKind.Photo]: LightboxPhotoView,
  [MediaKind.Video]: LightboxVideoView,
  [MediaKind.Blog]: () => null,
};

const LightboxView: React.FC<Props> = (props) => {
  const { data } = props;
  const { kind = MediaKind.Photo } = data;
  const Component: React.ComponentType<Props> = views[kind];
  return <Component {...props} />;
};

export default LightboxView;
