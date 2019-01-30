import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import LoginStepView from './LoginStepView';
import { getMockStore, LoginStepStore } from './store';

// tslint:disable-next-line
const fbUser = {
  id: '1111',
  name: 'Ivan Ivanov',
  picture: {
    data: {
      url:
        'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-1/p160x160/1780622_1380926282175020_67535950_n.jpg?_nc_cat=0&_nc_eui2=AeHyXIZyU-vnhcOJPMs22iNGhja4jwQ7q37Ll9vjb5vNmct9CCjeuRLxSm_1L158HZo6B5RKughCcUrJyOwOpapm3XR6YlYPKDnBFjn8vyMDfA&oh=0758d1877f402ad4047be7d3c3ce20a1&oe=5BBC44F0',
    },
  },
};

storiesOf('LoginStepView', module)
  .addDecorator((story) => (
    <div style={{ width: 400 }}>
      <Stepper orientation="vertical" activeStep={0}>
        <Step active completed={false}>
          <StepLabel>Войдите</StepLabel>
          {story()}
        </Step>
      </Stepper>
    </div>
  ))
  .add('default', () => {
    return <LoginStepView next={action('next')} />;
  })
  .add('facebook loaded', () => {
    const store = getMockStore();
    store.me = fbUser;
    return <LoginStepView next={action('next')} store={store} />;
  })
  .add('facebook loaded, loading login', () => {
    const store = getMockStore();
    store.me = fbUser;
    store.loading = true;
    return <LoginStepView next={action('next')} store={store} />;
  });
