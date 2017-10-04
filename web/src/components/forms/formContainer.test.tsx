import { createMemoryHistory, History } from 'history';
import * as Joi from 'joi';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Router } from 'react-router';
import { ComponentEnhancer, withProps } from 'recompose';
import { combineReducers, createStore } from 'redux';
import { InjectedFormProps, reducer as formReducer } from 'redux-form';
import { mountWithMuiContext } from '../../test';
import { flushPromises } from '../../test/flushPromises';
import { Omit } from '../../ww-commons/ts';
import Loading from '../Loading';
import { formContainer, FormContainerOptions } from './formContainer';
import { validateInput } from './validateInput';

jest.mock('./validateInput', () => ({
  validateInput: jest.fn(),
}));

interface QueryResult {
  entity: {
    data: { foo: string },
    loading: boolean,
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

const options: Omit<Opts, 'queryContainer' | 'mutationContainer'> = {
  formName: 'entity',
  propName: 'entity',
  backPath: '/entities',
  validationSchema: ValidationSchema,
  serializeForm,
  deserializeForm,
};

const detailsContainer = (loading: boolean) => withProps(({ language }) => ({
  entity: {
    data: { foo: `bar_${language}` },
    loading,
  },
})) as ComponentEnhancer<QueryResult, any>;

const mutationContainer = (error: boolean) => withProps({
  mutate: error ? mutateError : mutateSuccess,
}) as ComponentEnhancer<MutationResult, any>;

class Receiver extends React.PureComponent<InjectedFormProps<any>> {

  render() {
    return (
      <form onSubmit={this.props.handleSubmit} />
    );
  }
}

const mountThings = (detailsLoading: boolean, mutationError: boolean, history?: History) => {
  const wrapper = formContainer({
    ...options,
    queryContainer: detailsContainer(detailsLoading),
    mutationContainer: mutationContainer(mutationError),
  });
  const store = createStore(combineReducers({ form: formReducer }));
  const Wrapped: React.ComponentType<any> = wrapper(Receiver);
  const router = !!history ?
    (<Router history={history}><Wrapped /></Router>) :
    (<MemoryRouter><Wrapped /></MemoryRouter>);
  return mountWithMuiContext((
    <Provider store={store}>
      {router}
    </Provider>),
  );
};

beforeEach(() => {
  serializeForm.mockClear();
  deserializeForm.mockClear();
  mutateError.mockClear();
  mutateSuccess.mockClear();
});

it('should render loading when query is loading', () => {
  const wrapped = mountThings(true, false);
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(true);
});

it('should deserialize query to form initialValues', () => {
  const wrapped = mountThings(false, false);
  const receivers = wrapped.find(Receiver);
  expect(receivers.length).toBe(1);
  const receiver = receivers.at(0);
  expect(receiver.prop('initialValues')).toEqual({ foo: 'bar_en_d' });
});

it('should use validation schema', () => {
  mountThings(false, false);
  expect(validateInput).toBeCalledWith(ValidationSchema);
});

it('should send serialized values', () => {
  const wrapped = mountThings(false, false);
  const receiver = wrapped.find(Receiver).at(0) as any;
  receiver.find('form').simulate('submit');
  expect(serializeForm).toBeCalledWith({ foo: 'bar_en_d' });
});

it('should call mutate on submit', () => {
  const wrapped = mountThings(false, false);
  const receiver = wrapped.find(Receiver).at(0) as any;
  receiver.find('form').simulate('submit');
  expect(mutateSuccess).toBeCalled();
});

it('should render loading while submitting', () => {
  const wrapped = mountThings(false, false);
  const receiver = wrapped.find(Receiver).at(0) as any;
  receiver.find('form').simulate('submit');
  expect(wrapped.containsMatchingElement(<Loading />)).toBe(true);
});

it('should navigate on successful mutation', async () => {
  const history = createMemoryHistory();
  history.replace = jest.fn();
  const wrapped = mountThings(false, false, history);
  const receiver = wrapped.find(Receiver).at(0) as any;
  await receiver.find('form').simulate('submit');
  expect(history.replace).toBeCalledWith('/entities');
});

it('should pass form error on mutation error', async () => {
  const wrapped = mountThings(false, true);
  const receiver = wrapped.find(Receiver).at(0);
  await receiver.find('form').simulate('submit');
  await flushPromises();
  const receiver2 = wrapped.find(Receiver).at(0);
  expect(receiver2.prop('error')).toBe('Some mutation error');
});

it('should receive language from query string', () => {
  const history = createMemoryHistory({ initialEntries: ['/smth?language=es'] });
  const wrapped = mountThings(false, false, history);
  const receiver = wrapped.find(Receiver).at(0);
  expect(receiver.prop('language')).toBe('es');
});

it('should reinitialize form when language changes', () => {
  const history = createMemoryHistory();
  const wrapped = mountThings(false, false, history);
  const receiver = wrapped.find(Receiver).at(0);
  expect(receiver.prop('initialValues')).toEqual({ foo: 'bar_en_d' });
  history.replace({ pathname: '/smth', search: '?language=es' });
  receiver.find('form').simulate('submit');
  expect(mutateSuccess).toBeCalledWith({
    variables: { entity: { foo: 'bar_es_d_s' }, language: 'es' },
  });
});
