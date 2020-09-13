import { renderHook } from '@testing-library/react-hooks';

import { useOnceTruthy } from './useOnceTruthy';

it('should work with initial falsy condition', () => {
  const spy = jest.fn();
  const { rerender } = renderHook(
    ({ condition }) => useOnceTruthy(spy, condition),
    { initialProps: { condition: false } },
  );
  expect(spy).not.toHaveBeenCalled();
  rerender({ condition: true });
  expect(spy).toHaveBeenCalledTimes(1);
  rerender({ condition: false });
  rerender({ condition: true });
  expect(spy).toHaveBeenCalledTimes(1);
});

it('should work with initial truthy condition', () => {
  const spy = jest.fn();
  const { rerender } = renderHook(
    ({ condition }) => useOnceTruthy(spy, condition),
    { initialProps: { condition: true } },
  );
  expect(spy).toHaveBeenCalledTimes(1);
  rerender({ condition: false });
  rerender({ condition: true });
  rerender({ condition: false });
  expect(spy).toHaveBeenCalledTimes(1);
});
