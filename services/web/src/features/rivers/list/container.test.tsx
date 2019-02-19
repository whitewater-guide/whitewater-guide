import { flushPromises } from '@whitewater-guide/clients';
import casual from 'casual';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { Loading } from '../../../components';
import { FormReceiver, mountForm } from '../../../test';
import container from './container';
import { RiversListProps } from './types';

let wrapped: ReactWrapper;
let receiver: ReactWrapper<RiversListProps>;

beforeEach(async () => {
  casual.seed(1);
});

afterEach(() => {
  wrapped.unmount();
});

const removeRiver = jest.fn(() => 'deleted');

const mount = (regionId?: string) => {
  wrapped = mountForm({
    form: container,
    props: { regionId },
    mockApollo: true,
    mutations: { removeRiver },
  });
};

it('should have region id', async () => {
  mount('lol');
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('regionId')).toBe('lol');
});

it('should have loading state', async () => {
  mount();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(true);
  await flushPromises();
  wrapped.update();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(false);
});

it('should delete river', async () => {
  mount();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  receiver.prop('removeRiver')('foo');
  await flushPromises();
  expect(removeRiver).toBeCalled();
});

it('should match snapshot', async () => {
  mount();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('rivers')).toMatchSnapshot();
});
