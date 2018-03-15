import { ChildProps } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { InjectedFormProps } from 'redux-form';
import { Media, MediaInput, UploadLink } from '../../../ww-commons';

export interface MediaFormQueryResult {
  media: Media;
  mediaForm: {
    id: string;
    upload: UploadLink;
  };
}
export type MediaFormInput = MediaInput;
export type MediaFormProps =
  InjectedFormProps<MediaFormInput> &
  RouteComponentProps<{regionId: string, sectionId: string}> &
  ChildProps<{}, MediaFormQueryResult>;
