import Box from '@material-ui/core/Box';
import { BannerResolutions, LocalPhotoStatus } from '@whitewater-guide/clients';
import { BannerKind } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import React, { useCallback, useState } from 'react';

import type { ImageUploaderProps } from '../../../../components/image-uploader';
import type { BannerFormData } from '../types';
import { BannerImagePicker } from './BannerImagePicker';
import BannerKindField from './BannerKindField';
import BannerSourceWebviewFields from './BannerSourceWebviewFields';

type Props = Omit<ImageUploaderProps, 'value' | 'onChange'>;

export const BannerSourceFields = React.memo<Props>((props) => {
  const { title, ...rest } = props;
  const { values, handleChange, handleBlur } =
    useFormikContext<BannerFormData>();
  const [kind, setKind] = useState(
    typeof values.source === 'string' ? BannerKind.WebView : BannerKind.Image,
  );
  const onChangeKind = useCallback(
    (newKind: BannerKind) => {
      setKind(newKind);
      const value =
        newKind === BannerKind.Image
          ? {
              status: LocalPhotoStatus.READY,
              resolution: [0, 0],
              id: 'default_id',
            }
          : '';
      handleChange({
        target: {
          name: 'source',
          value,
        },
      });
      handleBlur({ target: { name: 'source' } });
    },
    [setKind, handleChange, handleBlur],
  );
  return (
    <Box height={256} border={1} borderRadius={8} display="flex">
      <BannerKindField
        title={title}
        value={kind}
        onChange={onChangeKind}
        placement={values.placement}
      />
      <Box
        padding={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {kind === BannerKind.Image ? (
          <BannerImagePicker
            {...rest}
            mpxOrResolution={BannerResolutions[values.placement]}
          />
        ) : (
          <BannerSourceWebviewFields />
        )}
      </Box>
    </Box>
  );
});

BannerSourceFields.displayName = 'BannerSourceFields';
