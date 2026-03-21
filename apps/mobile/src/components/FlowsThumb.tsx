import type {
  ListedSectionFragment,
  SectionDerivedFields,
} from '@whitewater-guide/clients';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import theme from '~/theme';

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
    color: theme.colors.textMain,
  },
  unitLine: {
    fontSize: 12,
    color: theme.colors.textMain,
  },
  timeLine: {
    fontSize: 12,
    color: theme.colors.textMain,
  },
});

interface Props {
  section: ListedSectionFragment & SectionDerivedFields;
}

const FlowsThumb: React.FC<Props> = ({ section }) => {
  const { t } = useTranslation();
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
      <Text style={styles.timeLine}>{flowsThumb.fromNow}</Text>
    </View>
  );
};

export default FlowsThumb;
