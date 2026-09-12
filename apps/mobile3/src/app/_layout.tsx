import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import '@/components/map/mapbox';
import '@/i18n';

SplashScreen.preventAutoHideAsync();

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export const unstable_settings = {
  anchor: storybookEnabled ? '(storybook)' : '(tabs)',
  initialRouteName: storybookEnabled ? '(storybook)' : '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!storybookEnabled}>
              <Stack.Screen name="(tabs)" />
            </Stack.Protected>
            <Stack.Protected guard={storybookEnabled}>
              <Stack.Screen name="(storybook)" />
            </Stack.Protected>
          </Stack>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
