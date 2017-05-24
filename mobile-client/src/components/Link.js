import React from 'react';
import PropTypes from 'prop-types';
import { Linking, StyleSheet, Text } from 'react-native';
import theme from '../theme/variables/platform';

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
    color: theme.brandPrimary,
  },
  noLink: {
    textDecorationLine: 'none',
  },
});

const Link = ({ label, url }) => {
  const onPress = () => Linking.openURL(url).catch(() => {});
  return (
    <Text style={url ? styles.link : styles.noLink} onPress={onPress}>
      {label}
    </Text>
  );
};

Link.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string,
};

Link.defaultProps = {
  url: null,
};

export default Link;
