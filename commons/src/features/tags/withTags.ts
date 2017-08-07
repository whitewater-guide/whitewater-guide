import { gql, graphql } from 'react-apollo';
import { ComponentDecorator } from 'react-apollo/types';
import { WithTags } from './types';

const allTags = gql`
  query allTags($withSlugs:Boolean!) {
    supplyTags {
      _id
      name
      slug @include(if: $withSlugs)
    }
    kayakingTags {
      _id
      name
      slug @include(if: $withSlugs)
    }
    hazardsTags {
      _id
      name
      slug @include(if: $withSlugs)
    }
    miscTags {
      _id
      name
      slug @include(if: $withSlugs)
    }
  }
`;

export interface WithTagsChildProps extends WithTags {
  tagsLoading: boolean;
}

export const withTags = (withSlugs = false) => graphql<WithTags, any, WithTagsChildProps>(
  allTags,
  {
    options: {
      // TODO: replace reducer with update
      // reducer,
      variables: { withSlugs },
    },
    props: ({ data }) => {
      const { loading, ...tags } = data!;
      return { ...tags, tagsLoading: loading };
    },
  },
);

// Workaround to make TS emit declarations, see https://github.com/Microsoft/TypeScript/issues/9944
let a: ComponentDecorator<any, any>;
