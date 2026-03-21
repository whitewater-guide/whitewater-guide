import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.lightBackground,
  },
  content: {
    alignItems: 'center',
    padding: theme.margin.double,
    paddingTop: theme.margin.triple,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textMain,
    marginBottom: theme.margin.single,
  },
  params: {
    fontSize: 11,
    color: theme.colors.textNote,
    fontFamily: 'monospace',
    marginBottom: theme.margin.double,
  },
});

interface MockScreenWrapperProps {
  children?: React.ReactNode;
}

const MockScreenWrapper: React.FC<MockScreenWrapperProps> = ({ children }) => {
  const route = useRoute();

  return (
    <View style={styles.container} testID={`screen:${route.name}`}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.name}>{route.name}</Text>
        {route.params && (
          <Text style={styles.params}>
            {JSON.stringify(route.params, null, 2)}
          </Text>
        )}
        {children}
      </ScrollView>
    </View>
  );
};

export default MockScreenWrapper;
