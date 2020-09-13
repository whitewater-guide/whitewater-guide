import { MediaInput } from '@whitewater-guide/commons';
import React, { useMemo } from 'react';
import { RouteComponentProps } from 'react-router';

import { useApolloFormik } from '../../../formik';
import makeFormToMutation from './makeFormToMutation';
import makeQueryToForm from './makeQueryToForm';
import { MEDIA_FORM_QUERY, QResult, QVars } from './mediaForm.query';
import MediaFormDialog from './MediaFormDialog';
import { RouterParams } from './types';
import { MVars, UPSERT_MEDIA } from './upsertMedia.mutation';

type Props = RouteComponentProps<RouterParams>;

const MediaForm: React.FC<Props> = React.memo((props) => {
  const transformers = useMemo(
    () => ({
      queryToForm: makeQueryToForm(props),
      formToMutation: makeFormToMutation(props),
    }),
    [props],
  );

  const formik = useApolloFormik<QVars, QResult, MediaInput, MVars>({
    query: MEDIA_FORM_QUERY,
    queryOptions: {
      variables: { mediaId: props.match.params.mediaId },
    },
    mutation: UPSERT_MEDIA,
    mutationOptions: {
      refetchQueries: ['sectionMedia'],
    },
    ...transformers,
  });

  return <MediaFormDialog {...formik} />;
});

MediaForm.displayName = 'MediaForm';

export default MediaForm;
