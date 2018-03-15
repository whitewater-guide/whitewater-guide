import * as React from 'react';
import { TextInput } from '../../../components/forms';
import { MediaFormProps } from './types';

export default class NonPhotoForm extends React.PureComponent<MediaFormProps> {
  render() {
    return (
      <React.Fragment>
        <TextInput multiLine fullWidth name="description" title="Description" />
        <TextInput fullWidth name="copyright" title="Copyright" />
        <TextInput fullWidth name="url" title="URL" />
        <TextInput fullWidth type="number" name="weight" title="Weight" />
      </React.Fragment>
    );
  }
}
