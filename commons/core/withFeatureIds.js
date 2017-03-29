import { withProps } from 'recompose';
import _ from 'lodash';
import qs from 'qs';
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

export const withFeatureIds = function withFeatureIds(feature) {
  return withProps(
    (props) => {
      const featureIds = feature ? [`${feature}Id`] : ALL_FEATURE_IDS;
      const result = {};
      featureIds.forEach((featureId) => {
        let value = props[featureId];
        value = value || isNative() ?
          _.get(props, `navigation.state.params.${featureId}`) :
          _.get(props, `match.params.${featureId}`);
        if (!value) {
          const search = _.get(props, 'location.search', ' ').substr(1);
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
