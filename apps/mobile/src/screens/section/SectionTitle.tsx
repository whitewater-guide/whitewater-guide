import { sectionName } from '@whitewater-guide/clients';
import type { SectionNameShortFragment } from '@whitewater-guide/schema';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import theme from '~/theme';

import getTitleFontSize from '../../utils/getTitleFontSize';

const styles = StyleSheet.create({
  title: {
    color: theme.colors.textLight,
  },
});

interface Props {
  section?: Partial<SectionNameShortFragment> | null;
}

const SectionTitle: React.FC<Props> = ({ section }) => {
  const fullName = sectionName(section);
  return (
    <Text style={[styles.title, { fontSize: getTitleFontSize(fullName) }]}>
      {fullName}
    </Text>
  );
};

export default SectionTitle;
