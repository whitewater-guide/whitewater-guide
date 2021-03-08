import { renderHook } from '@testing-library/react-hooks';

import useLastNotNull from './useLastNotNull';

it('should return last not null value', () => {
  const { result, rerender } = renderHook<
    { value: string | null },
    string | null
  >(({ value }) => useLastNotNull(value), { initialProps: { value: 'foo' } });
  expect(result.current).toBe('foo');
  rerender({ value: null });
  expect(result.current).toBe('foo');
  rerender({ value: 'bar' });
  expect(result.current).toBe('bar');
});
