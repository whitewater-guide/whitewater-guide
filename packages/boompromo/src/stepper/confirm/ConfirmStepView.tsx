import Divider from '@material-ui/core/Divider';
import { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Omit } from 'type-zoo';
import { StepFooter } from '../../components';
import { BoomPromoInfo } from '../../ww-commons/features/purchases';
import { Region } from '../../ww-commons/features/regions';
import { ConfirmStepStore } from './store';

type ClassNames = 'divider';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  divider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
});

type Props = Omit<StepProps, 'classes'> & WithStyles<ClassNames> & {
  prev: () => void;
  next: () => void;
  region: Region | null;
  promo: BoomPromoInfo;
};

@observer
class ConfirmStepView extends React.PureComponent<Props> {
  @observable store: ConfirmStepStore = new ConfirmStepStore();

  onNext = async () => {
    const { region, promo, next } = this.props;
    const success = await this.store.activatePromo(
      promo.code,
      (promo.groupSku || region!.sku)!,
    );
    if (promo) {
      // this.props.next(promo);
      this.store.reset();
    }
  };

  onPrev = () => {
    this.props.prev();
    this.store.reset();
  };

  render() {
    const { classes, prev, next, ...stepProps } = this.props;
    return (
      <StepContent {...stepProps}>
        <Divider className={classes.divider} />
        <StepFooter
          onPrev={this.onPrev}
          onNext={this.onNext}
          nextDisabled={false}
          nextLoading={false}
        />
      </StepContent>
    );
  }
}

export default withStyles(styles)(ConfirmStepView);
