import React from 'react';
import LocalPhoto from './LocalPhoto';
import Placeholder from './Placeholder';
import { Photo } from './types';

export interface PhotoPickerProps {
  value: Photo | null;
  onChange: (value: Photo | null) => void;
  label?: string;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = React.memo((props) => {
  const { value, onChange, label } = props;
  return value && value.image ? (
    <LocalPhoto value={value} onChange={onChange} />
  ) : (
    <Placeholder onChange={onChange} label={label} />
  );
});

PhotoPicker.displayName = 'PhotoPicker';
