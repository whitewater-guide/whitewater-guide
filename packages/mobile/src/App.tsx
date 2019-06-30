import {
  AuthProvider,
  AuthService,
  FilterProvider,
  TagsProvider,
} from '@whitewater-guide/clients';
import ApolloClient from 'apollo-client';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { AsyncStorage } from 'react-native';
import codePush from 'react-native-code-push';
import { Provider as PaperProvider } from 'react-native-paper';
import NativeSplashScreen from 'react-native-splash-screen';
import { NavigationState } from 'react-navigation';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorSnackbar, Loading, SplashScreen } from './components';
import { apolloCachePersistor, initApolloClient } from './core/apollo';
import { MobileAuthService } from './core/auth';
import configMisc from './core/config/configMisc';
import configMoment from './core/config/configMoment';
import { configErrors } from './core/errors';
import { configureStore, resetNavigationToHome } from './core/redux';
import { navigationChannel } from './core/sagas';
import { purchaseActions } from './features/purchases';
import { I18nProvider } from './i18n';
import RootNavigator from './RootNavigator';
import { PaperTheme } from './theme';
import { trackScreenChange } from './utils/navigation';
import { PreviousVersion } from './utils/versioning';

configErrors();
configMoment();
configMisc();

const NAVIGATION_PERSISTENCE_KEY = 'ww_nav_2';

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
  }

  async componentDidMount() {
    this._authService = new MobileAuthService(
      this.resetApolloCache,
      this.onSignOut,
    );
    await this._authService.init();
    this._apolloClient = await initApolloClient(this._authService);
    this.forceUpdate();
  }

  componentDidCatch(error: Error) {
    NativeSplashScreen.hide();
    throw error;
  }

  onSignOut = () => {
    navigationChannel.put(resetNavigationToHome());
    this._store.dispatch(purchaseActions.logout());
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
      <Provider store={this._store}>
        <PersistGate loading={<Loading />} persistor={this._persistor}>
          {this._apolloClient ? (
            <ApolloProvider client={this._apolloClient}>
              <TagsProvider>
                <FilterProvider>
                  <AuthProvider service={this._authService}>
                    <I18nProvider onUserLanguageChange={this.resetApolloCache}>
                      <PaperProvider theme={PaperTheme}>
                        <PreviousVersion />
                        <RootNavigator
                          onNavigationStateChange={trackScreenChange}
                          persistNavigationState={this.persistNavigationState}
                          loadNavigationState={this.loadNavigationState}
                          renderLoadingExperimental={
                            this.renderLoadingExperimental
                          }
                        />
                        <ErrorSnackbar />
                      </PaperProvider>
                    </I18nProvider>
                  </AuthProvider>
                </FilterProvider>
              </TagsProvider>
            </ApolloProvider>
          ) : null}
        </PersistGate>
      </Provider>
    );
  }
}

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  minimumBackgroundDuration: 60 * 5,
})(App);
