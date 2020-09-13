import {
  AuthProvider,
  AuthService,
  RegionsFilterProvider,
  TagsProvider,
} from '@whitewater-guide/clients';
import ApolloClient from 'apollo-client';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { StyleSheet, View } from 'react-native';
import NativeSplashScreen from 'react-native-bootsplash';
import { Provider as PaperProvider } from 'react-native-paper';

import Loading from '~/components/Loading';
import { Snackbar, SnackbarProvider } from '~/components/snackbar';
import {
  OfflineContentDialog,
  OfflineContentProvider,
} from '~/features/offline';
import { AppSettingsProvider } from '~/features/settings/AppSettingsProvider';

import { apolloCachePersistor, initApolloClient } from './core/apollo';
import { MobileAuthService } from './core/auth';
import configMisc from './core/config/configMisc';
import { configErrors } from './core/errors';
import { NavigationRoot, RootDrawer } from './core/navigation';
import { IapProvider } from './features/purchases';
import { UploadsProvider } from './features/uploads';
import { I18nProvider } from './i18n';
import { PaperTheme } from './theme';
import { PreviousVersion } from './utils/versioning';

configErrors();
configMisc();

class App extends React.PureComponent {
  private _apolloClient?: ApolloClient<any>;
  private _authService!: AuthService;

  constructor(props: any) {
    super(props);
    this._authService = new MobileAuthService();
    this._authService.on('sign-in', this.resetApolloCache);
  }

  async componentDidMount() {
    // findPath('src/App.tsx', 'node_modules/react-native-svg/src/elements/Pattern.tsx');
    this._apolloClient = await initApolloClient(this._authService);
    this.forceUpdate();
  }

  componentWillUnmount() {
    this._authService.off('sign-in', this.resetApolloCache);
  }

  componentDidCatch(error: Error) {
    NativeSplashScreen.hide();
    throw error;
  }

  onSignOut = () => {
    // TODO: navigation reset to home screen on sign out
  };

  // See https://github.com/apollographql/apollo-cache-persist/issues/34#issuecomment-371177206 for explanation
  resetApolloCache = async () => {
    apolloCachePersistor.pause();
    await apolloCachePersistor.purge();
    await this._apolloClient!.resetStore();
    apolloCachePersistor.resume();
  };

  render() {
    return (
      <PaperProvider theme={PaperTheme}>
        {this._apolloClient ? (
          <ApolloProvider client={this._apolloClient}>
            <TagsProvider>
              <AuthProvider
                service={this._authService}
                renderInitializing={<Loading />}
              >
                <I18nProvider onUserLanguageChange={this.resetApolloCache}>
                  <UploadsProvider>
                    <SnackbarProvider>
                      <RegionsFilterProvider>
                        <AppSettingsProvider>
                          <IapProvider>
                            <OfflineContentProvider>
                              <NavigationRoot>
                                <PreviousVersion />
                                <View style={StyleSheet.absoluteFill}>
                                  <RootDrawer />
                                  <OfflineContentDialog />
                                </View>
                                <Snackbar />
                              </NavigationRoot>
                            </OfflineContentProvider>
                          </IapProvider>
                        </AppSettingsProvider>
                      </RegionsFilterProvider>
                    </SnackbarProvider>
                  </UploadsProvider>
                </I18nProvider>
              </AuthProvider>
            </TagsProvider>
          </ApolloProvider>
        ) : (
          <Loading />
        )}
      </PaperProvider>
    );
  }
}

export default App;
