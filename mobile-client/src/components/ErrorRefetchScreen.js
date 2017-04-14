import PropTypes from 'prop-types';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { default as withErrorsViewBase } from '../commons/utils/withErrorsView';

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
      <Icon name="warning" style={{ fontSize: 20 }} />
      <Text>{errorMessage}</Text>
      <View>
        <Button transparent onPress={doRefetch} >
          <Icon name="refresh" style={{ color: 'black', fontSize: 30 }} />
        </Button>
      </View>
    </View>
  );
};

ErrorRefetchScreen.propTypes = {
  errors: PropTypes.object.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export const withErrorsView = withErrorsViewBase(ErrorRefetchScreen);
