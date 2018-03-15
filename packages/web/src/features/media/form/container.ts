import * as qs from 'qs';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { compose } from 'recompose';
import { deserializeForm, formContainer, serializeForm } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core';
import { MediaInputSchema, MediaKind } from '../../../ww-commons';
import MEDIA_FORM_QUERY from './mediaForm.query';
import { MediaFormInput, MediaFormProps, MediaFormQueryResult } from './types';
import UPSERT_MEDIA from './upsertMedia.mutation';

type DefaultValueProps =
  ChildProps<{}, MediaFormQueryResult> &
  RouteComponentProps<{sectionId: string, regionId: string}>;

const mediaForm = formContainer({
  formName: 'media',
  propName: 'media',
  backPath: 'media',
  defaultValue: (props: DefaultValueProps): MediaFormInput => ({
    id: props.data!.mediaForm!.id,
    description: null,
    copyright: null,
    url: '',
    kind: qs.parse(props.location.search.substr(1)).kind || MediaKind.photo,
    resolution: null,
    weight: null,
  }),
  query: MEDIA_FORM_QUERY,
  mutation: UPSERT_MEDIA,
  serializeForm: serializeForm(),
  deserializeForm: deserializeForm(),
  validationSchema: MediaInputSchema,
  extraVariables: (props: DefaultValueProps) => ({ sectionId: props.match.params.sectionId }),
});

export default compose<MediaFormProps, {}>(
  withFeatureIds(['section', 'media']),
  mediaForm,
);
