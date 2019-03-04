import {
  BannerFormInput,
  Group,
  Region,
  UploadLink,
} from '@whitewater-guide/commons';
import { RouteComponentProps } from 'react-router';
import { InjectedFormProps } from 'redux-form';

export type BannerFormProps = InjectedFormProps<BannerFormInput> &
  RouteComponentProps<any> & {
    groups: Group[];
    regions: Region[];
    uploadLink: UploadLink;
  };
