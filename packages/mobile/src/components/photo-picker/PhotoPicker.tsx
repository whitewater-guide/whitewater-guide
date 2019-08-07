import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LocalPhoto from './LocalPhoto';
import Placeholder from './Placeholder';
import { Photo } from './types';

export interface PhotoPickerProps {
  value: Photo | null;
  onChange: (value: Photo | null) => void;
  style?: StyleProp<ViewStyle>;
  label?: string;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = React.memo((props) => {
  const { value, onChange, label, style } = props;
  return value && value.image ? (
    <LocalPhoto value={value} onChange={onChange} style={style} />
  ) : (
    <Placeholder onChange={onChange} label={label} style={style} />
  );
});

PhotoPicker.displayName = 'PhotoPicker';
