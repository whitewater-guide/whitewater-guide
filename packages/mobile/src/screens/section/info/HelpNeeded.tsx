import { Section } from '@whitewater-guide/schema';
import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Button, Paragraph } from 'react-native-paper';
import useToggle from 'react-use/lib/useToggle';

import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightBackground,
    padding: theme.margin.single,
  },
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
      <View style={styles.container}>
        <Paragraph>{helpNeeded}</Paragraph>
        <View style={styles.buttonWrapper}>
          <Button mode="text" onPress={onClose}>
            OK
          </Button>
        </View>
      </View>
    </Collapsible>
  );
});

HelpNeeded.displayName = 'HelpNeeded';

export default HelpNeeded;
