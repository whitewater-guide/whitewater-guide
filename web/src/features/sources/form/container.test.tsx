import * as casual from 'casual';
import { ReactWrapper } from 'enzyme';
import * as React from 'react';
import { FormReceiver, mountForm } from '../../../test';
import { flushPromises } from '../../../ww-clients/test';
import sourceForm from './container';

jest.mock('draft-js/lib/generateRandomKey', () => () => 'random_key');

let wrapped: ReactWrapper;
let receiver: ReactWrapper;

beforeEach(async () => {
  casual.seed(1);
});

afterEach(() => {
  wrapped.unmount();
});

const mountWithOptions = (sourceId?: string) => {
  wrapped = mountForm({ form: sourceForm, props: { sourceId }, mockApollo: true });
  receiver = wrapped.find(FormReceiver).first();
};

it('should match snapshot for new source', async () => {
  mountWithOptions();
  await flushPromises();
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should match snapshot for existing source', async () => {
  mountWithOptions('foo');
  await flushPromises();
  receiver = wrapped.find(FormReceiver).first();
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});
