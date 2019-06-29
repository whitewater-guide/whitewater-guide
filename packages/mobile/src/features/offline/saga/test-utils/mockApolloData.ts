import { MockList } from 'graphql-tools';

export const mockApolloData = {
  mocks: {
    SectionsList: () => ({
      nodes: () => new MockList(2),
      count: () => 6,
    }),
    SectionMediaConnection: () => ({
      nodes: () => new MockList(2),
      count: () => 2,
    }),
  },
};
