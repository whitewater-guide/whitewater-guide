import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { TextInput } from '../../../components/forms';
import { MediaFormProps } from './types';

export default class MediaForm extends React.PureComponent<MediaFormProps> {

  onCancel = () => {
    //
  };

  render() {
    const { initialValues } = this.props;
    const submitLabel = (initialValues && initialValues.id) ? 'Update' : 'Create';
    const title = (initialValues && initialValues.id) ? 'Media settings' : 'New media';
    const actions = [
      <FlatButton key="cancel" label="Cancel" onClick={this.onCancel} />,
      <FlatButton key="save" primary label={submitLabel} onClick={this.props.handleSubmit} />,
    ];
    return (
      <Dialog open modal title={title} actions={actions}>
        <TextInput multiLine fullWidth name="description" title="Description" />
        <TextInput fullWidth name="copyright" title="Copyright" />
        <TextInput fullWidth name="url" title="URL" />
        <div><strong>Resolution</strong></div>
        <div style={{ display: 'flex' }}>
          <TextInput fullWidth type="number" name="resolution.0" title="Width" />
          <TextInput fullWidth type="number" name="resolution.1" title="Height" />
        </div>
        <TextInput fullWidth type="number" name="weight" title="Weight" />
      </Dialog>
    );
  }

}
