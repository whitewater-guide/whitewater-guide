import MaterialIcons from '@react-native-vector-icons/material-design-icons';
import { NEW_RIVER_ID } from '@whitewater-guide/commons';
import { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import Config from 'react-native-config';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Text>{NEW_RIVER_ID}</Text>
      <Text>{Config.BACKEND_HOST}</Text>
      <MaterialIcons name="facebook-gaming" size={30} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
