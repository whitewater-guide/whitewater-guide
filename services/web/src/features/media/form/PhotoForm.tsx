import Box from '@material-ui/core/Box';
import { uploadFile } from '@whitewater-guide/clients';
import { MediaInput, UploadLink } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import useRouter from 'use-react-router';
import { NumberField, TextField } from '../../../formik/fields';
import { FileWithPreview, getImageSize } from '../../../utils';
import PhotoFormPreview from './PhotoFormPreview';

interface Props {
  uploadLink: UploadLink;
}

const PhotoForm: React.FC<Props> = React.memo(({ uploadLink }) => {
  const { location } = useRouter();
  const [uploading, setUploading] = useState(false);
  const { initialValues, setFieldValue } = useFormikContext<MediaInput>();
  const { url } = initialValues;
  const file: FileWithPreview | undefined =
    location.state && location.state.file;

  useEffect(() => {
    const upload = async () => {
      if (url) {
        // Editing existing image
        return;
      }
      if (!file) {
        throw new Error('Photo form must have file!');
      }
      setUploading(true);
      const { width, height } = await getImageSize(file);
      setFieldValue('resolution', [width, height]);
      const filename = await uploadFile(file.file, uploadLink);
      setUploading(false);
      setFieldValue('url', filename);
    };

    upload();
  }, []);

  return (
    <Box display="flex" flexDirection="row">
      <Box flex={1}>
        <TextField
          multiline={true}
          fullWidth={true}
          name="description"
          label="Description"
          placeholder="Description"
        />
        <TextField
          fullWidth={true}
          name="copyright"
          label="Copyright"
          placeholder="Copyright"
        />
        <TextField
          fullWidth={true}
          disabled={true}
          name="url"
          label="URL"
          placeholder="URL"
        />
        <NumberField
          fullWidth={true}
          name="weight"
          label="Sort weight"
          placeholder="Sort weight"
        />
        <Box display="flex" flexDirection="row">
          <NumberField
            fullWidth={true}
            disabled={true}
            name="resolution.0"
            label="Image width"
            placeholder="Image width"
          />
          <NumberField
            fullWidth={true}
            disabled={true}
            name="resolution.1"
            label="Image height"
            placeholder="Image height"
          />
        </Box>
      </Box>
      <PhotoFormPreview
        loading={uploading}
        preview={file && file.preview}
        url={url}
      />
    </Box>
  );
});

PhotoForm.displayName = 'PhotoForm';

export default PhotoForm;
