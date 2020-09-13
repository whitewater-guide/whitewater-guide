import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { NamedNode } from '@whitewater-guide/commons';
import React from 'react';
import { Mutation, MutationFunction } from 'react-apollo';

import { RegionFinder } from '../../../components';
import {
  CHANGE_RIVER_REGION,
  Result,
  Vars,
} from './changeRiverRegion.mutation';

interface Props {
  riverId: string | null;
  dialogOpen: boolean;
  handleCancel: () => void;
}

interface MutationProps extends Props {
  changeRiverRegion: MutationFunction<
    any,
    { regionId: string; riverId: string }
  >;
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

    return (
      <Dialog
        open={this.props.dialogOpen}
        onClose={this.handleCancel}
        maxWidth="lg"
      >
        <DialogTitle>Change River&lsquo;s Region</DialogTitle>
        <DialogContent>
          <RegionFinder
            value={this.state.region}
            onChange={this.onRegionChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel}>Cancel</Button>
          <Button
            color="primary"
            disabled={disabled}
            onClick={this.handleSubmit}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const ChangeRegionDialogWithMutation: React.FC<Props> = ({
  riverId,
  dialogOpen,
  handleCancel,
}) => (
  <Mutation<Result, Vars>
    mutation={CHANGE_RIVER_REGION}
    refetchQueries={['listRivers']}
  >
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
