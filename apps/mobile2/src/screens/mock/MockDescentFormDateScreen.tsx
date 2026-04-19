import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockDescentFormDateScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Next"
        testID="mock:navigate:DESCENT_FORM_LEVEL"
        onPress={() => navigation.navigate(Screens.DESCENT_FORM_LEVEL)}
      />
      <MockButton
        label="Back"
        testID="mock:back"
        onPress={() => navigation.goBack()}
      />
    </MockScreenWrapper>
  );
};

export default MockDescentFormDateScreen;
