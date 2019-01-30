import casual from 'casual';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { FormReceiver, mountForm } from '../../../test';
import { flushPromises } from '@whitewater-guide/clients';
import sourceForm from './container';
import { SourceFormProps } from './types';

jest.mock('draft-js/lib/generateRandomKey', () => () => 'random_key');

let wrapped: ReactWrapper;
let receiver: ReactWrapper<SourceFormProps>;

beforeEach(async () => {
  casual.seed(1);
});

afterEach(() => {
  wrapped.unmount();
});

const mountWithOptions = (sourceId?: string) => {
  const queries = sourceId ? undefined : { source: () => null };
  wrapped = mountForm({
    form: sourceForm,
    props: { sourceId },
    mockApollo: true,
    queries,
  });
};

it('should match snapshot for new source', async () => {
  mountWithOptions();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should match snapshot for existing source', async () => {
  mountWithOptions('foo');
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should have scripts list', async () => {
  mountWithOptions();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('scripts').length).toBeGreaterThan(0);
  expect(receiver.prop('scripts')).toMatchSnapshot();
});

it('should have regions list', async () => {
  mountWithOptions();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('regions').length).toBeGreaterThan(0);
  expect(receiver.prop('regions')).toMatchSnapshot();
});
