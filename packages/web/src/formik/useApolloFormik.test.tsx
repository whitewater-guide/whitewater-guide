import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';

import { useApolloFormik } from './useApolloFormik';

const mockHistory = createMemoryHistory();

const helpers: any = {
  setStatus: jest.fn(),
  setErrors: jest.fn(),
  setSubmitting: jest.fn(),
  setTouched: jest.fn(),
  setValues: jest.fn(),
  setFieldValue: jest.fn(),
  setFieldError: jest.fn(),
  setFieldTouched: jest.fn(),
  validateForm: jest.fn(),
  validateField: jest.fn(),
  resetForm: jest.fn(),
  setFormikState: jest.fn(),
};

interface Entity {
  q: string;
}

interface EntityInput {
  m: string;
}

const QUERY = gql`
  query getEntity {
    entity {
      q
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/ban-types
interface QResult {
  entity: Entity;
}

const MUTATION = gql`
  mutation upsertEntity($value: EntityInput) {
    upsertEntity(value: $value) {
      q
    }
  }
`;

const querySuccess: MockedResponse = {
  request: {
    query: QUERY,
  },
  result: {
    data: {
      entity: {
        __typename: 'Entity',
        q: 'query_result',
      },
    },
  },
};

const queryNotFound: MockedResponse = {
  request: {
    query: QUERY,
  },
  result: {
    data: {
      entity: null,
    },
  },
};
const mutationSuccess: MockedResponse = {
  request: {
    query: MUTATION,
    variables: {
      value: { m: 'input_mutated' },
    },
  },
  result: {
    data: {
      upsertEntity: {
        __typename: 'Entity',
        q: 'mutation_result',
      },
    },
  },
};

const mutationValidationError: MockedResponse = {
  request: {
    query: MUTATION,
    variables: {
      value: { m: 'input_mutated' },
    },
  },
  result: {
    errors: [
      new GraphQLError(
        'error',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        {
          code: ApolloErrorCodes.BAD_USER_INPUT,
          exception: {
            validationErrors: {
              value: { m: 'field_error' },
            },
          },
        },
      ),
    ],
  },
};

interface FData {
  f: string;
}

interface MVars {
  value: EntityInput;
}

interface MResult {
  upsertEntity: Entity;
}

interface TestOptions {
  mocks: ReadonlyArray<MockedResponse>;
  onSuccess?: string | null | ((result?: MResult) => void);
}

const renderWrapper = (options: TestOptions) => {
  const { mocks, onSuccess } = options;
  const wrapper: React.FC = ({ children }: any) => (
    <Router history={mockHistory}>
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    </Router>
  );
  return renderHook(
    () =>
      useApolloFormik<{}, QResult, FData, MVars, MResult>({
        query: QUERY,
        queryToForm: (result?: QResult) => {
          if (!result || !result.entity) {
            return {
              f: 'default',
            };
          }
          return { f: `${result.entity.q}_form` };
        },
        mutation: MUTATION,
        formToMutation: (data: FData) => ({
          value: { m: `${data.f}_mutated` },
        }),
        onSuccess,
      }),
    { wrapper },
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('should start in loading state', () => {
  const { result } = renderWrapper({
    mocks: [querySuccess, mutationSuccess],
  });
  expect(result.current.loading).toBe(true);
  expect(result.current.initialValues).toBeNull();
});

it('should provide initial values', async () => {
  const { result, waitForNextUpdate } = renderWrapper({
    mocks: [querySuccess, mutationSuccess],
  });
  await waitForNextUpdate();
  expect(result.current.loading).toBe(false);
  expect(result.current.initialValues).toEqual({ f: 'query_result_form' });
});

it('should provide default value when query returns null', async () => {
  const { result, waitForNextUpdate } = renderWrapper({
    mocks: [queryNotFound, mutationSuccess],
  });
  await waitForNextUpdate();
  expect(result.current.loading).toBe(false);
  expect(result.current.initialValues).toEqual({ f: 'default' });
});

describe('submit success', () => {
  describe('explicit submit callback', () => {
    const onSuccess = jest.fn();
    let wait: any;

    beforeEach(async () => {
      const rendered = renderWrapper({
        mocks: [queryNotFound, mutationSuccess],
        onSuccess,
      });
      wait = rendered.waitFor;
      act(() => {
        rendered.result.current.onSubmit({ f: 'input' }, helpers);
      });
    });

    it('should mutate on submit', async () => {
      await wait(() => {
        expect(onSuccess).toHaveBeenCalledWith({
          upsertEntity: {
            __typename: 'Entity',
            q: 'mutation_result',
          },
        });
      });
    });

    it('should set form status', async () => {
      await wait(() => {
        expect(helpers.setStatus).toHaveBeenCalledWith({ success: true });
      });
    });

    it('should finish submitting', async () => {
      await wait(() => {
        expect(helpers.setSubmitting).toHaveBeenCalledWith(false);
      });
    });
  });

  it('should go back', async () => {
    const goBack = jest.spyOn(mockHistory, 'goBack');
    const { result, waitFor } = renderWrapper({
      mocks: [queryNotFound, mutationSuccess],
    });
    act(() => {
      result.current.onSubmit({ f: 'input' }, helpers);
    });
    await waitFor(() => {
      expect(goBack).toHaveBeenCalled();
    });
  });

  it('should navigate', async () => {
    const replace = jest.spyOn(mockHistory, 'replace');
    const { result, waitFor } = renderWrapper({
      mocks: [queryNotFound, mutationSuccess],
      onSuccess: 'hell',
    });
    act(() => {
      result.current.onSubmit({ f: 'input' }, helpers);
    });
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('hell');
    });
  });
});

describe('submit error', () => {
  it('should set graphql form error', async () => {
    const { result, waitFor } = renderWrapper({
      mocks: [queryNotFound, mutationSuccess],
    });
    act(() => {
      result.current.onSubmit({ f: 'mocked_provider_muss' }, helpers);
    });
    await waitFor(() => {
      expect(helpers.setSubmitting).toHaveBeenCalledWith(false);
      expect(helpers.setErrors).toHaveBeenCalledWith({});
      expect(helpers.setStatus).toHaveBeenCalledWith({
        success: false,
        error: expect.any(Error),
      });
    });
  });

  it('should set form validation errors', async () => {
    const { result, waitFor } = renderWrapper({
      mocks: [queryNotFound, mutationValidationError],
    });
    act(() => {
      result.current.onSubmit({ f: 'input' }, helpers);
    });
    await waitFor(() => {
      expect(helpers.setErrors).toHaveBeenCalledWith({ m: 'field_error' });
      expect(helpers.setSubmitting).toHaveBeenCalledWith(false);
      expect(helpers.setStatus).toHaveBeenLastCalledWith({
        success: false,
      });
    });
  });
});
