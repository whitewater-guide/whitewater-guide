import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
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

  async componentWillMount() {
    // @ts-ignore
    await import('jsondiffpatch/dist/formatters-styles/html.css');
    const diffModule = await import('jsondiffpatch');
    this.setState({ jsondiffpatch: diffModule });
    console.dir(diffModule);
  }

  render() {
    const { diff, onRequestClose } = this.props;
    const { jsondiffpatch } = this.state;
    let innerHtml: any = null;
    if (jsondiffpatch) {
      innerHtml = { __html: jsondiffpatch.formatters.html.format(diff) };
    }
    const actions = [
      <FlatButton
        key="closeButton"
        label="Close"
        primary={true}
        onClick={onRequestClose}
      />,
    ];
    return (
      <Dialog
        title="View diff"
        actions={actions}
        modal={false}
        open={true}
        onRequestClose={onRequestClose}
      >
        {innerHtml ? (
          <div style={styles.wrapper} dangerouslySetInnerHTML={innerHtml} />
        ) : (
          <Loading />
        )}
      </Dialog>
    );
  }
}
