import { castArray, get } from 'lodash';
import * as qs from 'qs';
import { withProps } from 'recompose';
import { isNative } from '../utils/isNative';

type FeatureType = 'gauge' | 'region' | 'source' | 'river' | 'section';
type FeatureIdType = 'gaugeId' | 'regionId' | 'sourceId' | 'riverId' | 'sectionId';

const ALL_FEATURE_IDS: FeatureIdType[] = [
  'gaugeId',
  'regionId',
  'riverId',
  'sectionId',
  'sourceId',
];

export type WithFeatureIds = {[is in FeatureIdType]?: string};

export const withFeatureIds = <TOuter>(features?: FeatureType | FeatureType[]) => {
  return withProps<WithFeatureIds, TOuter>(
    (props: any) => {
      const featureIds = features ? castArray(features).map(feature => `${feature}Id`) : ALL_FEATURE_IDS;
      const result: WithFeatureIds = {};
      featureIds.forEach((featureId: FeatureIdType) => {
        let value = props[featureId];
        value = value || isNative() ?
          get(props, `navigation.state.params.${featureId}`) :
          get(props, `match.params.${featureId}`);
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
    },
  );
};
