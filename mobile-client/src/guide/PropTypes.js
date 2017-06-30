import PropTypes from 'prop-types';

export const GuideStepPropType = PropTypes.shape({
  index: PropTypes.number,
  active: PropTypes.bool,
  visible: PropTypes.bool,
  completed: PropTypes.bool,
  show: PropTypes.func,
  hide: PropTypes.func,
  complete: PropTypes.func,
});
