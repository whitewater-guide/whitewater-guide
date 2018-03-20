import casual from 'casual';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { InjectedFormProps } from 'redux-form';
import { FormReceiver, mountForm } from '../../../test';
import { flushPromises } from '../../../ww-clients/test';
import { GaugeInput } from '../../../ww-commons';
import gaugeForm from './container';

let wrapped: ReactWrapper;
let receiver: ReactWrapper<InjectedFormProps<GaugeInput>>;

beforeEach(async () => {
  casual.seed(1);
});

afterEach(() => {
  wrapped.unmount();
});

const mountWithOptions = (gaugeId?: string) => {
  const queries = gaugeId ? undefined : { gauge: () => null };
  wrapped = mountForm({ form: gaugeForm, props: { gaugeId, sourceId: 'lol' }, mockApollo: true, queries });
};

it('should match snapshot for new gauge', async () => {
  mountWithOptions();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should match snapshot for existing gauge', async () => {
  mountWithOptions('foo');
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should receive requestParams as string', async () => {
  mountWithOptions('foo');
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(typeof receiver.prop('initialValues').requestParams).toBe('string');
});
