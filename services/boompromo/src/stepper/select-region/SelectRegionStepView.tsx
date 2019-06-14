import { createStyles, Divider, Theme } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Region } from '@whitewater-guide/commons';
import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { StepFooter } from '../../components';
import NoRegions from './NoRegions';
import { PROMO_REGIONS_QUERY, Result } from './promoRegions.query';
import RegionSelector from './RegionSelector';

const styles = (theme: Theme) =>
  createStyles({
    progress: {
      margin: theme.spacing(2),
    },
    button: {
      marginTop: theme.spacing(),
      marginRight: theme.spacing(),
    },
    divider: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
  });

type Props = Omit<StepProps, 'classes'> &
  WithStyles<typeof styles> & {
    prev: () => void;
    next: (region: Region) => void;
  };

interface State {
  region: Region | null;
}

class SelectRegionStepView extends React.Component<Props, State> {
  state: State = {
    region: null,
  };

  onNext = async () => {
    const { region } = this.state;
    this.setState({ region: null });
    this.props.next(region!);
  };

  onPrev = () => {
    this.setState({ region: null });
    this.props.prev();
  };

  onChange = (region: Region | null) => this.setState({ region });

  render() {
    const { classes, prev, next, ...stepProps } = this.props;
    const { region } = this.state;
    return (
      <StepContent {...stepProps}>
        <Query query={PROMO_REGIONS_QUERY} fetchPolicy="network-only">
          {({ data, loading }: QueryResult<Result, {}>) => {
            if (loading || !data) {
              return <LinearProgress />;
            }
            if (data.promoRegions.length === 0) {
              return <NoRegions />;
            }
            return (
              <RegionSelector
                regions={data.promoRegions}
                value={region}
                onChange={this.onChange}
              />
            );
          }}
        </Query>
        <Divider className={classes.divider} />
        <StepFooter
          onPrev={this.onPrev}
          onNext={this.onNext}
          nextDisabled={!region}
          nextLoading={false}
        />
      </StepContent>
    );
  }
}

export default withStyles(styles)(SelectRegionStepView);
