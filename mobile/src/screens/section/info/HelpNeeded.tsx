import { Section } from '@whitewater-guide/commons';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Button, Paragraph } from 'react-native-paper';

import Paper from '~/components/Paper';

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: 'flex-end',
  },
});

interface Props {
  section: Section;
}

const HelpNeeded = React.memo(({ section }: Props) => {
  const { helpNeeded } = section;
  const [collapsed, setCollapsed] = useState(false);
  const onClose = useCallback(() => setCollapsed(true), [setCollapsed]);
  if (!helpNeeded) {
    return null;
  }
  return (
    <Collapsible collapsed={collapsed}>
      <Paper>
        <Paragraph>{helpNeeded}</Paragraph>
        <View style={styles.buttonWrapper}>
          <Button mode="text" onPress={onClose}>
            OK
          </Button>
        </View>
      </Paper>
    </Collapsible>
  );
});

HelpNeeded.displayName = 'HelpNeeded';

export default HelpNeeded;
