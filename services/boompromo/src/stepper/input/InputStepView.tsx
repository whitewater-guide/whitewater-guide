import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import StepContent from '@material-ui/core/StepContent';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import { BoomPromoInfo } from '@whitewater-guide/commons';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { StepFooter } from '../../components';
import { InputStepStore } from './store';
import { IInputStepStore } from './types';

type ClassNames = 'formControl';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  formControl: {
    margin: theme.spacing.unit,
  },
});

interface Props extends WithStyles<ClassNames> {
  next: (info: BoomPromoInfo) => void;
  prev: () => void;
  store?: IInputStepStore;
}

@observer
class InputStepView extends React.Component<Props> {
  @observable store: IInputStepStore = new InputStepStore();

  constructor(props: Props) {
    super(props);
    if (props.store) {
      this.store = props.store;
    }
  }

  onNext = async () => {
    const promo = await this.store.checkBoomPromo();
    if (promo) {
      this.props.next(promo);
      this.store.reset();
    }
  };

  onPrev = () => {
    this.props.prev();
    this.store.reset();
  };

  render() {
    const { classes, store, prev, next, ...stepProps } = this.props;
    const { code, error, loading, ready, setCode } = this.store;
    return (
      <StepContent {...stepProps}>
        <FormControl className={classes.formControl} error={!!error}>
          <InputLabel htmlFor="name-simple">Промокод</InputLabel>
          <Input id="name-simple" value={code} onChange={setCode} />
          <FormHelperText id="name-error-text">{error}</FormHelperText>
        </FormControl>
        <StepFooter
          onPrev={this.onPrev}
          onNext={this.onNext}
          nextDisabled={!ready}
          nextLoading={loading}
        />
      </StepContent>
    );
  }
}

export default withStyles(styles)(InputStepView);
