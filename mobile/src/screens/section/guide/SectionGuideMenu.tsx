import { Section } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Clipboard, Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { IconButton } from 'react-native-paper';

import useActionSheet from '~/components/useActionSheet';

import theme from '../../../theme';

interface Props {
  section: Section | null;
}

const SectionGuideMenu: React.FC<Props> = ({ section }) => {
  const [t] = useTranslation();
  const options = [t('section:guide.menu.clipboard'), t('commons:cancel')];
  const [actionSheet, showMenu] = useActionSheet();
  const onMenu = useCallback(
    (index: number) => {
      if (index === 0 && section?.description) {
        Clipboard.setString(section?.description);
      }
    },
    [section],
  );
  return (
    <React.Fragment>
      <IconButton
        testID="section-info-menu-button"
        icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
        color={theme.colors.textLight}
        onPress={showMenu}
      />
      <ActionSheet
        testID="section-info-menu-actionsheet"
        ref={actionSheet}
        title={t('section:guide.menu.title')}
        options={options}
        cancelButtonIndex={2}
        onPress={onMenu}
      />
    </React.Fragment>
  );
};

export default SectionGuideMenu;
