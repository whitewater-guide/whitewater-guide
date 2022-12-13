import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/core';
import { ROOT_LICENSE, SafeSectionDetails } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

import { Screens } from '~/core/navigation';
import { useToggleFavoriteSection } from '~/features/sections';
import theme from '~/theme';

import { SectionInfoNavProp } from './types';

interface Props {
  section: SafeSectionDetails;
}

const SectionInfoMenu: React.FC<Props> = ({ section }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation<SectionInfoNavProp>();

  const { showActionSheetWithOptions } = useActionSheet();
  const [toggleFavorite, toggling] = useToggleFavoriteSection(
    section.id,
    section.favorite,
  );

  const showMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('screens:section.info.menu.title'),
        options: [
          t(
            'screens:section.info.menu.favorite.' +
              (section.favorite ? 'remove' : 'add'),
          ),
          t('screens:section.info.menu.license'),
          t('commons:cancel'),
        ],
        cancelButtonIndex: 2,
      },
      (index: number) => {
        if (index === 0 && !toggling) {
          toggleFavorite();
        }
        if (index === 1) {
          navigate(Screens.LICENSE, {
            placement: 'section',
            copyright: section?.copyright,
            license:
              section?.license ?? section?.region?.license ?? ROOT_LICENSE,
          });
        }
      },
    );
  }, [
    showActionSheetWithOptions,
    t,
    navigate,
    section,
    toggleFavorite,
    toggling,
  ]);

  return (
    <IconButton
      testID="section-info-menu-button"
      icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
      color={theme.colors.textLight}
      onPress={showMenu}
    />
  );
};

export default SectionInfoMenu;
