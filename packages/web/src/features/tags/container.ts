import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withLoading } from '../../components';
import { withTags } from '../../ww-clients/features/tags';
import { TagInput, WithTags } from '../../ww-commons';
import { REMOVE_TAG } from './removeTag.mutation';
import { TagsFormProps } from './types';
import { UPSERT_TAG } from './upsertTag.mutation';

export default compose<TagsFormProps, any>(
  withRouter,
  withTags(false),
  withLoading<WithTags>(props => props.tagsLoading),
  graphql(
    UPSERT_TAG,
    {
      alias: 'UpsertTagMutation',
      props: ({ mutate }) => ({
        upsertTag: (tag: TagInput) => mutate!({
          variables: { tag },
          refetchQueries: ['listTags'],
        }),
      }),
    },
  ),
  graphql(
    REMOVE_TAG,
    {
      alias: 'RemoveTagMutation',
      props: ({ mutate }) => ({
        removeTag: (id: string) => mutate!({
          variables: { id },
          refetchQueries: ['listTags'],
        }),
      }),
    },
  ),
);
