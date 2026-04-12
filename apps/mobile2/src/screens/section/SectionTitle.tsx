import { sectionName } from '@whitewater-guide/clients';
import type { SectionNameShortFragment } from '@whitewater-guide/schema';
import { Text } from 'react-native';

import theme from '../../theme';
import getTitleFontSize from '../../utils/getTitleFontSize';

type Props = {
  section?: Partial<SectionNameShortFragment> | null;
};

function SectionTitle({ section }: Props) {
  const fullName = sectionName(section);
  return (
    <Text
      style={{ color: theme.colors.textLight, fontSize: getTitleFontSize(fullName) }}
    >
      {fullName}
    </Text>
  );
}

export default SectionTitle;
