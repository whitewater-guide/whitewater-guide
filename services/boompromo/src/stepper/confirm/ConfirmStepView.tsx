import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { BoomPromoInfo, Region } from '@whitewater-guide/commons';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Omit } from 'type-zoo';
import { StepFooter } from '../../components';
import Footer from './Footer';
import { ConfirmStepStore } from './store';
import { IConfirmStepStore } from './types';

type ClassNames = 'divider';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  divider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
});

type Props = Omit<StepProps, 'classes'> &
  WithStyles<ClassNames> & {
    prev: () => void;
    region: Region | null;
    promo: BoomPromoInfo;
    store?: IConfirmStepStore;
    username: string | null;
  };

@observer
class ConfirmStepView extends React.Component<Props> {
  @observable store: IConfirmStepStore = new ConfirmStepStore();

  constructor(props: Props) {
    super(props);
    if (props.store) {
      this.store = props.store;
    }
  }

  onNext = async () => {
    const { region, promo } = this.props;
    await this.store.activatePromo(
      promo.code,
      (promo.groupSku || region!.sku)!,
    );
  };

  onPrev = () => {
    this.props.prev();
    this.store.reset();
  };

  onRestart = () => window.location.reload(true);

  getPrize = () => {
    const { region, promo } = this.props;
    if (region) {
      return (
        <>
          {`один регион на выбор - `}
          <strong>{region.name}</strong>
        </>
      );
    }
    return (
      <strong>
        {promo.groupSku === 'group.all'
          ? 'все регионы'
          : 'регионы Европы и СНГ на русском'}
      </strong>
    );
  };

  renderSuccess = () => (
    <React.Fragment>
      <Typography gutterBottom={true} variant="headline">
        Успех!
      </Typography>
      <Typography gutterBottom={true} variant="subheading">
        Промокод был активирован
      </Typography>
      <Typography gutterBottom={true}>
        {`Вознаграждение: `}
        {this.getPrize()}
      </Typography>
      <Typography>
        Теперь войдите в приложение whitewater.guide под вашим аккаунтом
        facebook
      </Typography>
      <Footer />
      <Button color="primary" onClick={this.onRestart} size="small">
        Начать заново
      </Button>
    </React.Fragment>
  );

  renderConfirmation = () => {
    const { classes, username, promo } = this.props;
    if (!promo) {
      return null;
    }
    return (
      <React.Fragment>
        <Typography variant="subheading">
          {'Вы почти активировали промокод '}
          <strong>{promo.code}</strong>
        </Typography>
        <Typography>На всякий случай, проверьте:</Typography>
        <Typography component="ul">
          <li>
            {`Вознаграждение: `}
            {this.getPrize()}
          </li>
          <li>
            {'Спонсор: '}
            <b>{username}</b>
          </li>
        </Typography>
        {!this.store.loading &&
          (!!this.store.error || this.store.success === false) && (
            <FormHelperText error={true}>
              {this.store.error || 'Вы уже активировали этот промокод ранее'}
            </FormHelperText>
          )}
        <Divider className={classes.divider} />
        <StepFooter
          onPrev={this.onPrev}
          onNext={this.onNext}
          nextDisabled={false}
          nextLoading={this.store.loading}
          nextLabel="Активировать!"
        />
      </React.Fragment>
    );
  };

  render() {
    const {
      classes,
      store,
      username,
      region,
      promo,
      prev,
      ...stepProps
    } = this.props;
    return (
      <StepContent {...stepProps}>
        {this.store.success ? this.renderSuccess() : this.renderConfirmation()}
      </StepContent>
    );
  }
}

export default withStyles(styles)(ConfirmStepView);
