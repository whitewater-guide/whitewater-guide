import gql from 'graphql-tag';
import { createMemoryHistory, History } from 'history';
import * as Joi from 'joi';
import * as React from 'react';
import { ChildProps, graphql } from 'react-apollo';
import { ComponentEnhancer, withProps } from 'recompose';
import { FormReceiver, mountForm } from '../../test';
import { flushPromises } from '../../ww-clients/test';
import { Loading } from '../Loading';
import { formContainer, FormContainerOptions } from './formContainer';
import { validateInput } from './validateInput';

function mockReactApollo() {
  const original = require.requireActual('react-apollo');
  return {
    ...original,
    graphql: jest.fn(),
  };
}

jest.mock('react-apollo', () => mockReactApollo());

jest.mock('./validateInput', () => ({
  validateInput: jest.fn(),
}));

interface QueryResult {
  entity: {
    foo: string;
  };
}

interface MutationResult {
  upsertEntity: {
    foo: string;
  };
}

interface FormInput {
  foo: string;
}

const ValidationSchema = Joi.object().keys({ foo: Joi.string() });

type Opts = FormContainerOptions<QueryResult, MutationResult, FormInput>;

const serializeForm = jest.fn((o: any) => ({ foo: `${o.foo}_s` }));
const deserializeForm = jest.fn((o: any) => ({ foo: `${o.foo}_d` }));
const mutateError = jest.fn((data: any) => Promise.reject({ message: 'Some mutation error' }));
const mutateSuccess = jest.fn((data: any) => Promise.resolve(data));

const options: Opts = {
  formName: 'entity',
  propName: 'entity',
  query: gql`
    query getEntity {
      entity {
        foo
      }
    }
  `,
  mutation: gql`
    mutation upsertEntity($value: EntityInput) {
      upsertEntity(value: $value) {
        foo
      }
    }
  `,
  defaultValue: {
    foo: 'default_foo',
  },
  backPath: 'entities',
  validationSchema: ValidationSchema,
  serializeForm,
  deserializeForm,
};

const detailsContainer = (loading: boolean, nullResult = false) => withProps(({ language }) => ({
  data: {
    entity: nullResult ? null : { foo: `bar_${language}` },
    loading,
  },
})) as ComponentEnhancer<ChildProps<QueryResult, any>, any>;

const mutationContainer = (error: boolean) => withProps({
  mutate: error ? mutateError : mutateSuccess,
}) as ComponentEnhancer<MutationResult, any>;

const mountThings = (detailsLoading: boolean, mutationError: boolean, nullResult: boolean, history?: History) => {
  (graphql as jest.Mock)
    .mockReturnValueOnce(detailsContainer(detailsLoading, nullResult))
    .mockReturnValueOnce(mutationContainer(mutationError));
  const form = formContainer(options);
  return mountForm({ form, history });
};

beforeEach(() => {
  (graphql as jest.Mock).mockClear();
  serializeForm.mockClear();
  deserializeForm.mockClear();
  mutateError.mockClear();
  mutateSuccess.mockClear();
});

it('should render loading when query is loading', () => {
  const wrapped = mountThings(true, false, false);
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(true);
});

it('should deserialize query to form initialValues', () => {
  const wrapped = mountThings(false, false, false);
  const receiver = wrapped.find(FormReceiver).first();
  expect(receiver.prop('initialValues')).toEqual({ foo: 'bar_en_d' });
});

it('should use default value when query returns null', () => {
  const wrapped = mountThings(false, false, true);
  const receiver = wrapped.find(FormReceiver).first();
  expect(receiver.prop('initialValues')).toEqual({ foo: 'default_foo_d' });
});

it('should use validation schema', () => {
  mountThings(false, false, false);
  expect(validateInput).toBeCalledWith(ValidationSchema);
});

it('should send serialized values', () => {
  const wrapped = mountThings(false, false, false);
  const receiver = wrapped.find(FormReceiver).first();
  receiver.find('form').simulate('submit');
  expect(serializeForm).toBeCalledWith({ foo: 'bar_en_d' });
});

it('should call mutate on submit', () => {
  const wrapped = mountThings(false, false, false);
  const receiver = wrapped.find(FormReceiver).first();
  receiver.find('form').simulate('submit');
  expect(mutateSuccess).toBeCalled();
});

it('should render loading while submitting', () => {
  const wrapped = mountThings(false, false, false);
  const receiver = wrapped.find(FormReceiver).first();
  receiver.find('form').simulate('submit');
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(true);
});

it('should navigate on successful mutation', async () => {
  const history = createMemoryHistory();
  history.replace = jest.fn();
  const wrapped = mountThings(false, false, false, history);
  const receiver = wrapped.find(FormReceiver).first();
  await receiver.find('form').simulate('submit');
  expect(history.replace).toBeCalledWith('/entities');
});

it('should navigate on successful without explicit backPath', async () => {
  const history = createMemoryHistory({ initialEntries: ['/foos/123/entitys/456/settings'] });
  history.replace = jest.fn();
  (graphql as jest.Mock)
    .mockReturnValueOnce(detailsContainer(false, false))
    .mockReturnValueOnce(mutationContainer(false));
  const form = formContainer({ ...options, backPath: undefined });
  const wrapped = mountForm({ form, history });
  const receiver = wrapped.find(FormReceiver).first();
  await receiver.find('form').simulate('submit');
  expect(history.replace).toBeCalledWith('/foos/123/entitys');
});

it('should pass form error on mutation error', async () => {
  const wrapped = mountThings(false, true, false);
  let receiver = wrapped.find(FormReceiver).first();
  await receiver.find('form').simulate('submit');
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first();
  expect(receiver.prop('error')).toBe('Some mutation error');
});

it('should receive language from query string', () => {
  const history = createMemoryHistory({ initialEntries: ['/smth?language=es'] });
  const wrapped = mountThings(false, false, false, history);
  const receiver = wrapped.find(FormReceiver).first();
  expect(receiver.prop('language')).toBe('es');
});

it('should reinitialize form when language changes', () => {
  const history = createMemoryHistory();
  const wrapped = mountThings(false, false, false, history);
  const receiver = wrapped.find(FormReceiver).first();
  expect(receiver.prop('initialValues')).toEqual({ foo: 'bar_en_d' });
  history.replace({ pathname: '/smth', search: '?language=es' });
  receiver.find('form').simulate('submit');
  expect(mutateSuccess).toBeCalledWith({
    variables: { entity: { foo: 'bar_es_d_s' }, language: 'es' },
  });
});
