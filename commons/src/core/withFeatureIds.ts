import { castArray, get } from 'lodash';
import * as qs from 'qs';
import { withProps } from 'recompose';
import isNative from './isNative';

const ALL_FEATURE_IDS = [
  'fileId',
  'gaugeId',
  'mediaId',
  'pointId',
  'regionId',
  'riverId',
  'sectionId',
  'sourceId',
  'tagId',
  'userId',
];

export const withFeatureIds = (features?: string | string[]) => {
  return withProps(
    (props: any) => {
      const featureIds = features ? castArray(features).map(feature => `${feature}Id`) : ALL_FEATURE_IDS;
      const result: Map<string, string> = new Map();
      featureIds.forEach((featureId) => {
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
          result.set(featureId, value);
        }
      });
      return result;
    },
  );
};
