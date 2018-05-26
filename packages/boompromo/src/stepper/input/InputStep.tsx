import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Step, { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import React from 'react';
import { Omit } from 'type-zoo';
import { StepFooter } from '../../components';

type ClassNames = 'root' | 'formControl';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  root: {
    width: '90%',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

interface Props extends Omit<StepProps, 'classes'>, WithStyles<ClassNames> {
  onPrev: () => void;
  onNext: () => void;
}

interface State {
  promo: string;
  error?: string;
  submitted: boolean;
}

class InputStep extends React.PureComponent<Props, State> {
  state: State = { promo: '', submitted: false };

  onChange = (e: any) => {
    this.setState({ promo: e.target.value });
  };

  onNext = () => {
    this.setState({ submitted: true });
    this.props.onNext();
  };

  render() {
    const { classes, onPrev, onNext, ...stepProps } = this.props;
    const { submitted, promo } = this.state;
    return (
      <Step {...stepProps}>
        <StepLabel>Введите промо код</StepLabel>
        <StepContent>
          <FormControl
            className={classes.formControl}
            error={promo.length !== 8 && submitted}
            aria-describedby="name-error-text"
          >
            <InputLabel htmlFor="name-error">Промо код</InputLabel>
            <Input id="name-error" value={promo} onChange={this.onChange} />
            {
              submitted && promo.length !== 8 &&
              (
                <FormHelperText id="name-error-text">Промо код должен состоять из 8 символов</FormHelperText>
              )
            }
          </FormControl>
          <StepFooter
            onPrev={onPrev}
            onNext={this.onNext}
            nextDisabled={promo.length !== 8}
            nextLoading={false}
          />
        </StepContent>
      </Step>
    );
  }
}

export default withStyles(styles)(InputStep);
