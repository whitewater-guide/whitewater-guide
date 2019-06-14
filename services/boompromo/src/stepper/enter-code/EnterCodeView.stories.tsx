import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import EnterCodeView from './EnterCodeView';

storiesOf('EnterCodeView', module)
  .addDecorator((story) => (
    <div style={{ width: 400 }}>
      <Stepper orientation="vertical" activeStep={0}>
        <Step active={true} completed={false}>
          <StepLabel>Введите промокод</StepLabel>
          {story()}
        </Step>
      </Stepper>
    </div>
  ))
  .add('default', () => {
    return <EnterCodeView next={action('next')} prev={action('prev')} />;
  })
  .add('partial code', () => {
    return (
      <EnterCodeView next={action('next')} prev={action('prev')} value="AA11" />
    );
  })
  .add('good code', () => {
    return (
      <EnterCodeView
        next={action('next')}
        prev={action('prev')}
        value="aaaa1111"
      />
    );
  })
  .add('loading', () => {
    return (
      <EnterCodeView
        next={action('next')}
        prev={action('prev')}
        value="aaaa1111"
        loading={true}
      />
    );
  })
  .add('error', () => {
    return (
      <EnterCodeView
        next={action('next')}
        prev={action('prev')}
        value="aaaa1111"
        error="Похоже этот промокод не подходит"
      />
    );
  });
