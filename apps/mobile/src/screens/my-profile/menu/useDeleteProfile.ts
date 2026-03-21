import { useAuth } from '@whitewater-guide/clients';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { useDeleteProfileMutation } from './deleteProfile.generated';

export default function useDeleteProfile() {
  const { t } = useTranslation();
  const { service } = useAuth();
  const signOut = useCallback(() => service.signOut(), [service]);
  const [deleteProfile] = useDeleteProfileMutation();

  return useCallback(() => {
    const onYes = () => {
      deleteProfile()
        .then(() => signOut())
        .then(() => {
          Alert.alert(
            t('screens:myprofile.deletedProfileDialog.title'),
            t('screens:myprofile.deletedProfileDialog.message'),
            [{ text: t('commons:ok') }],
          );
        });
    };

    Alert.alert(
      t('screens:myprofile.deleteProfileDialog.title'),
      t('screens:myprofile.deleteProfileDialog.message'),
      [
        { text: t('commons:no'), style: 'cancel' },
        {
          text: t('commons:yes'),
          style: 'destructive',
          onPress: onYes,
        },
      ],
    );
  }, [t, signOut, deleteProfile]);
}
