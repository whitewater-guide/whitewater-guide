import { FlatButton } from 'material-ui';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import React from 'react';
import { Mutation } from 'react-apollo';
import { emitter, POKE_TABLES } from '../../../utils';
import TOGGLE_ALL_GAUGES from './toggleAllGauges.mutation';

interface Props {
  sourceId: string;
}

interface InnerProps {
  mutate: any;
}

interface State {
  open: boolean;
  anchorEl: any;
}

class EnableButtonInner extends React.PureComponent<InnerProps, State> {
  readonly state: State = { open: false, anchorEl: undefined };

  onOpen = (event: any) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  onClose = () => {
    this.setState({
      open: false,
    });
  };

  enableAll = () => {
    const { mutate } = this.props;
    mutate!({ variables: { linkedOnly: false } }).finally(() => {
      this.setState({ open: false });
      emitter.emit(POKE_TABLES);
    });
  };

  enableLinked = () => {
    const { mutate } = this.props;
    mutate!({ variables: { linkedOnly: true } }).finally(() => {
      this.setState({ open: false });
      emitter.emit(POKE_TABLES);
    });
  };

  render() {
    const { anchorEl, open } = this.state;
    return (
      <React.Fragment>
        <FlatButton
          secondary={true}
          onClick={this.onOpen}
          label="Enable many"
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.onClose}
        >
          <Menu>
            <MenuItem primaryText="All" onClick={this.enableAll} />
            <MenuItem primaryText="Linked only" onClick={this.enableLinked} />
          </Menu>
        </Popover>
      </React.Fragment>
    );
  }
}

const EnableButton: React.FC<Props> = ({ sourceId }) => (
  <Mutation
    mutation={TOGGLE_ALL_GAUGES}
    variables={{ sourceId, enabled: true }}
  >
    {(mutate) => <EnableButtonInner mutate={mutate} />}
  </Mutation>
);

export default EnableButton;
