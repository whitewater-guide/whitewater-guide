import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import ConfirmStepView from './ConfirmStepView';
import { getMockStore } from './store';

storiesOf('ConfirmStepView', module)
  .addDecorator((story) => (
    <div style={{ width: 480 }}>
      <Stepper orientation="vertical" activeStep={0}>
        <Step active completed={false}>
          <StepLabel>Подтвердите активацию</StepLabel>
          {story()}
        </Step>
      </Stepper>
    </div>
  ))
  .add('group promo', () => {
    return (
      <ConfirmStepView
        username="Вася Пупкин"
        promo={{
          id: 'x',
          groupSku: 'group.all',
          groupName: 'Все регионы',
          code: 'qwertyui',
          redeemed: false,
        }}
        region={null}
        prev={action('prev')}
      />
    );
  })
  .add('region promo', () => {
    return (
      <ConfirmStepView
        username="Вася Пупкин"
        promo={{
          id: 'x',
          groupSku: null,
          groupName: null,
          code: 'qwertyui',
          redeemed: false,
        }}
        region={{ id: 'aa', name: 'Грузия', ski: 'region.georgia' } as any}
        prev={action('prev')}
      />
    );
  })
  .add('error', () => {
    const store = getMockStore();
    store.error = 'Похоже этот промокод уже активирован';
    return (
      <ConfirmStepView
        username="Вася Пупкин"
        promo={{
          id: 'x',
          groupSku: null,
          groupName: null,
          code: 'qwertyui',
          redeemed: false,
        }}
        region={{ id: 'aa', name: 'Грузия', ski: 'region.georgia' } as any}
        prev={action('prev')}
        store={store}
      />
    );
  })
  .add('loading', () => {
    const store = getMockStore();
    store.loading = true;
    store.error = 'Похоже этот промокод уже активирован';
    return (
      <ConfirmStepView
        username="Вася Пупкин"
        promo={{
          id: 'x',
          groupSku: null,
          groupName: null,
          code: 'qwertyui',
          redeemed: false,
        }}
        region={{ id: 'aa', name: 'Грузия', ski: 'region.georgia' } as any}
        prev={action('prev')}
        store={store}
      />
    );
  })
  .add('success - single region', () => {
    const store = getMockStore();
    store.success = true;
    return (
      <ConfirmStepView
        username="Вася Пупкин"
        promo={{
          id: 'x',
          groupSku: null,
          groupName: null,
          code: 'qwertyui',
          redeemed: false,
        }}
        region={{ id: 'aa', name: 'Грузия', ski: 'region.georgia' } as any}
        prev={action('prev')}
        store={store}
      />
    );
  })
  .add('success - group all', () => {
    const store = getMockStore();
    store.success = true;
    return (
      <ConfirmStepView
        username="Вася Пупкин"
        promo={{
          id: 'x',
          groupSku: 'group.all',
          groupName: 'Все регионы',
          code: 'qwertyui',
          redeemed: false,
        }}
        region={null}
        prev={action('prev')}
        store={store}
      />
    );
  })
  .add('success - group eu cis', () => {
    const store = getMockStore();
    store.success = true;
    return (
      <ConfirmStepView
        username="Вася Пупкин"
        promo={{
          id: 'x',
          groupSku: 'group.boom1000',
          groupName: 'Промо за 1000',
          code: 'qwertyui',
          redeemed: false,
        }}
        region={null}
        prev={action('prev')}
        store={store}
      />
    );
  })
  .add('failure', () => {
    const store = getMockStore();
    store.success = false;
    return (
      <ConfirmStepView
        username="Вася Пупкин"
        promo={{
          id: 'x',
          groupSku: null,
          groupName: null,
          code: 'qwertyui',
          redeemed: false,
        }}
        region={{ id: 'aa', name: 'Грузия', ski: 'region.georgia' } as any}
        prev={action('prev')}
        store={store}
      />
    );
  });
