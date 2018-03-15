import { capitalize } from 'lodash';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { TextInput } from '../../../components/forms';
import { MediaKind } from '../../../ww-commons';
import { MediaFormProps } from './types';

export default class MediaForm extends React.PureComponent<MediaFormProps> {

  onCancel = () => this.props.history.goBack();

  render() {
    const { initialValues } = this.props;
    const submitLabel = (initialValues && initialValues.url) ? 'Update' : 'Create';
    const title = (initialValues && initialValues.url) ?
      capitalize(`${initialValues.kind} settings`) :
      `New ${initialValues.kind}`;
    const actions = [
      <FlatButton key="cancel" label="Cancel" onClick={this.onCancel} />,
      <FlatButton key="save" primary label={submitLabel} onClick={this.props.handleSubmit} />,
    ];
    return (
      <Dialog open modal title={title} actions={actions}>
        <TextInput multiLine fullWidth name="description" title="Description" />
        <TextInput fullWidth name="copyright" title="Copyright" />
        <TextInput fullWidth name="url" title="URL" />
        {
          initialValues.kind === MediaKind.photo &&
          (
            <React.Fragment>
              <div><strong>Resolution</strong></div>
              <div style={{ display: 'flex' }}>
                <TextInput fullWidth type="number" name="resolution.0" title="Width" />
                <TextInput fullWidth type="number" name="resolution.1" title="Height" />
              </div>
            </React.Fragment>
          )
        }
        <TextInput fullWidth type="number" name="weight" title="Weight" />
      </Dialog>
    );
  }

}
