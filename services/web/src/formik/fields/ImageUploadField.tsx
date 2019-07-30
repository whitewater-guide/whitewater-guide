import { useField } from 'formik';
import React from 'react';
import {
  ImageUploader,
  ImageUploaderProps,
} from '../../components/image-uploader';
import { useFakeHandlers } from '../utils';

type Props = Omit<ImageUploaderProps, 'value' | 'onChange'> & { name: string };

export const ImageUploadField: React.FC<Props> = React.memo((props) => {
  const { name, ...imageUploaderProps } = props;
  const [field] = useField(name);
  const { onChange } = useFakeHandlers(name);
  return (
    <ImageUploader
      {...imageUploaderProps}
      value={field.value}
      onChange={onChange}
    />
  );
});

ImageUploadField.displayName = 'ImageUploadField';
