import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

import { SectionFavoriteButton } from '~/features/sections';
import theme from '~/theme';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  sectionId: string;
  favorite?: boolean | null;
}

const SectionInfoMenu = memo<Props>((props) => {
  return <SectionFavoriteButton {...props} color={theme.colors.textLight} />;
});

SectionInfoMenu.displayName = 'SectionInfoMenu';

export default SectionInfoMenu;
