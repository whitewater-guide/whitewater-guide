import PropTypes from 'prop-types';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './text';
import { Icon } from './index';
import withErrorsViewBase from '../commons/utils/withErrorsView';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const ErrorRefetchScreen = ({ errors, errorMessage }) => {
  const doRefetch = () => Object.values(errors).forEach(v => v.refetch().catch(() => {}));
  return (
    <View style={styles.container}>
      <Icon narrow icon="warning" size={16} />
      <Text>{errorMessage}</Text>
      <Icon icon="refresh" onPress={doRefetch} />
    </View>
  );
};

ErrorRefetchScreen.propTypes = {
  errors: PropTypes.object.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export const withErrorsView = withErrorsViewBase(ErrorRefetchScreen);
