import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon, Text } from 'native-base';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ErrorRefetchScreen = ({ errors, errorMessage }) => {
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

export default ErrorRefetchScreen;

