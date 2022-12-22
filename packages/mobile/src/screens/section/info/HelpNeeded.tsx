import { Section } from '@whitewater-guide/schema';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';

import { Collapsible, useCollapsible } from '~/components/Collapsible';
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
  const [collapsed, setCollapsed] = useCollapsible(false);
  // section description is null when premium is required
  if (!helpNeeded || description === null) {
    return null;
  }
  return (
    <Collapsible collapsed={collapsed} collapsedHeight={0}>
      <View style={styles.container}>
        <Paragraph>{helpNeeded}</Paragraph>
        <View style={styles.buttonWrapper}>
          <Button mode="text" onPress={setCollapsed}>
            OK
          </Button>
        </View>
      </View>
    </Collapsible>
  );
});

HelpNeeded.displayName = 'HelpNeeded';

export default HelpNeeded;
