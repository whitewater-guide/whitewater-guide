import Button from '@material-ui/core/Button';
import Step, { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Omit } from 'type-zoo';

const LABELS = [null, 'Select campaign settings', 'Create an ad group', 'Create an ad'];

function getStepContent(step: number) {
  switch (step) {
    case 1:
      return `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`;
    case 2:
      return 'An ad group contains one or more ads which target a shared set of keywords.';
    case 3:
      return `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`;
    default:
      return 'Unknown step';
  }
}

type ClassNames = 'root' | 'button' | 'actionsContainer';

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
});

interface Props extends Omit<StepProps, 'classes'>, WithStyles<ClassNames> {
  index: number;
  activeStep: number;
  totalStep: number;
  onPrev: () => void;
  onNext: () => void;
}

class GenericStep extends React.PureComponent<Props> {
  render() {
    const { classes, activeStep, totalStep, onPrev, onNext, ...stepProps } = this.props;
    const { index } = stepProps;
    return (
      <Step {...stepProps}>
        <StepLabel>{LABELS[index]}</StepLabel>
        <StepContent>
          <Typography>{getStepContent(index)}</Typography>
          <div className={classes.actionsContainer}>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={onPrev}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="raised"
                color="primary"
                onClick={onNext}
                className={classes.button}
              >
                {activeStep === totalStep ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </StepContent>
      </Step>
    );
  }
}

export default withStyles(styles)(GenericStep);
