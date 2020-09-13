import { Descent } from '@whitewater-guide/commons';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clipboard, Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { IconButton } from 'react-native-paper';

import useActionSheet from '~/components/useActionSheet';
import descentToString from '~/features/descents/descentToString';
import theme from '~/theme';

import DeleteDescentDialog from './DeleteDescentDialog';
import useNavigateToForm from './useNavigateToForm';

interface Props {
  descent?: Descent | null;
}

const DescentMenu: React.FC<Props> = ({ descent }) => {
  const { t } = useTranslation();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const toForm = useNavigateToForm();
  const options = [
    t('screens:descent.menu.duplicate'),
    t('screens:descent.menu.edit'),
    t('screens:descent.menu.delete'),
    t('screens:descent.menu.copy'),
    t('commons:cancel'),
  ];
  const [actionSheet, showMenu] = useActionSheet();
  const onMenu = useCallback(
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
          Clipboard.setString(descentToString(t, descent));
          break;
      }
    },
    [t, setDeleteDialogVisible, descent, toForm],
  );
  return (
    <React.Fragment>
      <IconButton
        testID="decent-menu-button"
        icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
        color={theme.colors.textLight}
        onPress={showMenu}
      />
      <ActionSheet
        testID="descent-menu-actionsheet"
        ref={actionSheet}
        title={t('screens:descent.menu.title')}
        options={options}
        cancelButtonIndex={options.length - 1}
        onPress={onMenu}
      />
      {descent && deleteDialogVisible && (
        <DeleteDescentDialog
          descentId={descent.id}
          close={() => setDeleteDialogVisible(false)}
        />
      )}
    </React.Fragment>
  );
};

export default DescentMenu;
