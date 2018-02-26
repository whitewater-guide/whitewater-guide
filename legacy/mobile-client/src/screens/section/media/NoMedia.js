import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { PHOTO_SIZE } from './MediaConstants';
import { Text } from '../../../components';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: PHOTO_SIZE,
  },
});

const NoMedia = ({ type }) => (
  <View style={styles.container}>
    <Text note>
      { `No ${type} for this section :(` }
    </Text>
  </View>
);

NoMedia.propTypes = {
  type: PropTypes.string.isRequired,
};

export default NoMedia;
