import { Section } from '@whitewater-guide/schema';
import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Button, Paragraph } from 'react-native-paper';
import useToggle from 'react-use/lib/useToggle';

import Paper from '~/components/Paper';

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: 'flex-end',
  },
});

interface Props {
  section: Pick<Section, 'helpNeeded' | 'description'>;
}

const HelpNeeded = memo<Props>(({ section }) => {
  const { helpNeeded, description } = section;
  const [collapsed, setCollapsed] = useToggle(false);
  const onClose = useCallback(() => setCollapsed(true), [setCollapsed]);
  // section description is null when premium is required
  if (!helpNeeded || description === null) {
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
