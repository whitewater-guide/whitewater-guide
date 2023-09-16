import { sectionName } from '@whitewater-guide/clients';
import type { SectionNameShortFragment } from '@whitewater-guide/schema';
import React from 'react';
import { Text } from 'react-native';

import getTitleFontSize from '../../utils/getTitleFontSize';

interface Props {
  section?: Partial<SectionNameShortFragment> | null;
}

const SectionTitle: React.FC<Props> = ({ section }) => {
  const fullName = sectionName(section);
  return (
    <Text style={{ fontSize: getTitleFontSize(fullName) }}>{fullName}</Text>
  );
};

export default SectionTitle;
