import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { PHOTO_SIZE } from './MediaConstants';
import { Text } from '../../../components';
import I18n from '../../../i18n';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: PHOTO_SIZE,
  },
});

const NoMedia = ({ type }) => {
  const text = I18n.t('section.media.noMedia', { type: I18n.t('section.media.' + type).toLowerCase()});
  return (
    <View style={styles.container}>
      <Text note>{text}</Text>
    </View>
  );
};

NoMedia.propTypes = {
  type: PropTypes.string.isRequired,
};

export default NoMedia;
