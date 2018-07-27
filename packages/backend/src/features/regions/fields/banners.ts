import { FieldResolvers } from '@apollo';
import { RegionBanners } from '@ww-commons';
import get from 'lodash/get';

export const bannersResolvers: FieldResolvers<any, RegionBanners> = {
  sectionDescriptionMobile: (bannersRaw) => get(bannersRaw, 'sectionDescriptionMobile', null),
  sectionRowMobile: (bannersRaw) => get(bannersRaw, 'sectionRowMobile', null),
  sectionMediaMobile: (bannersRaw) => get(bannersRaw, 'sectionMediaMobile', null),
  regionDescriptionMobile: (bannersRaw) => get(bannersRaw, 'regionDescriptionMobile', null),
  regionLoadingMobile: (bannersRaw) => get(bannersRaw, 'regionLoadingMobile', null),
};
