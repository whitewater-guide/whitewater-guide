import gql from 'graphql-tag';
import { FlatButton } from 'material-ui';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
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

const container = graphql<Props, {}, Vars>(GENERATE_SOURCE_SCHEDULE);

type InnerProps = React.ComponentProps<Parameters<typeof container>[0]>;

interface State {
  open: boolean;
  anchorEl: any;
}

class GenerateScheduleButtonInner extends React.PureComponent<
  InnerProps,
  State
> {
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

  generateAll = () => {
    const { mutate, sourceId } = this.props;
    mutate!({ variables: { sourceId, linkedOnly: false } }).finally(() =>
      this.setState({ open: false }),
    );
  };

  generateLinked = () => {
    const { mutate, sourceId } = this.props;
    mutate!({ variables: { sourceId, linkedOnly: true } }).finally(() =>
      this.setState({ open: false }),
    );
  };

  render() {
    const { anchorEl, open } = this.state;
    return (
      <React.Fragment>
        <FlatButton
          secondary={true}
          onClick={this.onOpen}
          label="Generate schedule"
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.onClose}
        >
          <Menu>
            <MenuItem primaryText="All" onClick={this.generateAll} />
            <MenuItem primaryText="Linked only" onClick={this.generateLinked} />
          </Menu>
        </Popover>
      </React.Fragment>
    );
  }
}

const GenerateScheduleButton = container(GenerateScheduleButtonInner);

export default GenerateScheduleButton;
