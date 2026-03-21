import type { RegionCoreFragment } from '@whitewater-guide/schema';
import React from 'react';
import { Text } from 'react-native';

import theme from '~/theme';
import getTitleFontSize from '~/utils/getTitleFontSize';

interface Props {
  region?: RegionCoreFragment | null;
}

const RegionTitle: React.FC<Props> = ({ region }) => {
  const name = region?.name;
  if (!name) {
    return null;
  }
  return (
    <Text
      style={{
        fontSize: getTitleFontSize(name),
        color: theme.colors.textLight,
      }}
    >
      {name}
    </Text>
  );
};

export default RegionTitle;
