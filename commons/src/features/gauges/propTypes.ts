import { propType } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import { GaugeFragments } from './gaugeFragments';

export const GaugePropType = propType(GaugeFragments.All);
export const GaugesPropType = PropTypes.shape({
  count: PropTypes.number,
  list: PropTypes.arrayOf(GaugePropType),
  loading: PropTypes.bool,
  loadMore: PropTypes.func,
});
