import { act, renderHook } from '@testing-library/react-hooks';
import type { AuthResponse } from '@whitewater-guide/clients';
import type { FormikHelpers } from 'formik';

import type { UseAuthSubmit } from './useAuthSubmit';
import { useAuthSubmit } from './useAuthSubmit';

const TEST_PREFIX = '__prefix__';
const apiCall = jest.fn();
const onSuccess = jest.fn();
const formikHelpers: FormikHelpers<unknown> = {
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
  submitForm: jest.fn(),
  setFormikState: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('success', () => {
  const success: AuthResponse = {
    success: true,
    status: 200,
  };
  let result: UseAuthSubmit<unknown>;

  beforeEach(async () => {
    apiCall.mockResolvedValue(success);
    const rendered = renderHook(() =>
      useAuthSubmit<unknown>(TEST_PREFIX, apiCall, onSuccess),
    );
    const [submit] = rendered.result.current;
    await act(() => submit({}, formikHelpers) as Promise<void>);
    result = rendered.result.current;
  });

  it('should succeed', () => {
    expect(result[1]).toBe(true);
    expect(onSuccess).toHaveBeenCalledWith(success);
  });

  it('should call api', () => {
    expect(apiCall).toHaveBeenCalledWith({});
  });

  it('should set submitting', () => {
    expect(formikHelpers.setSubmitting).toHaveBeenCalledWith(false);
  });

  it('should not set error', () => {
    expect(formikHelpers.setErrors).not.toHaveBeenCalled();
  });
});

describe('error', () => {
  const error: AuthResponse = {
    success: false,
    status: 400,
    error: {
      form: 'fail',
    },
  };
  let result: UseAuthSubmit<unknown>;

  beforeEach(async () => {
    apiCall.mockResolvedValue(error);
    const rendered = renderHook(() =>
      useAuthSubmit<unknown>(TEST_PREFIX, apiCall, onSuccess),
    );
    const [submit] = rendered.result.current;
    await act(() => submit({}, formikHelpers) as Promise<void>);
    result = rendered.result.current;
  });

  it('should not succeed', () => {
    expect(result[1]).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should call api', () => {
    expect(apiCall).toHaveBeenCalledWith({});
  });

  it('should set submitting', () => {
    expect(formikHelpers.setSubmitting).toHaveBeenCalledWith(false);
  });

  it('should set error', () => {
    expect(formikHelpers.setErrors).toHaveBeenCalledWith({
      form: `${TEST_PREFIX}form.fail`,
    });
  });
});
