import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import Config from 'react-native-config';
import { Appbar } from 'react-native-paper';

import { getHeaderRenderer } from '../../components/header';
import PlaceholderScreen from '../../components/PlaceholderScreen';
import type { AddSectionStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import theme from '../../theme';
import AddSectionTabs from './AddSectionTabs';

const Stack = createNativeStackNavigator<AddSectionStackParamsList>();

const screenOptions = {
  header: getHeaderRenderer(false),
  gestureEnabled: false,
  animation:
    Config.E2E_MODE === 'true' ? ('none' as const) : ('default' as const),
  headerStyle: theme.navigationStyles.headerStyle,
};

function MockSubmitButton() {
  return (
    <Appbar.Action
      icon="check"
      testID="mock:submit"
      onPress={() => {
        Alert.alert('Submitted', 'Section submitted (mock)');
      }}
    />
  );
}

function AddSectionStack() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name={Screens.ADD_SECTION_TABS}
        component={AddSectionTabs}
        options={{
          headerTitle: t('screens:addSection.headerTitle'),
          headerRight: () => <MockSubmitButton />,
        }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_RIVER}
        component={PlaceholderScreen}
        options={{ headerTitle: t('screens:addSection.river.title') }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_GAUGE}
        component={PlaceholderScreen}
        options={{ headerTitle: t('screens:addSection.gauge.title') }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_SHAPE}
        component={PlaceholderScreen}
        options={{ headerTitle: t('screens:addSection.shape.title') }}
      />
      <Stack.Screen
        name={Screens.ADD_SECTION_PHOTO}
        component={PlaceholderScreen}
        options={{ headerTitle: t('screens:addSection.photo.title') }}
      />
    </Stack.Navigator>
  );
}

export default AddSectionStack;
