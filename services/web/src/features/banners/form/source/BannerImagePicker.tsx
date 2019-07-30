import React from 'react';
import { ImageUploaderProps } from '../../../../components/image-uploader';
import { ImageUploadField } from '../../../../formik/fields';
import { Styles } from '../../../../styles';

const styles: Styles = {
  uploaderRoot: {
    padding: 0,
    borderWidth: 0,
  },
  uploaderMain: {
    padding: 0,
    borderWidth: 0,
  },
};

type Props = Pick<
  ImageUploaderProps,
  'bucket' | 'width' | 'height' | 'previewScale' | 'upload'
>;

export const BannerImagePicker: React.FC<Props> = React.memo((props) => {
  return (
    <ImageUploadField
      {...props}
      name="source.src"
      hideFileName={true}
      rootStyle={styles.uploaderRoot}
      mainStyle={styles.uploaderMain}
    />
  );
});

BannerImagePicker.displayName = 'BannerImagePicker';
