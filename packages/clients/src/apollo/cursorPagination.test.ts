import cursorPagination from './cursorPagination';

it('should merge when existing is empty', () => {
  const pagination = cursorPagination();

  const actual = pagination.merge(undefined, {
    __typename: 'DescentsConnection',
    edges: [
      {
        __typename: 'DescentEdge',
        node: { __ref: 'Descent:f579b3aa-01c0-11ec-84e3-236de75209f5' },
        cursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
      },
    ],
    pageInfo: {
      __typename: 'PageInfo',
      endCursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
      hasMore: true,
    },
  });
  const expected = {
    __typename: 'DescentsConnection',
    edges: [
      {
        __typename: 'DescentEdge',
        node: { __ref: 'Descent:f579b3aa-01c0-11ec-84e3-236de75209f5' },
        cursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
      },
    ],
    pageInfo: {
      __typename: 'PageInfo',
      endCursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
      hasMore: true,
    },
  };
  expect(actual).toEqual(expected);
});

it('should merge when existing is not empty', () => {
  const pagination = cursorPagination();

  const actual = pagination.merge(
    {
      __typename: 'DescentsConnection',
      edges: [
        {
          __typename: 'DescentEdge',
          node: { __ref: 'Descent:f579b3aa-01c0-11ec-84e3-236de75209f5' },
          cursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
        },
      ],
      pageInfo: {
        __typename: 'PageInfo',
        endCursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
        hasMore: true,
      },
    },
    {
      __typename: 'DescentsConnection',
      edges: [
        {
          __typename: 'DescentEdge',
          node: { __ref: 'Descent:508d6fb2-75fc-11eb-a74c-d39679171ef5' },
          cursor: 'djE6MTkxOjE2MTQxMDExOTc2ODA=',
        },
      ],
      pageInfo: {
        __typename: 'PageInfo',
        endCursor: 'djE6MTkxOjE2MTQxMDExOTc2ODA=',
        hasMore: true,
      },
    },
  );
  const expected = {
    __typename: 'DescentsConnection',
    edges: [
      {
        __typename: 'DescentEdge',
        node: { __ref: 'Descent:f579b3aa-01c0-11ec-84e3-236de75209f5' },
        cursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
      },
      {
        __typename: 'DescentEdge',
        node: { __ref: 'Descent:508d6fb2-75fc-11eb-a74c-d39679171ef5' },
        cursor: 'djE6MTkxOjE2MTQxMDExOTc2ODA=',
      },
    ],
    pageInfo: {
      __typename: 'PageInfo',
      endCursor: 'djE6MTkxOjE2MTQxMDExOTc2ODA=',
      hasMore: true,
    },
  };
  expect(actual).toEqual(expected);
});

it('should not duplicate', () => {
  const pagination = cursorPagination();

  const existing = {
    __typename: 'DescentsConnection',
    edges: [
      {
        __typename: 'DescentEdge',
        node: { __ref: 'Descent:f579b3aa-01c0-11ec-84e3-236de75209f5' },
        cursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
      },
    ],
    pageInfo: {
      __typename: 'PageInfo',
      endCursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
      hasMore: true,
    },
  };

  const incoming = {
    __typename: 'DescentsConnection',
    edges: [
      {
        __typename: 'DescentEdge',
        node: { __ref: 'Descent:f579b3aa-01c0-11ec-84e3-236de75209f5' },
        cursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
      },
    ],
    pageInfo: {
      __typename: 'PageInfo',
      endCursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
      hasMore: true,
    },
  };

  const actual = pagination.merge(existing, incoming);
  const expected = {
    __typename: 'DescentsConnection',
    edges: [
      {
        __typename: 'DescentEdge',
        node: { __ref: 'Descent:f579b3aa-01c0-11ec-84e3-236de75209f5' },
        cursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
      },
    ],
    pageInfo: {
      __typename: 'PageInfo',
      endCursor: 'djE6NTIxOjE2MjkzODA2NDAwMDA=',
      hasMore: true,
    },
  };
  expect(actual).toEqual(expected);
});
