import { useActionSheet } from '@expo/react-native-action-sheet';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

import theme from '~/theme';

import useDeleteProfile from './useDeleteProfile';

export const MyProfileMenu: React.FC = () => {
  const { t } = useTranslation();

  const { showActionSheetWithOptions } = useActionSheet();
  const deleteProfile = useDeleteProfile();

  const showMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('screens:myprofile.menu.title'),
        options: [
          t('screens:myprofile.menu.deleteProfile'),
          t('commons:cancel'),
        ],
        destructiveButtonIndex: 0,
      },
      (index: number) => {
        if (index === 0) {
          deleteProfile();
        }
      },
    );
  }, [showActionSheetWithOptions, t, deleteProfile]);

  return (
    <IconButton
      testID="my-profile-menu-button"
      icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
      color={theme.colors.textLight}
      onPress={showMenu}
    />
  );
};
