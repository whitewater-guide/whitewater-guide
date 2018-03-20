import casual from 'casual';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { InjectedFormProps } from 'redux-form';
import { FormReceiver, mountForm } from '../../../test';
import { flushPromises } from '../../../ww-clients/test';
import { RiverInput } from '../../../ww-commons';
import riverForm from './container';

let wrapped: ReactWrapper;
let receiver: ReactWrapper<InjectedFormProps<RiverInput>>;

beforeEach(async () => {
  casual.seed(1);
});

afterEach(() => {
  wrapped.unmount();
});

const mountWithOptions = (riverId?: string) => {
  const queries = riverId ? undefined : { river: () => null };
  wrapped = mountForm({ form: riverForm, props: { riverId, sourceId: 'lol' }, mockApollo: true, queries });
};

it('should match snapshot for new river', async () => {
  mountWithOptions();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should match snapshot for existing river', async () => {
  mountWithOptions('foo');
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});
