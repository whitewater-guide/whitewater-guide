import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import GenericStep from './GenericStep';
import LoginStep from './login';

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

interface State {
  activeStep: number;
  completed: {[key: number]: boolean};
}

class HorizontalNonLinearStepper extends React.Component<WithStyles<any>, State> {
  state: State = {
    activeStep: 0,
    completed: {},
  };

  handleNext = () => {
    let activeStep;
    activeStep = this.state.activeStep + 1;
    this.setState({
      activeStep,
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
      completed: {},
    });
  };

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;
    return (
      <div className={classes.root}>
        <Stepper orientation="vertical" activeStep={activeStep}>
          <LoginStep onLogin={this.handleNext} />
          <GenericStep index={1} activeStep={activeStep} totalStep={4} onNext={this.handleNext} onPrev={this.handleBack} />
          <GenericStep index={2} activeStep={activeStep} totalStep={4} onNext={this.handleNext} onPrev={this.handleBack} />
          <GenericStep index={3} activeStep={activeStep} totalStep={4} onNext={this.handleNext} onPrev={this.handleBack} />
        </Stepper>
        {activeStep === 4 && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&quot;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(HorizontalNonLinearStepper);
