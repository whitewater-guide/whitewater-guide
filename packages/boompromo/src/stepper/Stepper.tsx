import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import InputStep from './input';
import LoginStep from './login';
import { StepperStore } from './store';

const styles: StyleRulesCallback<any> = (theme) => ({
  root: {
    alignItems: 'center',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

@observer
class HorizontalNonLinearStepper extends React.Component<WithStyles<any>> {
  @observable store: StepperStore = new StepperStore();

  render() {
    const { classes } = this.props;
    const { activeStep, completed, nextStep, prevStep } = this.store;
    return (
      <div className={classes.root}>
        <Stepper orientation="vertical" activeStep={activeStep}>
          <Step active={activeStep === 0} completed={completed.get(0)}>
            <StepLabel>Войдите</StepLabel>
            <LoginStep next={nextStep} />
          </Step>
          <Step active={activeStep === 1} completed={completed.get(1)}>
            <StepLabel>Введите промо код</StepLabel>
            <InputStep next={nextStep} prev={prevStep} />
          </Step>
          <Step active={activeStep === 2} completed={completed.get(2)}>
            <StepLabel>
              Выберите регион
            </StepLabel>
            <StepContent>
              <p>hi</p>
            </StepContent>
          </Step>
          <Step active={activeStep === 3} completed={completed.get(3)}>
            <StepLabel>
              Активируйте промо код
            </StepLabel>
            <StepContent>
              <p>hi</p>
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}

export default withStyles(styles)(HorizontalNonLinearStepper);
