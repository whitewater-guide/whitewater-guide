import { propType } from 'graphql-anywhere';
import PropTypes from 'prop-types';
import { SectionFragments } from './sectionFragments';

export const SectionPropType = propType(SectionFragments.All);
export const SectionsPropType = PropTypes.shape({
  count: PropTypes.number,
  list: PropTypes.arrayOf(SectionPropType),
  loading: PropTypes.bool,
  loadMore: PropTypes.func,
});
