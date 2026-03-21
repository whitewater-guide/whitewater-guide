import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import { Screens } from '../../core/navigation';
import type { DescentFormParamsList } from '../../core/navigation/navigation-params';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockDescentFormLevelScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DescentFormParamsList>>();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Next"
        testID="mock:navigate:DESCENT_FORM_COMMENT"
        onPress={() => navigation.navigate(Screens.DESCENT_FORM_COMMENT)}
      />
      <MockButton
        label="Back"
        testID="mock:back"
        onPress={() => navigation.goBack()}
      />
    </MockScreenWrapper>
  );
};

export default MockDescentFormLevelScreen;
