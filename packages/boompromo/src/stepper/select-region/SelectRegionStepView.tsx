import Divider from '@material-ui/core/es/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { Omit } from 'type-zoo';
import { StepFooter } from '../../components';
import { Region } from '../../ww-commons';
import NoRegions from './NoRegions';
import { PROMO_REGIONS_QUERY, Result } from './promoRegions.query';
import RegionSelector from './RegionSelector';

type ClassNames = 'button' | 'progress' | 'divider';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  divider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
});

type Props = Omit<StepProps, 'classes'> & WithStyles<ClassNames> & {
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
              <RegionSelector regions={data.promoRegions} value={region} onChange={this.onChange} />
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
