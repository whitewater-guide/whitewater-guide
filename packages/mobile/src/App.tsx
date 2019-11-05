import {
  AuthProvider,
  AuthService,
  FilterProvider,
  TagsProvider,
} from '@whitewater-guide/clients';
import ApolloClient from 'apollo-client';
import Loading from 'components/Loading';
import { Snackbar, SnackbarProvider } from 'components/snackbar';
import SplashScreen from 'components/SplashScreen';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { AsyncStorage } from 'react-native';
import NativeSplashScreen from 'react-native-bootsplash';
import codePush from 'react-native-code-push';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationState } from 'react-navigation';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { apolloCachePersistor, initApolloClient } from './core/apollo';
import { MobileAuthService } from './core/auth';
import configMisc from './core/config/configMisc';
import { configErrors } from './core/errors';
import { configureStore, resetNavigationToHome } from './core/redux';
import { navigationChannel } from './core/sagas';
import { IapProvider } from './features/purchases';
import { UploadsProvider } from './features/uploads';
import { I18nProvider } from './i18n';
import RootNavigator from './RootNavigator';
import { PaperTheme } from './theme';
import { trackScreenChange } from './utils/navigation';
import { PreviousVersion } from './utils/versioning';

configErrors();
configMisc();

const NAVIGATION_PERSISTENCE_KEY = 'ww_nav_3';

class App extends React.PureComponent {
  private _apolloClient?: ApolloClient<any>;
  private _authService!: AuthService;
  private _store: Store<any>;
  private _persistor: Persistor;

  constructor(props: any) {
    super(props);
    const { store, persistor } = configureStore();
    this._persistor = persistor;
    this._store = store;
    this._authService = new MobileAuthService(
      this.resetApolloCache,
      this.onSignOut,
    );
  }

  async componentDidMount() {
    // findPath('src/App.tsx', 'node_modules/react-native-svg/src/elements/Pattern.tsx');
    this._apolloClient = await initApolloClient(this._authService);
    this.forceUpdate();
  }

  componentDidCatch(error: Error) {
    NativeSplashScreen.hide();
    throw error;
  }

  onSignOut = () => {
    navigationChannel.put(resetNavigationToHome());
  };

  // See https://github.com/apollographql/apollo-cache-persist/issues/34#issuecomment-371177206 for explanation
  resetApolloCache = async () => {
    apolloCachePersistor.pause();
    await apolloCachePersistor.purge();
    await this._apolloClient!.resetStore();
    apolloCachePersistor.resume();
  };

  persistNavigationState = async (state: NavigationState) => {
    await AsyncStorage.setItem(
      NAVIGATION_PERSISTENCE_KEY,
      JSON.stringify(state),
    );
  };

  loadNavigationState = async () => {
    const jsonString = await AsyncStorage.getItem(NAVIGATION_PERSISTENCE_KEY);
    return jsonString === null ? null : JSON.parse(jsonString);
  };

  renderLoadingExperimental = () => <SplashScreen />;

  render() {
    return (
      <PaperProvider theme={PaperTheme}>
        <FilterProvider>
          <Provider store={this._store}>
            <PersistGate loading={<Loading />} persistor={this._persistor}>
              {this._apolloClient ? (
                <ApolloProvider client={this._apolloClient}>
                  <TagsProvider>
                    <AuthProvider
                      service={this._authService}
                      renderInitializing={<Loading />}
                    >
                      <I18nProvider
                        onUserLanguageChange={this.resetApolloCache}
                      >
                        <UploadsProvider>
                          <SnackbarProvider>
                            <IapProvider>
                              <PreviousVersion />
                              <RootNavigator
                                onNavigationStateChange={trackScreenChange}
                                persistNavigationState={
                                  this.persistNavigationState
                                }
                                loadNavigationState={this.loadNavigationState}
                                renderLoadingExperimental={
                                  this.renderLoadingExperimental
                                }
                              />
                              <Snackbar />
                            </IapProvider>
                          </SnackbarProvider>
                        </UploadsProvider>
                      </I18nProvider>
                    </AuthProvider>
                  </TagsProvider>
                </ApolloProvider>
              ) : (
                <Loading />
              )}
            </PersistGate>
          </Provider>
        </FilterProvider>
      </PaperProvider>
    );
  }
}

export default __DEV__
  ? App
  : codePush({
      checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
      installMode: codePush.InstallMode.ON_NEXT_RESUME,
      minimumBackgroundDuration: 60 * 5,
    })(App);
