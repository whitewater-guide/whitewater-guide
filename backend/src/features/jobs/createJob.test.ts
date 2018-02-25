import { getWorkerArgs } from './createJob';

it('should handle all-at-once worker', () => {
  expect(getWorkerArgs()).toEqual(['harvest']);
});

it('should handle simple gauge', () => {
  expect(getWorkerArgs({ code: 'ggg' })).toEqual(['harvest', '--code', 'ggg']);
});

it('should handle gauge with request params', () => {
  expect(getWorkerArgs({ code: 'ggg', request_params: { version: 1 } })).toEqual([
    'harvest', '--code', 'ggg', '--version', '1',
  ]);
});
