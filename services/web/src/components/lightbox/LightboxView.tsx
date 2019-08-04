import { MediaKind } from '@whitewater-guide/commons';
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
  [MediaKind.photo]: LightboxPhotoView,
  [MediaKind.video]: LightboxVideoView,
  [MediaKind.blog]: () => null,
};

const LightboxView: React.FC<Props> = (props) => {
  const { data } = props;
  const { kind = MediaKind.photo } = data;
  const Component: React.ComponentType<Props> = views[kind];
  return <Component {...props} />;
};

export default LightboxView;
