import { Media, MediaKind } from '@whitewater-guide/commons';
import React from 'react';
import LightboxPhotoView from './LightboxPhotoView';
import LightboxVideoView from './LightboxVideoView';

interface Props {
  currentIndex: number;
  data: Media;
  interactionIsIdle: boolean;
}

const views = {
  [MediaKind.photo]: LightboxPhotoView,
  [MediaKind.video]: LightboxVideoView,
  [MediaKind.blog]: () => null,
};

const LightboxView: React.FC<Props> = (props) => {
  const Component: React.ComponentType<Props> = views[props.data.kind];
  return <Component {...props} />;
};

export default LightboxView;
