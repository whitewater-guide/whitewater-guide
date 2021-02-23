import { useActionSheet } from '@expo/react-native-action-sheet';
import { Section } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Clipboard, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

import theme from '~/theme';

interface Props {
  section: Section | null;
}

const SectionGuideMenu: React.FC<Props> = ({ section }) => {
  const [t] = useTranslation();

  const { showActionSheetWithOptions } = useActionSheet();
  const showMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('section:guide.menu.title'),
        options: [t('section:guide.menu.clipboard'), t('commons:cancel')],
        cancelButtonIndex: 1,
      },
      (index: number) => {
        if (index === 0 && section?.description) {
          Clipboard.setString(section?.description);
        }
      },
    );
  }, [showActionSheetWithOptions, t, section]);

  return (
    <IconButton
      testID="section-info-menu-button"
      icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
      color={theme.colors.textLight}
      onPress={showMenu}
    />
  );
};

export default SectionGuideMenu;
