import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import InputStepView from './InputStepView';
import { getMockStore } from './store';

storiesOf('InputStepView', module)
  .addDecorator(story => (
    <div style={{ width: 400 }}>
      <Stepper orientation="vertical" activeStep={0}>
        <Step active completed={false}>
          <StepLabel>Введите промо код</StepLabel>
          {story()}
        </Step>
      </Stepper>
    </div>
  ))
  .add('default', () => {
    return (
      <InputStepView
        next={action('next')}
        prev={action('prev')}
      />
    );
  })
  .add('partial code', () => {
    const store = getMockStore();
    store.code = 'aaa';
    return (
      <InputStepView
        next={action('next')}
        prev={action('prev')}
        store={store}
      />
    );
  })
  .add('good cde', () => {
    const store = getMockStore();
    store.code = 'aaaa1111';
    store.ready = true;
    return (
      <InputStepView
        next={action('next')}
        prev={action('prev')}
        store={store}
      />
    );
  })
  .add('loading', () => {
    const store = getMockStore();
    store.code = 'aaaa1111';
    store.ready = true;
    store.loading = true;
    return (
      <InputStepView
        next={action('next')}
        prev={action('prev')}
        store={store}
      />
    );
  })
  .add('error', () => {
    const store = getMockStore();
    store.code = 'aaaa1111';
    store.ready = true;
    store.error = 'Похоже этот промо код не подходит';
    return (
      <InputStepView
        next={action('next')}
        prev={action('prev')}
        store={store}
      />
    );
  });
