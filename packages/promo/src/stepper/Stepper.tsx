import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import MUIStepper from '@material-ui/core/Stepper';
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmStep from './confirm';
import EnterCodeStep from './enter-code';
import LoginStep from './login';
import SelectRegionStep from './select-region';
import { Steps } from './Steps';
import { useStepper } from './useStepper';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
    },
    button: {
      marginRight: theme.spacing(),
    },
    completed: {
      display: 'inline-block',
    },
    instructions: {
      marginTop: theme.spacing(),
      marginBottom: theme.spacing(),
    },
  });

const Stepper: React.FC<WithStyles<typeof styles>> = ({ classes }) => {
  const {
    activeStep,
    completedSteps,
    nextStep,
    prevStep,
    promo,
    region,
  } = useStepper();
  const { t } = useTranslation();
  return (
    <div className={classes.root}>
      <MUIStepper orientation="vertical" activeStep={activeStep}>
        <Step
          active={activeStep === Steps.LOGIN}
          completed={completedSteps[Steps.LOGIN]}
        >
          <StepLabel>{t(`main:step${Steps.LOGIN}`)}</StepLabel>
          <LoginStep next={nextStep} />
        </Step>
        <Step
          active={activeStep === Steps.ENTER_CODE}
          completed={completedSteps[Steps.ENTER_CODE]}
        >
          <StepLabel>{t(`main:step${Steps.ENTER_CODE}`)}</StepLabel>
          <EnterCodeStep next={nextStep} prev={prevStep} />
        </Step>
        <Step
          active={activeStep === Steps.SELECT_REGION}
          completed={completedSteps[Steps.SELECT_REGION]}
        >
          <StepLabel>{t(`main:step${Steps.SELECT_REGION}`)}</StepLabel>
          <SelectRegionStep next={nextStep} prev={prevStep} />
        </Step>
        <Step
          active={activeStep === Steps.CONFIRM}
          completed={completedSteps[Steps.CONFIRM]}
        >
          <StepLabel>{t(`main:step${Steps.CONFIRM}`)}</StepLabel>
          <ConfirmStep prev={prevStep} region={region} promo={promo!} />
        </Step>
      </MUIStepper>
    </div>
  );
};

export default withStyles(styles)(Stepper);
