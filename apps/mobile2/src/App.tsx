import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import NavigationRoot from './core/navigation/NavigationRoot';
import { I18nProvider } from './i18n';
import { paperTheme } from './theme';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

function App() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <I18nProvider>
            <NavigationRoot />
          </I18nProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
