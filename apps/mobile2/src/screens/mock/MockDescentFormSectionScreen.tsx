import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockDescentFormSectionScreen: React.FC = () => {
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Add New Section"
        testID="mock:navigate:ADD_SECTION_TABS"
        onPress={() =>
          rootNavigation.navigate(Screens.ADD_SECTION_TABS, {
            fromDescentFormKey: 'mock-key',
          })
        }
      />
      <MockButton
        label="Next"
        testID="mock:navigate:DESCENT_FORM_DATE"
        onPress={() => rootNavigation.navigate(Screens.DESCENT_FORM_DATE)}
      />
    </MockScreenWrapper>
  );
};

export default MockDescentFormSectionScreen;
