import { flushPromises } from '@whitewater-guide/clients';
import casual from 'casual';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { Loading } from '../../../components';
import { FormReceiver, mountForm } from '../../../test';
import container from './container';
import { SourceListProps } from './types';

let wrapped: ReactWrapper;
let receiver: ReactWrapper<SourceListProps>;

beforeEach(async () => {
  casual.seed(1);
});

afterEach(() => {
  wrapped.unmount();
});

const removeSource = jest.fn(() => 'deleted');

const mount = () => {
  wrapped = mountForm({
    form: container,
    mockApollo: true,
    mutations: { removeSource },
  });
};

it('should have loading state', async () => {
  mount();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(true);
  await flushPromises();
  wrapped.update();
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(false);
});

it('should delete source', async () => {
  mount();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  receiver.prop('removeSource')('foo');
  await flushPromises();
  expect(removeSource).toBeCalled();
});

it('should match snapshot', async () => {
  mount();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.props()).toMatchSnapshot();
});
