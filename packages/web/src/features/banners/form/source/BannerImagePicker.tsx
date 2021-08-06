import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';

import { ImageUploaderProps } from '../../../../components/image-uploader';
import { ImageUploadField } from '../../../../formik/fields';

const useStyles = makeStyles(() =>
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

export const BannerImagePicker = React.memo<Props>((props) => {
  const classes = useStyles();
  return (
    <ImageUploadField {...props} name="source" hideFileName classes={classes} />
  );
});

BannerImagePicker.displayName = 'BannerImagePicker';
