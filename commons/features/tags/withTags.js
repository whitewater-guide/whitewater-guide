import { gql, graphql } from 'react-apollo';
import { filter } from 'graphql-anywhere';
import reducer from './tagsListReducer';

const allTags = gql`
  query allTags {
    supplyTags {
      _id
      name
      slug
    }
    kayakingTags {
      _id
      name
      slug
    }
    hazardsTags {
      _id
      name
      slug
    }
    miscTags {
      _id
      name
      slug
    }
  }
`;

export const withTags = graphql(
  allTags,
  {
    options: {
      reducer,
    },
    props: ({ data: { loading, ...data } }) => {
      return { ...filter(allTags, data), tagsLoading: loading };
    },
  },
);
