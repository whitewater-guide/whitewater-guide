import { WithNode } from '@whitewater-guide/clients';
import { Region } from '@whitewater-guide/commons';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Clipboard, Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { IconButton } from 'react-native-paper';
import theme from '../../../theme';

interface Props {
  region: WithNode<Region | null>;
}

export const RegionInfoMenu: React.FC<Props> = ({ region }) => {
  const actionSheet = useRef<ActionSheet>(null);
  const [t] = useTranslation();
  const showMenu = useCallback(() => {
    if (actionSheet.current) {
      actionSheet.current.show();
    }
  }, []);
  const onMenu = useCallback(
    (index: number) => {
      if (index === 0 && region.node && region.node.description) {
        Clipboard.setString(region.node.description);
      }
    },
    [region.node],
  );
  const options = [t('region:info.menu.clipboard'), t('commons:cancel')];
  return (
    <React.Fragment>
      <IconButton
        testID="region-info-menu-button"
        icon={Platform.OS === 'ios' ? 'more-horiz' : 'more-vert'}
        color={theme.colors.textLight}
        onPress={showMenu}
      />
      <ActionSheet
        testID="region-info-menu-actionsheet"
        ref={actionSheet}
        title={t('region:info.menu.title')}
        options={options}
        cancelButtonIndex={2}
        onPress={onMenu}
      />
    </React.Fragment>
  );
};
