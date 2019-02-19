import React from 'react';
import { TextInput } from '../../../components/forms';
import { MediaFormProps } from './types';

export default class NonPhotoForm extends React.PureComponent<MediaFormProps> {
  render() {
    return (
      <React.Fragment>
        <TextInput
          multiLine={true}
          fullWidth={true}
          name="description"
          title="Description"
        />
        <TextInput fullWidth={true} name="copyright" title="Copyright" />
        <TextInput fullWidth={true} name="url" title="URL" />
        <TextInput
          fullWidth={true}
          type="number"
          name="weight"
          title="Sort weight"
        />
      </React.Fragment>
    );
  }
}
