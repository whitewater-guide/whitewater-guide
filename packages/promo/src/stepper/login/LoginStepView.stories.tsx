import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Credentials } from '@whitewater-guide/clients';
import { Formik } from 'formik';
import React from 'react';

import getValidationSchema from './getValidationSchema';
import LoginStepView from './LoginStepView';

const initialValues: Credentials = {
  email: '',
  password: '',
};

storiesOf('LoginStepView', module)
  .addDecorator((story) => (
    <div style={{ width: 400 }}>
      <Formik<Credentials>
        onSubmit={action('submit')}
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
      >
        <Stepper orientation="vertical" activeStep={0}>
          <Step active={true} completed={false}>
            <StepLabel>Войдите</StepLabel>
            {story()}
          </Step>
        </Stepper>
      </Formik>
    </div>
  ))
  .add('default', () => {
    return (
      <LoginStepView onPressLocal={action('local')} onPressFB={action('fb')} />
    );
  })
  .add('loading local', () => {
    return (
      <LoginStepView
        isValid={true}
        onPressLocal={action('local')}
        onPressFB={action('fb')}
        isLoadingLocal={true}
      />
    );
  })
  .add('loading fb', () => {
    return (
      <LoginStepView
        isValid={true}
        onPressLocal={action('local')}
        onPressFB={action('fb')}
        isLoadingFB={true}
      />
    );
  })
  .add('has form error', () => {
    return (
      <LoginStepView
        onPressLocal={action('local')}
        onPressFB={action('fb')}
        errors={{ form: 'fb_failed' }}
      />
    );
  });
