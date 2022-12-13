import React from 'react';
import { useTranslation } from 'react-i18next';
import useEffectOnce from 'react-use/lib/useEffectOnce';

import { Screen } from '~/components/Screen';

import { MyProfileMenu } from './menu';
import MyProfileView from './MyProfileView';
import { MyProfileNavProps } from './types';

const MyProfileScreen: React.FC<MyProfileNavProps> = ({ navigation }) => {
  const { t } = useTranslation();

  useEffectOnce(() => {
    navigation.setOptions({
      headerTitle: t('screens:myprofile.title'),
      headerRight: () => <MyProfileMenu />,
    });
  });

  return (
    <Screen safeBottom>
      <MyProfileView />
    </Screen>
  );
};

export default MyProfileScreen;
