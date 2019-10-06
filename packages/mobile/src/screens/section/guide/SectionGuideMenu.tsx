import useActionSheet from 'components/useActionSheet';
import React, { useCallback } from 'react';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { Clipboard, Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { IconButton } from 'react-native-paper';
import theme from '../../../theme';
import { Result, SECTION_DETAILS, Vars } from '../sectionDetails.query';

interface Props {
  sectionId: string;
}

const SectionGuideMenu: React.FC<Props> = ({ sectionId }) => {
  const [t] = useTranslation();
  const options = [t('section:guide.menu.clipboard'), t('commons:cancel')];
  const [actionSheet, showMenu] = useActionSheet();
  const { data } = useQuery<Result, Vars>(SECTION_DETAILS, {
    fetchPolicy: 'cache-only',
    variables: { sectionId },
  });
  const onMenu = useCallback(
    (index: number) => {
      if (index === 0 && data && data.section && data.section.description) {
        Clipboard.setString(data.section.description);
      }
    },
    [data],
  );
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

export default SectionGuideMenu;
