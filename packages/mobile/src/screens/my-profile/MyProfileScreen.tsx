import React from 'react';
import { useTranslation } from 'react-i18next';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import { Screen } from '~/components/Screen';
import MyProfileView from './MyProfileView';
import { MyProfileNavProps } from './types';

const MyProfileScreen: React.FC<MyProfileNavProps> = ({ navigation }) => {
  const { t } = useTranslation();
  useEffectOnce(() => {
    navigation.setOptions({ headerTitle: t('myProfile:title') });
  });

  return (
    <Screen safe={true}>
      <MyProfileView />
    </Screen>
  );
};

export default MyProfileScreen;
