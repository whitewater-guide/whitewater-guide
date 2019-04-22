import { Section } from '@whitewater-guide/commons';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Clipboard, Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { IconButton } from 'react-native-paper';
import theme from '../../../theme';

interface Props {
  section: Section | null;
}

export const SectionGuideMenu: React.FC<Props> = ({ section }) => {
  const actionSheet = useRef<ActionSheet>(null);
  const [t] = useTranslation();
  const showMenu = useCallback(() => {
    if (actionSheet.current) {
      actionSheet.current.show();
    }
  }, []);
  const onMenu = useCallback(
    (index: number) => {
      if (index === 0 && section && section.description) {
        Clipboard.setString(section.description);
      }
    },
    [section],
  );
  const options = [t('section:guide.menu.clipboard'), t('commons:cancel')];
  return (
    <React.Fragment>
      <IconButton
        testID="section-info-menu-button"
        icon={Platform.OS === 'ios' ? 'more-horiz' : 'more-vert'}
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
