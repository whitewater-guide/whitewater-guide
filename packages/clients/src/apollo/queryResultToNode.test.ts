import { queryResultToNode } from './queryResultToNode';

interface Foo {
  id: string;
  name: string;
  bar: string;
}

it('should convert graphql query response to prop consumed by react components', () => {
  const refetch = jest.fn();
  const result = queryResultToNode<Foo, 'region'>(
    {
      data: {
        region: { id: '1', name: 'name', bar: 'bar' },
        loading: false,
        error: null,
        refetch,
      },
    },
    'region',
  );
  expect(result).toMatchObject({
    region: {
      node: { id: '1', name: 'name', bar: 'bar' },
      loading: false,
      error: null,
      refetch,
    },
  });
});
