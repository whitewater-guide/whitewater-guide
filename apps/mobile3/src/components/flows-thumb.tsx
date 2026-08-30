import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export interface FlowsThumbData {
  color: string;
  unit: string;
  value: string;
  fromNow: string;
}

export interface FlowsThumbSection {
  flowsThumb?: FlowsThumbData;
}

export interface FlowsThumbProps {
  section: FlowsThumbSection;
}

function FlowsThumb({ section }: FlowsThumbProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { flowsThumb } = section;
  if (!flowsThumb) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={[styles.mainLine, { color: flowsThumb.color }]}>
        {flowsThumb.value}
        <Text style={[styles.unitLine, { color: flowsThumb.color }]}>
          {` ${t(`commons:${flowsThumb.unit}`)}`}
        </Text>
      </Text>
      <Text style={[styles.timeLine, { color: theme.text }]}>
        {flowsThumb.fromNow}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 52,
    paddingHorizontal: 4,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#c9c9c9',
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  mainLine: {
    fontSize: 18,
    fontWeight: '400',
  },
  unitLine: {
    fontSize: 12,
  },
  timeLine: {
    fontSize: 12,
  },
});

export default memo(FlowsThumb);
