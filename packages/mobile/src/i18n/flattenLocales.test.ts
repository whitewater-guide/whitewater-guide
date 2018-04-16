import flattenLocales from './flattenLocales';

it('one-level', () => {
  const obj = { foo: 'bar', 'sunn-o': 'ooo' };
  expect(flattenLocales(obj)).toEqual(obj);
});

it('deep', () => {
  const input = {
    foo: 'bar',
    some: {
      deep: {
        bar: 'baz',
        drink: {
          'some-whiskey': 'ho!',
        },
      },
      property: 'true',
    },
  };
  const expected = {
    foo: 'bar',
    'some.deep.bar': 'baz',
    'some.deep.drink.some-whiskey': 'ho!',
    'some.property': 'true',
  };
  expect(flattenLocales(input)).toEqual(expected);
});
