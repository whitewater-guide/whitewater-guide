import { useRegion } from '@whitewater-guide/clients';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Clipboard, Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { IconButton } from 'react-native-paper';

import theme from '../../../theme';

const RegionInfoMenu: React.FC = () => {
  const { node } = useRegion();
  const actionSheet = useRef<ActionSheet>(null);
  const [t] = useTranslation();
  const showMenu = useCallback(() => {
    if (actionSheet.current) {
      actionSheet.current.show();
    }
  }, []);
  const onMenu = useCallback(
    (index: number) => {
      if (index !== 0 || !node) {
        return;
      }
      if (node.description) {
        Clipboard.setString(node.description);
      }
    },
    [node],
  );
  const options = [t('region:info.menu.clipboard'), t('commons:cancel')];
  return (
    <React.Fragment>
      <IconButton
        testID="region-info-menu-button"
        icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
        color={theme.colors.textLight}
        onPress={showMenu}
      />
      <ActionSheet
        testID="region-info-menu-actionsheet"
        ref={actionSheet}
        title={t('region:info.menu.title')}
        options={options}
        cancelButtonIndex={Platform.OS === 'ios' ? 2 : undefined}
        onPress={onMenu}
      />
    </React.Fragment>
  );
};

export default RegionInfoMenu;
