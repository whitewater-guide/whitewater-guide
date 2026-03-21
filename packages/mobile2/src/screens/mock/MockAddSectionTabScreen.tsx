import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import { Screens } from '../../core/navigation';
import type { AddSectionStackParamsList } from '../../core/navigation/navigation-params';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const subScreens = [
  { label: 'River', screen: Screens.ADD_SECTION_RIVER },
  { label: 'Gauge', screen: Screens.ADD_SECTION_GAUGE },
  { label: 'Shape', screen: Screens.ADD_SECTION_SHAPE },
  { label: 'Photo', screen: Screens.ADD_SECTION_PHOTO },
] as const;

const MockAddSectionTabScreen: React.FC = () => {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<AddSectionStackParamsList>>();

  // Only show sub-screen buttons on the MAIN tab
  const isMainTab = route.name === Screens.ADD_SECTION_MAIN;

  return (
    <MockScreenWrapper>
      {isMainTab &&
        subScreens.map(({ label, screen }) => (
          <MockButton
            key={screen}
            label={label}
            testID={`mock:navigate:${screen}`}
            onPress={() => navigation.navigate(screen)}
          />
        ))}
    </MockScreenWrapper>
  );
};

export default MockAddSectionTabScreen;
