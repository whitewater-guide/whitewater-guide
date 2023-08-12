import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

import { Screens } from '~/core/navigation';
import theme from '~/theme';

import useDeleteProfile from './useDeleteProfile';

export const MyProfileMenu: React.FC = () => {
  const { t } = useTranslation();
  const { me } = useAuth();

  const { showActionSheetWithOptions } = useActionSheet();
  const deleteProfile = useDeleteProfile();
  const { navigate } = useNavigation();

  const showMenu = useCallback(() => {
    const options = [t('screens:myprofile.menu.deleteProfile')];
    if (me?.accounts && me.accounts.every((acc) => acc.provider !== 'local')) {
      options.push(t('screens:myprofile.menu.connectEmail'));
    }
    options.push(t('commons:cancel'));
    showActionSheetWithOptions(
      {
        title: t('screens:myprofile.menu.title'),
        options,
        destructiveButtonIndex: 0,
        cancelButtonIndex: options.length,
      },
      (index: number) => {
        if (index === 0) {
          deleteProfile();
        }
        if (index === 1) {
          navigate(Screens.CONNECT_EMAIL_REQUEST, {
            email: me?.email ?? undefined,
          });
        }
      },
    );
  }, [showActionSheetWithOptions, t, deleteProfile, me, navigate]);

  return (
    <IconButton
      testID="my-profile-menu-button"
      icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
      iconColor={theme.colors.textLight}
      onPress={showMenu}
    />
  );
};
