import React from 'react';
import { useTranslation } from 'react-i18next';

import FullScreenKAV from '~/components/FullScreenKAV';
import { Screen } from '~/components/Screen';
import TextField from '~/forms/TextField';

const DescriptionScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Screen padding={true}>
      <FullScreenKAV>
        <TextField
          name="description"
          multiline={true}
          fullHeight={true}
          label={t('screens:addSection.description.label')}
          testID="description"
          textAlignVertical="top"
        />
      </FullScreenKAV>
    </Screen>
  );
};

DescriptionScreen.displayName = 'DescriptionScreen';

export default DescriptionScreen;
