import { arrayToDMSString } from '../GeoUtils';

test('arrayToDMSString should work', () => {
  expect(arrayToDMSString([-122.902336, 46.9845854])).toBe('46°59′4″ N, 122°54′8″ W');
});
