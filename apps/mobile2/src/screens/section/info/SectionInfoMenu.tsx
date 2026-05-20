import { useNavigation } from '@react-navigation/native';
import type { SafeSectionDetails } from '@whitewater-guide/clients';
import { ROOT_LICENSE } from '@whitewater-guide/clients';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';

import { Screens } from '../../../core/navigation';
import theme from '../../../theme';
import { useToggleFavoriteSection } from '../../region/sections-list/item/useToggleFavoriteSection';
import type { SectionInfoScreenProps } from './navigation-types';

interface Props {
  section: SafeSectionDetails;
}

function SectionInfoMenu({ section }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<SectionInfoScreenProps['navigation']>();
  const [visible, setVisible] = useState(false);
  const [toggleFavorite, toggling] = useToggleFavoriteSection(
    section.id,
    section.favorite,
  );

  const openMenu = useCallback(() => setVisible(true), []);
  const closeMenu = useCallback(() => setVisible(false), []);

  const onFavorite = useCallback(() => {
    closeMenu();
    if (!toggling) {
      toggleFavorite();
    }
  }, [closeMenu, toggleFavorite, toggling]);

  const onLicense = useCallback(() => {
    closeMenu();
    navigation.navigate(Screens.LICENSE, {
      placement: 'section',
      copyright: section.copyright,
      license: section.license ?? section.region?.license ?? ROOT_LICENSE,
    });
  }, [closeMenu, navigation, section]);

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
        onPress={onFavorite}
        title={t(
          'screens:section.info.menu.favorite.' +
            (section.favorite ? 'remove' : 'add'),
        )}
        leadingIcon={section.favorite ? 'heart' : 'heart-outline'}
      />
      <Menu.Item
        onPress={onLicense}
        title={t('screens:section.info.menu.license')}
        leadingIcon="license"
      />
    </Menu>
  );
}

export default SectionInfoMenu;
