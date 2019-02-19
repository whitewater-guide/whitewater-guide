import { MediaKind } from '@whitewater-guide/commons';
import capitalize from 'lodash/capitalize';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import { Styles } from '../../../styles';
import NonPhotoForm from './NonPhotoForm';
import PhotoForm from './PhotoForm';
import { MediaFormProps } from './types';

const styles: Styles = {
  dialog: {
    maxWidth: '80vw',
  },
};

export default class MediaForm extends React.PureComponent<MediaFormProps> {
  onCancel = () => this.props.history.goBack();

  render() {
    const {
      initialValues: { kind, url },
    } = this.props;
    const submitLabel = url ? 'Update' : 'Create';
    const title = url ? capitalize(`${kind} settings`) : `New ${kind}`;
    const actions = [
      <FlatButton key="cancel" label="Cancel" onClick={this.onCancel} />,
      <FlatButton
        key="save"
        primary={true}
        label={submitLabel}
        onClick={this.props.handleSubmit}
      />,
    ];
    return (
      <Dialog
        open={true}
        modal={true}
        title={title}
        actions={actions}
        contentStyle={styles.dialog}
      >
        <ErrorBoundary>
          {kind === MediaKind.photo ? (
            <PhotoForm {...this.props} />
          ) : (
            <NonPhotoForm {...this.props} />
          )}
        </ErrorBoundary>
      </Dialog>
    );
  }
}
