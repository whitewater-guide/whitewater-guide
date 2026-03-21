import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockSectionInfoScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Web View"
        testID="mock:navigate:WEB_VIEW"
        onPress={() =>
          navigation.navigate(Screens.WEB_VIEW, { fixture: 'test' })
        }
      />
      <MockButton
        label="License"
        testID="mock:navigate:LICENSE"
        onPress={() =>
          navigation.navigate(Screens.LICENSE, {
            placement: 'section',
            license: { name: 'CC BY-NC-SA' },
          })
        }
      />
      <MockButton
        label="Plain"
        testID="mock:navigate:PLAIN"
        onPress={() =>
          navigation.navigate(Screens.PLAIN, {
            title: 'Test',
            text: 'Plain text content',
          })
        }
      />
      <MockButton
        label="Region"
        testID="mock:navigate:REGION_STACK"
        onPress={() =>
          navigation.navigate(Screens.REGION_STACK, { regionId: 'xxx' })
        }
      />
    </MockScreenWrapper>
  );
};

export default MockSectionInfoScreen;
