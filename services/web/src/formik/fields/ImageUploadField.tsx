import { getIn, useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import {
  ImageUploader,
  ImageUploaderProps,
} from '../../components/image-uploader';
import { LocalPhoto } from '../../utils/files';
import { FormikFormControl } from '../helpers';

type Props = Omit<ImageUploaderProps, 'value' | 'onChange'> & { name: string };

export const ImageUploadField: React.FC<Props> = React.memo((props) => {
  const { name, ...imageUploaderProps } = props;
  const { handleChange, handleBlur, values } = useFormikContext<any>();
  const onChange = useCallback(
    (value: LocalPhoto | null) => {
      handleChange({ target: { name, value } });
      handleBlur({ target: { name, value } });
    },
    [handleChange, handleBlur],
  );
  return (
    <FormikFormControl name={name}>
      <ImageUploader
        {...imageUploaderProps}
        value={getIn(values, name)}
        onChange={onChange}
      />
    </FormikFormControl>
  );
});

ImageUploadField.displayName = 'ImageUploadField';
