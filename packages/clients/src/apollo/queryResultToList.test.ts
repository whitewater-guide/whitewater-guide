import { queryResultToList } from './queryResultToList';

interface Foo {
  id: string;
  name: string;
}

it('should convert graphql result to prop consumed by react components', () => {
  const refetch = jest.fn();
  const result = queryResultToList<Foo, 'regions'>(
    {
      data: {
        regions: {
          nodes: [{ id: '1', name: 'foo' }, { id: '2', name: 'bar' }],
          count: 2,
        },
        error: null,
        loading: false,
        refetch,
      },
    },
    'regions',
  );
  expect(result).toMatchObject({
    regions: {
      nodes: [{ id: '1', name: 'foo' }, { id: '2', name: 'bar' }],
      count: 2,
      error: null,
      loading: false,
      refetch,
    },
  });
});
