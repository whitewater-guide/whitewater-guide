import type { ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { TagsProvider } from '@whitewater-guide/clients';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SnackbarProvider from './components/SnackbarProvider';
import { apolloCachePersistor, initApolloClient } from './core/apollo';
import { AuthProvider, MobileAuthService } from './core/auth';
import NavigationRoot from './core/navigation/NavigationRoot';
import { I18nProvider } from './i18n';
import { paperTheme } from './theme';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

function App() {
  const authServiceRef = useRef(new MobileAuthService());
  const [apolloClient, setApolloClient] =
    useState<ApolloClient<unknown> | null>(null);

  useEffect(() => {
    let off: (() => void) | undefined;

    async function init() {
      const client = await initApolloClient(authServiceRef.current);
      setApolloClient(client);
      off = authServiceRef.current.on('sign-in', async () => {
        apolloCachePersistor.pause();
        await apolloCachePersistor.purge();
        await client.resetStore();
        apolloCachePersistor.resume();
      });
    }
    init().catch((e) => {
      BootSplash.hide({ fade: false });
      throw e;
    });
    return off;
  }, []);

  if (!apolloClient) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <PaperProvider theme={paperTheme}>
        <KeyboardProvider>
          <SafeAreaProvider>
            <ApolloProvider client={apolloClient}>
              <TagsProvider>
                <AuthProvider service={authServiceRef.current}>
                  <I18nProvider>
                    <SnackbarProvider>
                      <NavigationRoot />
                    </SnackbarProvider>
                  </I18nProvider>
                </AuthProvider>
              </TagsProvider>
            </ApolloProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
