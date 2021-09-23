import nodesPagination from './nodesPagination';

it('should merge', () => {
  const pagination = nodesPagination();
  const actual = pagination.merge?.(
    {
      __typename: 'SectionsList',
      count: 3,
      nodes: [{ __ref: 'Section:Section.id.1' }],
    },
    {
      __typename: 'SectionsList',
      nodes: [{ __ref: 'Section:Section.id.2' }],
      count: 3,
    },
  );
  const expected = {
    __typename: 'SectionsList',
    nodes: [
      { __ref: 'Section:Section.id.1' },
      { __ref: 'Section:Section.id.2' },
    ],
    count: 3,
  };
  expect(actual).toEqual(expected);
});
