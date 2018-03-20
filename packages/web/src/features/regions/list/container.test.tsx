import casual from 'casual';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { Loading } from '../../../components';
import { FormReceiver, mountForm } from '../../../test';
import { flushPromises } from '../../../ww-clients/test';
import container from './container';
import { RegionsListProps } from './types';

let wrapped: ReactWrapper;
let receiver: ReactWrapper<RegionsListProps>;

beforeEach(async () => {
  casual.seed(1);
});

afterEach(() => {
  wrapped.unmount();
});

const removeRegion = jest.fn(() => 'deleted');

const mount = () => {
  wrapped = mountForm({ form: container, mockApollo: true, mutations: { removeRegion } });
};

it('should have loading state', async () => {
  mount();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(true);
  await flushPromises();
  wrapped.update();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(false);
});

it('should delete region', async () => {
  mount();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  receiver.prop('removeRegion')('foo');
  await flushPromises();
  expect(removeRegion).toBeCalled();
});

it('should match snapshot', async () => {
  mount();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.props()).toMatchSnapshot();
});
