import type { MyProfileFragment } from '@whitewater-guide/schema';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, List, Portal, RadioButton } from 'react-native-paper';

import { i18n, LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '../../i18n';
import { useUpdateProfileMutation } from './updateProfile.generated';

interface Props {
  me: MyProfileFragment;
}

function MyLanguage({ me }: Props) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [mutate] = useUpdateProfileMutation();

  const currentLanguage = me.language || 'en';

  const handleChange = (language: string) => {
    setVisible(false);
    i18n.changeLanguage(language).catch(() => {});
    mutate({
      variables: { user: { language } },
      optimisticResponse: {
        __typename: 'Mutation',
        updateProfile: {
          __typename: 'User',
          id: me.id,
          language,
        },
      },
    }).catch(() => {});
  };

  return (
    <>
      <List.Item
        title={t('screens:myprofile.language')}
        description={LANGUAGE_NAMES[currentLanguage]}
        onPress={() => setVisible(true)}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{t('screens:myprofile.language')}</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={handleChange}
              value={currentLanguage}
            >
              {SUPPORTED_LANGUAGES.map((code) => (
                <RadioButton.Item
                  key={code}
                  label={LANGUAGE_NAMES[code]}
                  value={code}
                />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>
              {t('commons:cancel')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

export default MyLanguage;
