import Box from '@material-ui/core/Box';
import { BannerKind } from '@whitewater-guide/commons';
import { useField } from 'formik';
import React from 'react';
import { ImageUploaderProps } from '../../../../components/image-uploader';
import { BannerImagePicker } from './BannerImagePicker';
import BannerKindField from './BannerKindField';
import BannerSourceWebviewFields from './BannerSourceWebviewFields';

type Props = Omit<ImageUploaderProps, 'value' | 'onChange'>;

export const BannerSourceFields: React.FC<Props> = React.memo((props) => {
  const [field] = useField('source.kind');
  return (
    <Box height={256} border={1} borderRadius={8} display="flex">
      <BannerKindField title={props.title} />
      <Box
        padding={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {field.value === BannerKind.Image ? (
          <BannerImagePicker {...props} />
        ) : (
          <BannerSourceWebviewFields />
        )}
      </Box>
    </Box>
  );
});

BannerSourceFields.displayName = 'BannerSourceFields';
