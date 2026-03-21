import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import theme from '../../theme';

const styles = StyleSheet.create({
  button: {
    marginVertical: theme.margin.half,
  },
});

interface MockButtonProps {
  label: string;
  testID: string;
  onPress: () => void;
}

const MockButton: React.FC<MockButtonProps> = ({ label, testID, onPress }) => (
  <Button
    mode="outlined"
    onPress={onPress}
    testID={testID}
    style={styles.button}
  >
    {label}
  </Button>
);

export default MockButton;
