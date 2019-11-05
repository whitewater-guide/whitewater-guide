import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { ImageUploaderProps } from '../../../../components/image-uploader';
import { ImageUploadField } from '../../../../formik/fields';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: 0,
      borderWidth: 0,
    },
    main: {
      padding: 0,
      borderWidth: 0,
    },
  }),
);

type Props = Pick<
  ImageUploaderProps,
  'width' | 'height' | 'previewScale' | 'mpxOrResolution'
>;

export const BannerImagePicker: React.FC<Props> = React.memo((props) => {
  const classes = useStyles();
  return (
    <ImageUploadField
      {...props}
      name="source"
      hideFileName={true}
      classes={classes}
    />
  );
});

BannerImagePicker.displayName = 'BannerImagePicker';
