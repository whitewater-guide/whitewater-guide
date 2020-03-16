import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LocalPhotoView from '~/components/photo-picker/LocalPhotoView';
import { LocalPhoto } from '../../features/uploads';
import Placeholder from './Placeholder';

export interface PhotoPickerProps {
  value: LocalPhoto | null;
  onChange: (value: LocalPhoto) => void;
  style?: StyleProp<ViewStyle>;
  label?: string;
  localPhotoId: string;
  testID?: string;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = React.memo((props) => {
  const { value, onChange, label, style, localPhotoId, testID } = props;
  return value && value.file ? (
    <LocalPhotoView
      value={value}
      onChange={onChange}
      style={style}
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
