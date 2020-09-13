import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

import { Loading } from '../../components';
import { Styles } from '../../styles';

const styles: Styles = {
  wrapper: {
    maxHeight: 600,
    overflowY: 'auto',
  },
};

interface Props {
  diff: object;
  onRequestClose: () => void;
}

interface State {
  jsondiffpatch: any;
}

export class DiffDialog extends React.PureComponent<Props, State> {
  readonly state: State = { jsondiffpatch: null };

  async UNSAFE_componentWillMount() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await import('jsondiffpatch/dist/formatters-styles/html.css');
    const diffModule = await import('jsondiffpatch');
    this.setState({ jsondiffpatch: diffModule });
  }

  render() {
    const { diff, onRequestClose } = this.props;
    const { jsondiffpatch } = this.state;
    let innerHtml: any = null;
    if (jsondiffpatch) {
      innerHtml = { __html: jsondiffpatch.formatters.html.format(diff) };
    }
    return (
      <Dialog open={true} onClose={onRequestClose}>
        <DialogTitle>View diff</DialogTitle>
        <DialogContent>
          {innerHtml ? (
            <div style={styles.wrapper} dangerouslySetInnerHTML={innerHtml} />
          ) : (
            <Loading />
          )}
        </DialogContent>
        <DialogActions>
          <Button key="closeButton" color="primary" onClick={onRequestClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
