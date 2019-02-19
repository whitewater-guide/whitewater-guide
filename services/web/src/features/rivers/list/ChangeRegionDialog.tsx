import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { RegionFinder } from '../../regions';
import { NamedNode } from '@whitewater-guide/commons';
import { MutationFn, Mutation } from 'react-apollo';
import CHANGE_RIVER_REGION from './changeRiverRegion.mutation';

interface Props {
  riverId: string | null;
  dialogOpen: boolean;
  handleCancel: () => void;
}

interface MutationProps extends Props {
  changeRiverRegion: MutationFn<any, { regionId: string; riverId: string }>;
  loading: boolean;
}

interface State {
  region: NamedNode | null;
}

class ChangeRegionDialog extends React.PureComponent<MutationProps, State> {
  state: State = {
    region: null,
  };

  handleCancel = () => {
    this.setState({ region: null });
    this.props.handleCancel();
  };

  handleSubmit = () => {
    if (this.state.region != null && this.props.riverId != null) {
      this.props.changeRiverRegion({
        variables: {
          regionId: this.state.region.id,
          riverId: this.props.riverId,
        },
      });
    }

    this.handleCancel();
  };

  onRegionChange = (region: NamedNode | null) => {
    this.setState({ region });
  };

  render() {
    const disabled = this.props.loading || !this.state.region;

    const actions = [
      <RaisedButton key="cancel" label="Cancel" onClick={this.handleCancel} />,
      <RaisedButton
        primary
        key="submit"
        disabled={disabled}
        label="Submit"
        onClick={this.handleSubmit}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Change River's Region"
          open={this.props.dialogOpen}
          onRequestClose={this.handleCancel}
          actions={actions}
          contentStyle={{ maxWidth: '400px' }}
        >
          <RegionFinder
            region={this.state.region}
            onChange={this.onRegionChange}
          />
        </Dialog>
      </div>
    );
  }
}

const ChangeRegionDialogWithMutation: React.StatelessComponent<Props> = ({
  riverId,
  dialogOpen,
  handleCancel,
}) => (
  <Mutation mutation={CHANGE_RIVER_REGION} refetchQueries={['listRivers']}>
    {(changeRiverRegion, { loading }) => (
      <ChangeRegionDialog
        changeRiverRegion={changeRiverRegion}
        riverId={riverId}
        loading={loading}
        dialogOpen={dialogOpen}
        handleCancel={handleCancel}
      />
    )}
  </Mutation>
);

export default ChangeRegionDialogWithMutation;
