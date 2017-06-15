import glamorous from 'glamorous-native';
import PropTypes from 'prop-types';
import { Text as RNText } from 'react-native';
import theme from '../theme';

const Text = glamorous.text(
  theme.font.regular,
  props => ['note', 'link', 'primary', 'right', 'centered', 'fullWidth'].reduce(
    (style, attribute) => (props[attribute] ? { ...style, ...theme.font[attribute] } : style),
    { paddingHorizontal: props.paddingHorizontal },
  ),
);

Text.propTypes = {
  ...RNText.propTypes,
  note: PropTypes.bool,
  link: PropTypes.bool,
  primary: PropTypes.bool,
  right: PropTypes.bool,
  centered: PropTypes.bool,
  fullWidth: PropTypes.bool,
  paddingHorizontal: PropTypes.number,
};

export default Text;
