import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockRegionsListScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Region XXX"
        testID="mock:navigate:REGION_STACK"
        onPress={() =>
          navigation.navigate(Screens.REGION_STACK, { regionId: 'xxx' })
        }
      />
    </MockScreenWrapper>
  );
};

export default MockRegionsListScreen;
