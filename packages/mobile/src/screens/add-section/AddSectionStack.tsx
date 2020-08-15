import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';

import { AddSectionStackParamsList } from './types';
import AddSectionTabs from './AddSectionTabs';
import Config from 'react-native-ultimate-config';
import { LazyGaugeScreen } from './gauge';
import { LazyPhotoScreen } from './photo';
import { LazyRiverScreen } from './river';
import { LazyShapeScreen } from './shape';
import React from 'react';
import { Screens } from '~/core/navigation';
import SubmitButton from './SubmitButton';
import { getHeaderRenderer } from '~/components/header';
import { useTranslation } from 'react-i18next';

const Stack = createStackNavigator<AddSectionStackParamsList>();

const screenOptions: StackNavigationOptions = {
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  animationEnabled: Config.E2E_MODE !== 'true',
};

const AddSectionStack: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator screenOptions={screenOptions} headerMode="screen">
      <Stack.Screen
        name={Screens.ADD_SECTION_TABS}
        component={AddSectionTabs}
        options={{
          headerTitle: t('screens:addSection.headerTitle'),
          headerRight: () => <SubmitButton />,
        }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_RIVER}
        component={LazyRiverScreen}
        options={{ headerTitle: t('screens:addSection.river.title') }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_GAUGE}
        component={LazyGaugeScreen}
        options={{ headerTitle: t('screens:addSection.gauge.title') }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_SHAPE}
        component={LazyShapeScreen}
        options={{ headerTitle: t('screens:addSection.shape.title') }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_PHOTO}
        component={LazyPhotoScreen}
        options={{ headerTitle: t('screens:addSection.photo.title') }}
      />
    </Stack.Navigator>
  );
};

export default AddSectionStack;
