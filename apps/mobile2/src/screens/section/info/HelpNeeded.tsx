import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Collapsible, useCollapsible } from '../../../components/Collapsible';
import theme from '../../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightBackground,
    padding: theme.margin.single,
    marginBottom: theme.margin.single,
  },
  buttonWrapper: {
    alignItems: 'flex-end',
  },
});

interface Props {
  helpNeeded?: string | null;
}

const HelpNeeded = memo<Props>(({ helpNeeded }) => {
  const [collapsed, setCollapsed] = useCollapsible(false);

  const dismiss = useCallback(() => {
    setCollapsed();
  }, [setCollapsed]);

  if (!helpNeeded) {
    return null;
  }

  return (
    <Collapsible collapsed={collapsed} collapsedHeight={0}>
      <View style={styles.container}>
        <Text variant="bodyMedium">{helpNeeded}</Text>
        <View style={styles.buttonWrapper}>
          <Button mode="text" onPress={dismiss}>
            OK
          </Button>
        </View>
      </View>
    </Collapsible>
  );
});

HelpNeeded.displayName = 'HelpNeeded';

export default HelpNeeded;
