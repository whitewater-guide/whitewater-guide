import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import React from 'react';
import { Mutation } from 'react-apollo';

import { Result, TOGGLE_ALL_GAUGES, Vars } from './toggleAllGauges.mutation';

interface Props {
  sourceId: string;
}

interface InnerProps {
  mutate: any;
}

interface State {
  open: boolean;
}

class EnableButtonInner extends React.PureComponent<InnerProps, State> {
  private readonly _anchor = React.createRef<any>();

  readonly state: State = { open: false };

  onToggle = () => {
    this.setState((state) => ({ open: !state.open }));
  };

  onClose = () => this.setState({ open: false });

  enableAll = () => {
    const { mutate } = this.props;
    mutate!({ variables: { linkedOnly: false } }).finally(() => {
      this.setState({ open: false });
    });
  };

  enableLinked = () => {
    const { mutate } = this.props;
    mutate!({ variables: { linkedOnly: true } }).finally(() => {
      this.setState({ open: false });
    });
  };

  render() {
    const { open } = this.state;
    return (
      <React.Fragment>
        <ButtonGroup ref={this._anchor} variant="contained">
          <Button onClick={this.enableAll}>Enable all</Button>
          <Button size="small" onClick={this.onToggle}>
            <Icon>arrow_drop_down</Icon>
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={this._anchor.current}>
          <Paper id="menu-list-grow">
            <ClickAwayListener onClickAway={this.onClose}>
              <MenuList>
                <MenuItem onClick={this.enableAll}>Enable all gauges</MenuItem>
                <MenuItem onClick={this.enableLinked}>
                  Enable linked only
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </React.Fragment>
    );
  }
}

const EnableButton: React.FC<Props> = ({ sourceId }) => (
  <Mutation<Result, Vars>
    mutation={TOGGLE_ALL_GAUGES}
    variables={{ sourceId, enabled: true }}
  >
    {(mutate) => <EnableButtonInner mutate={mutate} />}
  </Mutation>
);

export default EnableButton;
