import casual from 'casual';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { FormReceiver, mountForm } from '../../../test';
import { flushPromises } from '../../../ww-clients/test';
import regionForm from './container';

jest.mock('draft-js/lib/generateRandomKey', () => () => 'random_key');

let wrapped: ReactWrapper;
let receiver: ReactWrapper;

beforeEach(async () => {
  casual.seed(1);
});

afterEach(() => {
  wrapped.unmount();
});

const mountWithOptions = (regionId?: string) => {
  const queries = regionId ? undefined : { region: () => null };
  wrapped = mountForm({ form: regionForm, props: { regionId }, mockApollo: true, queries });
  receiver = wrapped.find(FormReceiver).first() as any;
};

it('should match snapshot for new region', async () => {
  mountWithOptions();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should match snapshot for existing region', async () => {
  mountWithOptions('foo');
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});
