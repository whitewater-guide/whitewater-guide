import { RouteComponentProps } from 'react-router';
import { InjectedFormProps } from 'redux-form';
import { BannerInput, Group, Region, UploadLink } from '../../../ww-commons';

export type BannerFormProps = InjectedFormProps<BannerInput> &
  RouteComponentProps<any> &
  { groups: Group[], regions: Region[], bannerFileUpload: UploadLink };
