import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';

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
    hazardTags {
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
    props: ({data: {loading, ...data}}) => {
      return {...filter(allTags, data), tagsLoading: loading};
    },
  },
);