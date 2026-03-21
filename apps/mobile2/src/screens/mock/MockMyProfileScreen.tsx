import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react';

import { useAuth } from '../../core/auth';
import { Screens } from '../../core/navigation';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockMyProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { service } = useAuth();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Sign Out"
        testID="my-profile:sign-out"
        onPress={async () => {
          await service.signOut();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: Screens.REGIONS_LIST }],
            }),
          );
        }}
      />
    </MockScreenWrapper>
  );
};

export default MockMyProfileScreen;
