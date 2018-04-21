import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const NoSectionsPlaceholder: React.StatelessComponent = () => (
  <View style={styles.container}>
    <Subheading>Oops!</Subheading>
    <Paragraph>Could not find any sections</Paragraph>
    <Paragraph>Please check your search criteria</Paragraph>
  </View>
);

export default NoSectionsPlaceholder;
