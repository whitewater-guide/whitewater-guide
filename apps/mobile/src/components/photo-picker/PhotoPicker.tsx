import type { ImageStyle } from '@whitewater-guide/react-native-fast-image';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import LocalPhotoView from '~/components/photo-picker/LocalPhotoView';

import type { LocalPhoto } from '../../features/uploads';
import Placeholder from './Placeholder';

export interface PhotoPickerProps {
  value: LocalPhoto | null;
  onChange: (value: LocalPhoto) => void;
  style?: StyleProp<ImageStyle | ViewStyle>;
  label?: string;
  localPhotoId: string;
  testID?: string;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = React.memo((props) => {
  const { value, onChange, label, style, localPhotoId, testID } = props;
  return value?.file ? (
    <LocalPhotoView
      value={value}
      onChange={onChange}
      style={style as ImageStyle}
      localPhotoId={localPhotoId}
      testID={testID}
    />
  ) : (
    <Placeholder
      onChange={onChange}
      label={label}
      style={style}
      localPhotoId={localPhotoId}
      testID={testID}
    />
  );
});

PhotoPicker.displayName = 'PhotoPicker';
