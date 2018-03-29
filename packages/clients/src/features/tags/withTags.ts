import { graphql } from 'react-apollo';
import { Tag, WithTags } from '../../../ww-commons';
import { LIST_TAGS } from './listTags.query';

interface Result {
  tags: Tag[];
}

export const withTags = (cached = true) => graphql<any, Result, any, WithTags>(
  LIST_TAGS,
  {
    options: {
      fetchPolicy: cached ? 'cache-first' : 'network-only',
    },
    props: ({ data }) => {
      const { loading, tags } = data!;
      return { tags: tags!, tagsLoading: loading };
    },
  },
);
