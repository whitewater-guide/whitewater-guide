import type { StyleProp, ViewStyle } from 'react-native';

import type { LocalPhoto } from '../../features/uploads';
import LocalPhotoView from './LocalPhotoView';
import Placeholder from './Placeholder';

export interface PhotoPickerProps {
  value: LocalPhoto | null;
  onChange: (value: LocalPhoto) => void;
  style?: StyleProp<ViewStyle>;
  label?: string;
  localPhotoId: string;
  testID?: string;
}

function PhotoPicker({
  value,
  onChange,
  label,
  style,
  localPhotoId,
  testID,
}: PhotoPickerProps) {
  return value?.file ? (
    <LocalPhotoView
      value={value}
      onChange={onChange}
      style={style as object}
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
}

PhotoPicker.displayName = 'PhotoPicker';

export { PhotoPicker };
