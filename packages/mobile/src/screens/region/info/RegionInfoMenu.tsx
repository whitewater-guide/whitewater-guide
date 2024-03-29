import { useActionSheet } from '@expo/react-native-action-sheet';
import { useRegion } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

import theme from '~/theme';
import copyAndToast from '~/utils/copyAndToast';

const RegionInfoMenu: React.FC = () => {
  const region = useRegion();
  const { t } = useTranslation();

  const { showActionSheetWithOptions } = useActionSheet();
  const showMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('region:info.menu.title'),
        options: [t('region:info.menu.clipboard'), t('commons:cancel')],
        cancelButtonIndex: 1,
      },
      (index: number) => {
        if (index !== 0 || !region) {
          return;
        }
        if (region.description) {
          copyAndToast(region.description);
        }
      },
    );
  }, [showActionSheetWithOptions, t, region]);

  return (
    <IconButton
      testID="region-info-menu-button"
      icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
      iconColor={theme.colors.textLight}
      onPress={showMenu}
    />
  );
};

export default RegionInfoMenu;
