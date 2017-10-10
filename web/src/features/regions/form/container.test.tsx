import * as casual from 'casual';
import { ReactWrapper } from 'enzyme';
import * as React from 'react';
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
  wrapped = mountForm({ form: regionForm, props: { regionId }, mockApollo: true });
  receiver = wrapped.find(FormReceiver).first();
};

it('should match snapshot for new region', async () => {
  mountWithOptions();
  await flushPromises();
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should match snapshot for existing region', async () => {
  mountWithOptions('foo');
  await flushPromises();
  receiver = wrapped.find(FormReceiver).first();
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});
