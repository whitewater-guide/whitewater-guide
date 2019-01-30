import { omitTypename } from './omitTypename';

it.each([
  ['null', null],
  ['undefined', undefined],
  ['string', 'string'],
  ['number', 111],
  ['boolean', true],
])('should handle primitive: %s', (_, value) => {
  expect(omitTypename(value)).toBe(value);
});

it('should omit __typename', () => {
  expect(
    omitTypename({
      __typename: 'Top',
      foo: 'bar',
      children: {
        __typename: 'Middle',
        nodes: [
          {
            __typename: 'Bottom',
            bar: 1,
          },
          {
            __typename: 'Bottom',
            bar: 2,
          },
        ],
      },
    }),
  ).toEqual({
    foo: 'bar',
    children: {
      nodes: [
        {
          bar: 1,
        },
        {
          bar: 2,
        },
      ],
    },
  });
});
