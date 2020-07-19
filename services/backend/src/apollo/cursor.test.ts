import { decodeCursor, encodeCursor } from './cursor';

it('should encode and decode', () => {
  const cursor = encodeCursor({ ordId: 1234, value: 'foo' });
  const decoded = decodeCursor(cursor);
  expect(decoded).toEqual({ ordId: 1234, value: 'foo' });
});

it('should throw for bad cursor', () => {
  expect(() => decodeCursor('rubbish')).toThrow();
});

it('should return undefined for undefined cursor', () => {
  expect(decodeCursor()).toBeUndefined();
});
