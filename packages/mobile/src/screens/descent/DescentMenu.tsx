import { useActionSheet } from '@expo/react-native-action-sheet';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

import descentToString from '~/features/descents/descentToString';
import theme from '~/theme';
import copyAndToast from '~/utils/copyAndToast';

import DeleteDescentDialog from './DeleteDescentDialog';
import { DescentDetailsFragment } from './descentDetails.generated';
import useNavigateToForm from './useNavigateToForm';

interface Props {
  descent?: DescentDetailsFragment | null;
}

const DescentMenu: React.FC<Props> = ({ descent }) => {
  const { t } = useTranslation();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const toForm = useNavigateToForm();

  const { showActionSheetWithOptions } = useActionSheet();
  const showMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('screens:descent.menu.title'),
        options: [
          t('screens:descent.menu.duplicate'),
          t('screens:descent.menu.edit'),
          t('screens:descent.menu.delete'),
          t('screens:descent.menu.copy'),
          t('commons:cancel'),
        ],
        cancelButtonIndex: 4,
      },
      (index: number) => {
        if (!descent) {
          return;
        }
        switch (index) {
          case 0:
            toForm(descent, true);
            break;
          case 1:
            toForm(descent, false);
            break;
          case 2:
            setDeleteDialogVisible(true);
            break;
          case 3:
            copyAndToast(descentToString(t, descent));
            break;
          default:
          // do nothing
        }
      },
    );
  }, [t, showActionSheetWithOptions, setDeleteDialogVisible, descent, toForm]);

  return (
    <>
      <IconButton
        testID="decent-menu-button"
        icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
        iconColor={theme.colors.textLight}
        onPress={showMenu}
      />
      {descent && deleteDialogVisible && (
        <DeleteDescentDialog
          descentId={descent.id}
          close={() => setDeleteDialogVisible(false)}
        />
      )}
    </>
  );
};

export default DescentMenu;
