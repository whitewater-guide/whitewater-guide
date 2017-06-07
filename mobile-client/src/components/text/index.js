import glamorous from 'glamorous-native';
import PropTypes from 'prop-types';

export const Text = glamorous.text(
  ({ note, right, fullWidth, link, paddingHorizontal }, theme) => ({
    fontFamily: theme.font.family,
    color: note ? theme.colors.textNote : (link ? theme.colors.primary : theme.colors.textMain),
    fontSize: note ? theme.font.size.note : theme.font.size.regular,
    alignSelf: right ? 'flex-end' : 'flex-start',
    flex: fullWidth ? 1 : undefined,
    textDecorationLine: link ? 'underline' : null,
    paddingHorizontal,
  }),
);

Text.propTypes = {
  note: PropTypes.bool,
  right: PropTypes.bool,
  fullWidth: PropTypes.bool,
  link: PropTypes.bool,
  paddingHorizontal: PropTypes.number,
};
