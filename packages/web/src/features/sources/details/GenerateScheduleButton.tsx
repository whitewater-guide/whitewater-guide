import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import gql from 'graphql-tag';
import React from 'react';
import { graphql } from 'react-apollo';

const GENERATE_SOURCE_SCHEDULE = gql`
  mutation generateSourceSchedule($sourceId: ID!, $linkedOnly: Boolean) {
    generateSourceSchedule(id: $sourceId, linkedOnly: $linkedOnly) {
      id
      cron
    }
  }
`;

interface Props {
  sourceId: string;
}

interface Vars {
  sourceId: string;
  linkedOnly: boolean;
}

const container = graphql<Props, unknown, Vars>(GENERATE_SOURCE_SCHEDULE);

type InnerProps = React.ComponentProps<Parameters<typeof container>[0]>;

interface State {
  open: boolean;
}

class GenerateScheduleButtonInner extends React.PureComponent<
  InnerProps,
  State
> {
  private readonly _anchor = React.createRef<any>();

  readonly state: State = { open: false };

  onToggle = () => {
    this.setState((state) => ({ open: !state.open }));
  };

  onClose = () => this.setState({ open: false });

  generateAll = () => {
    const { mutate, sourceId } = this.props;
    mutate?.({ variables: { sourceId, linkedOnly: false } }).finally(() =>
      this.setState({ open: false }),
    );
  };

  generateLinked = () => {
    const { mutate, sourceId } = this.props;
    mutate?.({ variables: { sourceId, linkedOnly: true } }).finally(() =>
      this.setState({ open: false }),
    );
  };

  render() {
    const { open } = this.state;
    return (
      <React.Fragment>
        <ButtonGroup ref={this._anchor} variant="contained">
          <Button onClick={this.generateAll}>Generate schedule</Button>
          <Button size="small" onClick={this.onToggle}>
            <Icon>arrow_drop_down</Icon>
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={this._anchor.current}>
          <Paper id="menu-list-grow">
            <ClickAwayListener onClickAway={this.onClose}>
              <MenuList>
                <MenuItem onClick={this.generateAll}>For all gauges</MenuItem>
                <MenuItem onClick={this.generateLinked}>
                  For linked only
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </React.Fragment>
    );
  }
}

const GenerateScheduleButton = container(GenerateScheduleButtonInner);

export default GenerateScheduleButton;
