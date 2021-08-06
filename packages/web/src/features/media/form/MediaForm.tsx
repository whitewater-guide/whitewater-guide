import { MediaInput } from '@whitewater-guide/schema';
import React, { useMemo } from 'react';
import { RouteComponentProps } from 'react-router';

import { useApolloFormik } from '../../../formik';
import makeFormToMutation from './makeFormToMutation';
import makeQueryToForm from './makeQueryToForm';
import {
  MediaFormDocument,
  MediaFormQuery,
  MediaFormQueryVariables,
} from './mediaForm.generated';
import MediaFormDialog from './MediaFormDialog';
import { RouterParams } from './types';
import {
  UpsertMediaDocument,
  UpsertMediaMutationVariables,
} from './upsertMedia.generated';

type Props = RouteComponentProps<RouterParams>;

const MediaForm = React.memo<Props>((props) => {
  const transformers = useMemo(
    () => ({
      queryToForm: makeQueryToForm(props),
      formToMutation: makeFormToMutation(props),
    }),
    [props],
  );

  const formik = useApolloFormik<
    MediaFormQueryVariables,
    MediaFormQuery,
    MediaInput,
    UpsertMediaMutationVariables
  >({
    query: MediaFormDocument,
    queryOptions: {
      variables: { mediaId: props.match.params.mediaId },
    },
    mutation: UpsertMediaDocument,
    mutationOptions: {
      refetchQueries: ['sectionMedia'],
    },
    ...transformers,
  });

  return <MediaFormDialog {...formik} />;
});

MediaForm.displayName = 'MediaForm';

export default MediaForm;
