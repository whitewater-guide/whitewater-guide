import LocalPhotoView from 'components/photo-picker/LocalPhotoView';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LocalPhoto } from '../../features/uploads';
import Placeholder from './Placeholder';

export interface PhotoPickerProps {
  value: LocalPhoto | null;
  onChange: (value: LocalPhoto) => void;
  style?: StyleProp<ViewStyle>;
  label?: string;
  localPhotoId: string;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = React.memo((props) => {
  const { value, onChange, label, style, localPhotoId } = props;
  return value && value.file ? (
    <LocalPhotoView
      value={value}
      onChange={onChange}
      style={style}
      localPhotoId={localPhotoId}
    />
  ) : (
    <Placeholder
      onChange={onChange}
      label={label}
      style={style}
      localPhotoId={localPhotoId}
    />
  );
});

PhotoPicker.displayName = 'PhotoPicker';
