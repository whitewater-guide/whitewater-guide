import { Section, sectionName } from '@whitewater-guide/commons';
import React from 'react';
import { Text } from 'react-native';
import getTitleFontSize from '../../utils/getTitleFontSize';

interface Props {
  section: Section | null;
}

const SectionTitle: React.FC<Props> = ({ section }) => {
  const fullName = sectionName(section);
  return (
    <Text style={{ fontSize: getTitleFontSize(fullName) }}>{fullName}</Text>
  );
};

export default SectionTitle;
