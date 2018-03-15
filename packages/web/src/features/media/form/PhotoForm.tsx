import * as React from 'react';
import { TextInput } from '../../../components/forms';
import { Styles } from '../../../styles';
import { MediaFormProps } from './types';

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  fields: {
    flex: 1,
  },
  previewWrapper: {
    width: 400,
    height: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    maxWidth: 360,
    maxHeight: 360,
  },
};

export default class PhotoForm extends React.PureComponent<MediaFormProps> {
  render() {
    const { location: { state } } = this.props;
    const file: any = state.file;
    return (
      <div style={styles.container}>
        <div style={styles.fields}>
          <TextInput multiLine fullWidth name="description" title="Description" />
          <TextInput fullWidth name="copyright" title="Copyright" />
          <TextInput fullWidth disabled name="url" title="URL" />
          <TextInput fullWidth type="number" name="weight" title="Weight" />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <TextInput fullWidth disabled name="resolution.0" title="Image width" />
            <TextInput fullWidth disabled name="resolution.1" title="Image height" />
          </div>
        </div>
        <div style={styles.previewWrapper}>
          <img src={file.preview} style={styles.preview} />
        </div>
      </div>
    );
  }
}
