import * as casual from 'casual';
import { ReactWrapper } from 'enzyme';
import * as React from 'react';
import { InjectedFormProps } from 'redux-form';
import { FormReceiver, mountForm } from '../../../test';
import { WithRegionsList } from '../../../ww-clients/features/regions';
import { WithScriptsList } from '../../../ww-clients/features/scripts';
import { flushPromises } from '../../../ww-clients/test';
import sourceForm from './container';

jest.mock('draft-js/lib/generateRandomKey', () => () => 'random_key');

let wrapped: ReactWrapper;
let receiver: ReactWrapper<WithScriptsList & WithRegionsList & InjectedFormProps<any>>;

beforeEach(async () => {
  casual.seed(1);
});

afterEach(() => {
  wrapped.unmount();
});

const mountWithOptions = (sourceId?: string) => {
  wrapped = mountForm({ form: sourceForm, props: { sourceId }, mockApollo: true });
};

it('should match snapshot for new source', async () => {
  mountWithOptions();
  await flushPromises();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should match snapshot for existing source', async () => {
  mountWithOptions('foo');
  await flushPromises();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should have scripts list', async () => {
  mountWithOptions();
  await flushPromises();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('scripts').list.length).toBeGreaterThan(0);
  expect(receiver.prop('scripts')).toMatchSnapshot();
});

it('should have regions list', async () => {
  mountWithOptions();
  await flushPromises();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('regions').list.length).toBeGreaterThan(0);
  expect(receiver.prop('regions')).toMatchSnapshot();
});
