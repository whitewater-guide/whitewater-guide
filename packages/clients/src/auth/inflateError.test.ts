import { inflateError } from './inflateError';

it('should handle undefined', () => {
  expect(inflateError()).toBeUndefined();
});

it('should handle too short', () => {
  expect(inflateError('not_found')).toBeUndefined();
});

it('should handle shallow', () => {
  expect(inflateError('jwt.expired')).toEqual({ jwt: 'expired' });
});

it('should handle deep', () => {
  expect(inflateError('signin.errors.email.not_found')).toEqual({
    email: 'not_found',
  });
});
