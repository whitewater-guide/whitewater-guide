import gql from 'graphql-tag';

const Core = gql`
  fragment SuggestionCore on Suggestion {
    id
    description
    copyright
    resolution
    image
    section {
      id
      name
      river {
        id
        name
      }
      region {
        id
        name
      }
    }
  }
`;

const Meta = gql`
  fragment SuggestionMeta on Suggestion {
    createdAt
    createdBy {
      id
      name
    }
    status
    resolvedBy {
      id
      name
    }
    resolvedAt
  }
`;

export const SuggestionFragments = {
  Core,
  Meta,
};
