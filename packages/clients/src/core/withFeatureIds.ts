import castArray from 'lodash/castArray';
import get from 'lodash/get';
import qs from 'qs';
import { withProps } from 'recompose';
import { isNative } from '../utils';

export type FeatureType =
  | 'gauge'
  | 'region'
  | 'source'
  | 'river'
  | 'section'
  | 'media'
  | 'banner';
export type FeatureIdType =
  | 'gaugeId'
  | 'regionId'
  | 'sourceId'
  | 'riverId'
  | 'sectionId'
  | 'mediaId'
  | 'bannerId';

const ALL_FEATURE_IDS: FeatureIdType[] = [
  'gaugeId',
  'regionId',
  'riverId',
  'sectionId',
  'sourceId',
  'mediaId',
  'bannerId',
];

export type WithFeatureIds = { [is in FeatureIdType]?: string };

export const withFeatureIds = <TOuter>(
  features?: FeatureType | FeatureType[],
) => {
  return withProps<WithFeatureIds, TOuter>((props: any) => {
    const featureIds: FeatureIdType[] = features
      ? castArray(features).map((feature) => `${feature}Id` as FeatureIdType)
      : ALL_FEATURE_IDS;
    const result: WithFeatureIds = {};
    featureIds.forEach((featureId: FeatureIdType) => {
      let value = props[featureId];
      value =
        value || isNative()
          ? get(props, `navigation.state.params.${featureId}`)
          : get(props, `match.params.${featureId}`);
      if (!value) {
        const search = get(props, 'location.search', ' ').substr(1);
        const query = qs.parse(search);
        value = query[featureId];
      }
      if (value) {
        result[featureId] = value;
      }
    });
    return result;
  });
};
