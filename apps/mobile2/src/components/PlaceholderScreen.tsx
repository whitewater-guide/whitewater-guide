import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.lightBackground,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.margin.double,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textMain,
    marginBottom: theme.margin.double,
  },
  paramsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textNote,
    marginBottom: theme.margin.single,
  },
  params: {
    fontSize: 12,
    color: theme.colors.textNote,
    fontFamily: 'monospace',
  },
});

const PlaceholderScreen: React.FC = () => {
  const route = useRoute();

  return (
    <View style={styles.container} testID={`screen:${route.name}`}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.name}>{route.name}</Text>
        {route.params && (
          <>
            <Text style={styles.paramsTitle}>Params:</Text>
            <Text style={styles.params}>
              {JSON.stringify(route.params, null, 2)}
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default PlaceholderScreen;
