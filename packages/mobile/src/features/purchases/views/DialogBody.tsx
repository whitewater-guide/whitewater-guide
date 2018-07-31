import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DialogTitle } from 'react-native-paper';

const styles = StyleSheet.create({
  root: {
    minHeight: 470,
  },
});

interface Props {
  title: string;
}

const DialogBody: React.SFC<Props> = ({ title, children }) => (
  <View style={styles.root}>
    <DialogTitle>{title}</DialogTitle>
    {children}
  </View>
);

export default DialogBody;
