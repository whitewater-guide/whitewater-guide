import { capitalize } from 'lodash';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { Styles } from '../../../styles';
import { MediaKind } from '../../../ww-commons';
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
    const { initialValues: { kind, url } } = this.props;
    const submitLabel = url ? 'Update' : 'Create';
    const title = url ? capitalize(`${kind} settings`) : `New ${kind}`;
    const actions = [
      <FlatButton key="cancel" label="Cancel" onClick={this.onCancel} />,
      <FlatButton key="save" primary label={submitLabel} onClick={this.props.handleSubmit} />,
    ];
    return (
      <Dialog open modal title={title} actions={actions} contentStyle={styles.dialog}>
        {
          kind === MediaKind.photo ? (<PhotoForm {...this.props} />) : (<NonPhotoForm {...this.props} />)
        }
      </Dialog>
    );
  }

}
