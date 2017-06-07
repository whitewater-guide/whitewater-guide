import React from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { Text } from './text';

const Link = ({ label, url }) => {
  const onPress = () => Linking.openURL(url).catch(() => {});
  return (
    <Text primary link={!!url} onPress={onPress}>
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
