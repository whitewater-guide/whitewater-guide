import Box from '@material-ui/core/Box';
import { useUploadLink } from '@whitewater-guide/clients';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import useEffectOnce from 'react-use/lib/useEffectOnce';

import { NumberField, TextField } from '../../../../formik/fields';
import { LocalPhoto } from '../../../../utils/files';
import PhotoFormPreview from './PhotoFormPreview';

interface Props {
  prefix?: string;
  localPhoto?: LocalPhoto;
}

const PhotoForm: React.FC<Props> = React.memo((props) => {
  const { localPhoto, prefix = '' } = props;
  const { uploading, upload } = useUploadLink();
  const { values, setFieldValue } = useFormikContext<any>();
  const url = getIn(values, `${prefix}url`);

  useEffectOnce(() => {
    const effect = async () => {
      if (url) {
        // Editing existing image
        return;
      }
      if (!localPhoto) {
        throw new Error('Photo form must have file!');
      }
      setFieldValue(`${prefix}resolution`, localPhoto.resolution);
      const filename = await upload!(localPhoto.file!);
      setFieldValue(`${prefix}url`, filename);
    };

    effect();
  });

  return (
    <Box display="flex" flexDirection="row">
      <Box flex={1}>
        <TextField
          multiline={true}
          fullWidth={true}
          name={`${prefix}description`}
          label="Description"
          placeholder="Description"
        />
        <TextField
          fullWidth={true}
          name={`${prefix}copyright`}
          label="Copyright"
          placeholder="Copyright"
        />
        <TextField
          fullWidth={true}
          disabled={true}
          name={`${prefix}url`}
          label="URL"
          placeholder="URL"
        />
        <NumberField
          fullWidth={true}
          name={`${prefix}weight`}
          label="Sort weight"
          placeholder="Sort weight"
        />
        <Box display="flex" flexDirection="row">
          <NumberField
            fullWidth={true}
            disabled={true}
            name={`${prefix}resolution.0`}
            label="Image width"
            placeholder="Image width"
          />
          <NumberField
            fullWidth={true}
            disabled={true}
            name={`${prefix}resolution.1`}
            label="Image height"
            placeholder="Image height"
          />
        </Box>
      </Box>
      <PhotoFormPreview loading={uploading} localPhoto={localPhoto} url={url} />
    </Box>
  );
});

PhotoForm.displayName = 'PhotoForm';

export default PhotoForm;
