import { gql, graphql } from 'react-apollo';
import { filter } from 'graphql-anywhere';

const allTags = gql`
  query allTags {
    supplyTags {
      _id
      name
    }
    kayakingTags {
      _id
      name
    }
    hazardsTags {
      _id
      name
    }
    miscTags {
      _id
      name
    }
  }
`;

export const withTags = graphql(
  allTags,
  {
    props: ({ data: { loading, ...data } }) => {
      return { ...filter(allTags, data), tagsLoading: loading };
    },
  },
);
