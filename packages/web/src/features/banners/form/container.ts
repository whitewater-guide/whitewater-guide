import { compose, mapProps } from 'recompose';
import { formContainer } from '../../../components/forms';
import { withFeatureIds } from '../../../ww-clients/core';
import { BannerInput, BannerFormStruct, BannerKind, BannerPlacement } from '../../../ww-commons';
import BANNER_FORM_QUERY from './bannerForm.query';
import deserializeBannerForm from './deserializeBannerForm';
import serializeBannerForm from './serializeBannerForm';
import { BannerFormProps } from './types';
import UPSERT_BANNER from './upsertBanner.mutation';

const NEW_BANNER: BannerInput = {
  id: null,
  slug: '',
  name: '',
  priority: 0,
  enabled: true,
  placement: BannerPlacement.MOBILE_REGION_DESCRIPTION,
  source: {
    kind: BannerKind.Image,
    ratio: null,
    src: null,
  },
  link: null,
  extras: null,
  regions: [],
  groups: [],
};

const bannerForm = formContainer({
  formName: 'banner',
  propName: 'banner',
  defaultValue: NEW_BANNER,
  query: BANNER_FORM_QUERY,
  mutation: UPSERT_BANNER,
  serializeForm: serializeBannerForm,
  deserializeForm: deserializeBannerForm,
  validationSchema: BannerFormStruct,
});

export default compose<BannerFormProps, {}>(
  withFeatureIds('banner'),
  bannerForm,
  mapProps(({ data, ...props }: any) => ({
    regions: data.regions.nodes,
    groups: data.groups.nodes,
    bannerFileUpload: data.bannerFileUpload,
    ...props,
  })),
);
