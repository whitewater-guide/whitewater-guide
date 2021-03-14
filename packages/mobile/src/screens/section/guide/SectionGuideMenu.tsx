import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/core';
import { ROOT_LICENSE, Section } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Clipboard, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

import { Screens } from '~/core/navigation';
import theme from '~/theme';

import { SectionGuideNavProp } from './types';

interface Props {
  section: Section | null;
}

const SectionGuideMenu: React.FC<Props> = ({ section }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation<SectionGuideNavProp>();

  const { showActionSheetWithOptions } = useActionSheet();
  const showMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('section:guide.menu.title'),
        options: [
          t('section:guide.menu.clipboard'),
          t('section:guide.menu.license'),
          t('commons:cancel'),
        ],
        cancelButtonIndex: 2,
      },
      (index: number) => {
        if (index === 0 && section?.description) {
          Clipboard.setString(section?.description);
        }
        if (index === 1) {
          navigate(Screens.LICENSE, {
            placement: 'section',
            copyright: section?.copyright,
            license:
              section?.license ?? section?.region.license ?? ROOT_LICENSE,
          });
        }
      },
    );
  }, [showActionSheetWithOptions, t, navigate, section]);

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
