import { withFeatureIds } from '@whitewater-guide/clients';
import { MediaInputStruct, MediaKind } from '@whitewater-guide/commons';
import qs from 'qs';
import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { compose } from 'recompose';
import {
  deserializeForm,
  formContainer,
  serializeForm,
} from '../../../components/forms';
import { THUMB_HEIGHT } from '../list/constants';
import SECTIONS_MEDIA from '../list/sectionsMedia.query';
import MEDIA_FORM_QUERY from './mediaForm.query';
import { MediaFormInput, MediaFormProps, MediaFormQueryResult } from './types';
import UPSERT_MEDIA from './upsertMedia.mutation';

type DefaultValueProps = ChildProps<{}, MediaFormQueryResult> &
  RouteComponentProps<{ sectionId: string; regionId: string }>;

const mediaForm = formContainer({
  formName: 'media',
  propName: 'media',
  backPath: 'media',
  defaultValue: (props: DefaultValueProps): MediaFormInput => ({
    id: null,
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
  validationSchema: MediaInputStruct,
  extraVariables: (props: DefaultValueProps) => ({
    sectionId: props.match.params.sectionId,
  }),
  mutationOptions: (props: DefaultValueProps) => ({
    refetchQueries: [
      {
        query: SECTIONS_MEDIA,
        variables: {
          sectionId: props.match.params.sectionId,
          thumbHeight: THUMB_HEIGHT,
        },
      },
    ],
  }),
});

export default compose<MediaFormProps, {}>(
  withFeatureIds(['section', 'media']),
  mediaForm,
);
