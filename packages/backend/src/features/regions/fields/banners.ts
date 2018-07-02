import get from 'lodash/get';
import { FieldResolvers } from '../../../apollo';
import { RegionBanners } from '../../../ww-commons';

export const bannersResolvers: FieldResolvers<any, RegionBanners> = {
  sectionDescriptionMobile: (bannersRaw) => get(bannersRaw, 'sectionDescriptionMobile', null),
  sectionRowMobile: (bannersRaw) => get(bannersRaw, 'sectionRowMobile', null),
  sectionMediaMobile: (bannersRaw) => get(bannersRaw, 'sectionMediaMobile', null),
  regionDescriptionMobile: (bannersRaw) => get(bannersRaw, 'regionDescriptionMobile', null),
  regionLoadingMobile: (bannersRaw) => get(bannersRaw, 'regionLoadingMobile', null),
};
