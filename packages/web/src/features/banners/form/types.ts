import { RouteComponentProps } from 'react-router';
import { InjectedFormProps } from 'redux-form';
import { BannerFormInput, Group, Region, UploadLink } from '../../../ww-commons';

export type BannerFormProps = InjectedFormProps<BannerFormInput> &
  RouteComponentProps<any> &
  { groups: Group[], regions: Region[], bannerFileUpload: UploadLink };
