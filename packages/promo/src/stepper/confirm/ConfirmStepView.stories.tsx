import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import ConfirmStepView from './ConfirmStepView';

storiesOf('ConfirmStepView', module)
  .addDecorator((story) => (
    <div style={{ width: 480 }}>
      <Stepper orientation="vertical" activeStep={0}>
        <Step active={true} completed={false}>
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
        onPrev={action('prev')}
        onNext={action('next')}
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
        onPrev={action('prev')}
        onNext={action('next')}
      />
    );
  })
  .add('error', () => {
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
        onPrev={action('prev')}
        onNext={action('next')}
        error="Похоже этот промокод уже активирован"
      />
    );
  })
  .add('loading', () => {
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
        loading={true}
        onPrev={action('prev')}
        onNext={action('next')}
      />
    );
  })
  .add('success - single region', () => {
    return (
      <ConfirmStepView
        success={true}
        username="Вася Пупкин"
        promo={{
          id: 'x',
          groupSku: null,
          groupName: null,
          code: 'qwertyui',
          redeemed: false,
        }}
        region={{ id: 'aa', name: 'Грузия', ski: 'region.georgia' } as any}
        onPrev={action('prev')}
        onNext={action('next')}
      />
    );
  })
  .add('success - group all', () => {
    return (
      <ConfirmStepView
        success={true}
        username="Вася Пупкин"
        promo={{
          id: 'x',
          groupSku: 'group.all',
          groupName: 'Все регионы',
          code: 'qwertyui',
          redeemed: false,
        }}
        region={null}
        onPrev={action('prev')}
        onNext={action('next')}
      />
    );
  })
  .add('success - group eu cis', () => {
    return (
      <ConfirmStepView
        success={true}
        username="Вася Пупкин"
        promo={{
          id: 'x',
          groupSku: 'group.boom1000',
          groupName: 'Промо за 1000',
          code: 'qwertyui',
          redeemed: false,
        }}
        region={null}
        onPrev={action('prev')}
        onNext={action('next')}
      />
    );
  });
