import casual from 'casual';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { Loading } from '../../../components';
import { FormReceiver, mountForm } from '../../../test';
import { flushPromises } from '../../../ww-clients/test';
import container from './container';
import { GaugesListInnerProps } from './types';

let wrapped: ReactWrapper;
let receiver: ReactWrapper<GaugesListInnerProps>;

beforeEach(async () => {
  casual.seed(1);
});

afterEach(() => {
  wrapped.unmount();
});

const removeGauge = jest.fn(() => 'deleted');

const mount = (sourceId?: string) => {
  wrapped = mountForm({ form: container, props: { sourceId }, mockApollo: true, mutations: { removeGauge } });
};

it('should have source id', async () => {
  mount('lol');
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('sourceId')).toBe('lol');
});

it('should have loading state', async () => {
  mount();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(true);
  await flushPromises();
  wrapped.update();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(false);
});

it('should delete gauge', async () => {
  mount();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  receiver.prop('removeGauge')('foo');
  await flushPromises();
  expect(removeGauge).toBeCalled();
});

it('should match snapshot', async () => {
  mount();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('gauges')).toMatchSnapshot();
});
