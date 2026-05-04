import { useNavigation } from '@react-navigation/native';
import type { SafeSectionDetails } from '@whitewater-guide/clients';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Share } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';

import { useAuth } from '../../../core/auth';
import { Screens } from '../../../core/navigation';
import theme from '../../../theme';
import type { SectionInfoScreenProps } from './navigation-types';

interface Props {
  section: SafeSectionDetails;
}

function SectionInfoMenu({ section }: Props) {
  const { t } = useTranslation();
  const { me } = useAuth();
  const navigation = useNavigation<SectionInfoScreenProps['navigation']>();
  const [visible, setVisible] = useState(false);

  const openMenu = useCallback(() => setVisible(true), []);
  const closeMenu = useCallback(() => setVisible(false), []);

  const gated = useCallback(
    (action: () => void) => () => {
      closeMenu();
      if (me) {
        action();
      } else {
        navigation.navigate(Screens.AUTH_MAIN);
      }
    },
    [closeMenu, me, navigation],
  );

  const onShare = useCallback(async () => {
    closeMenu();
    await Share.share({ message: section.name ?? '' });
  }, [closeMenu, section.name]);

  const onEdit = gated(() => navigation.navigate(Screens.ADD_SECTION_TABS, {}));

  const onSuggest = gated(() =>
    navigation.navigate(Screens.SUGGESTION, { sectionId: section.id }),
  );

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          testID="section-info-menu-button"
          icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
          iconColor={theme.colors.textLight}
          onPress={openMenu}
        />
      }
    >
      <Menu.Item
        onPress={onShare}
        title={t('commons:copy')}
        leadingIcon="share-variant"
      />
      <Menu.Item
        onPress={onEdit}
        title={t('screens:descent.menu.edit')}
        leadingIcon="pencil"
      />
      <Menu.Item
        onPress={onSuggest}
        title={t('screens:section.fab.addSuggestion')}
        leadingIcon="pencil-plus"
      />
    </Menu>
  );
}

export default SectionInfoMenu;
