import ImagePicker from 'react-native-image-picker';

export interface Photo {
  name: string;
  type: string;
  image: string;
  resolution: number[];
}

export type ImagePickerOptions = Parameters<
  typeof ImagePicker['showImagePicker']
>[0];
