import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockDescentScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Edit"
        testID="mock:navigate:DESCENT_FORM_EDIT"
        onPress={() =>
          navigation.navigate(Screens.DESCENT_FORM_SECTION, { descentId: 'zzz' })
        }
      />
      <MockButton
        label="Duplicate"
        testID="mock:navigate:DESCENT_FORM_DUPLICATE"
        onPress={() =>
          navigation.navigate(Screens.DESCENT_FORM_SECTION, {
            formData: { comment: 'Duplicated descent' },
          })
        }
      />
    </MockScreenWrapper>
  );
};

export default MockDescentScreen;
