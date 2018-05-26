import Button from '@material-ui/core/Button';
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

type ClassNames = 'root' | 'button' | 'actionsContainer' | 'formControl';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
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

  onPrev = () => {
    this.props.onPrev();
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
          <div className={classes.actionsContainer}>
            <div>
              <Button onClick={this.onPrev} className={classes.button}>
                Назад
              </Button>
              <Button variant="raised" color="primary" onClick={this.onNext} className={classes.button}>
                Продолжить
              </Button>
            </div>
          </div>
        </StepContent>
      </Step>
    );
  }
}

export default withStyles(styles)(InputStep);
