import { dataIdFromObject, RegionFragments } from '@whitewater-guide/clients';
import { Region } from '@whitewater-guide/commons';
import React, { useCallback, useRef } from 'react';
import { useApolloClient } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { Clipboard, Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { IconButton } from 'react-native-paper';
import theme from '../../../theme';

interface Props {
  regionId?: string;
}

const RegionInfoMenu: React.FC<Props> = ({ regionId }) => {
  const client = useApolloClient();
  const actionSheet = useRef<ActionSheet>(null);
  const [t] = useTranslation();
  const showMenu = useCallback(() => {
    if (actionSheet.current) {
      actionSheet.current.show();
    }
  }, []);
  const onMenu = useCallback(
    (index: number) => {
      if (index !== 0 || !regionId) {
        return;
      }
      const region = client.readFragment<Pick<Region, 'description'>>({
        fragment: RegionFragments.Description,
        id: dataIdFromObject({ __typename: 'Region', id: regionId })!,
      });
      if (region && region.description) {
        Clipboard.setString(region.description);
      }
    },
    [client, regionId],
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
        cancelButtonIndex={Platform.OS === 'ios' ? 2 : undefined}
        onPress={onMenu}
      />
    </React.Fragment>
  );
};

export default RegionInfoMenu;
