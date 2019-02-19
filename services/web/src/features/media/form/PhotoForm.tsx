import { uploadFile } from '@whitewater-guide/clients';
import get from 'lodash/get';
import React from 'react';
import { TextInput } from '../../../components/forms';
import { Styles } from '../../../styles';
import { FileWithPreview, getImageSize } from '../../../utils';
import PhotoFormPreview from './PhotoFormPreview';
import { MediaFormProps } from './types';

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  fields: {
    flex: 1,
  },
};

interface State {
  uploading: boolean;
}

export default class PhotoForm extends React.PureComponent<
  MediaFormProps,
  State
> {
  state: State = { uploading: false };

  async componentDidMount() {
    const {
      location: { state },
      data,
      change,
      initialValues,
    } = this.props;
    if (initialValues.url) {
      // Editing existing image
      return;
    }
    const upload = data!.mediaForm!.upload;
    const file: FileWithPreview = state.file;
    if (!file) {
      throw new Error('Photo form must have file!');
    }
    this.setState({ uploading: true });
    const { width, height } = await getImageSize(file);
    change('resolution', [width, height]);
    const filename = await uploadFile(file.file, upload);
    this.setState({ uploading: false });
    change('url', filename);
  }

  render() {
    const {
      location,
      initialValues: { url },
    } = this.props;
    const { uploading } = this.state;
    const preview = get(location, 'state.file.preview');
    return (
      <div style={styles.container}>
        <div style={styles.fields}>
          <TextInput
            multiLine={true}
            fullWidth={true}
            name="description"
            title="Description"
          />
          <TextInput fullWidth={true} name="copyright" title="Copyright" />
          <TextInput fullWidth={true} disabled={true} name="url" title="URL" />
          <TextInput
            fullWidth={true}
            type="number"
            name="weight"
            title="Sort weight"
          />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <TextInput
              fullWidth={true}
              disabled={true}
              name="resolution.0"
              title="Image width"
            />
            <TextInput
              fullWidth={true}
              disabled={true}
              name="resolution.1"
              title="Image height"
            />
          </div>
        </div>
        <PhotoFormPreview loading={uploading} preview={preview} url={url} />
      </div>
    );
  }
}
