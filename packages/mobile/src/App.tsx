import {
  AuthProvider,
  AuthService,
  TagsProvider,
} from '@whitewater-guide/clients';
import ApolloClient from 'apollo-client';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { AsyncStorage } from 'react-native';
import codePush from 'react-native-code-push';
import { PortalProvider } from 'react-native-portal';
import { NavigationState } from 'react-navigation';
import { Provider } from 'react-redux';
import { Store, Unsubscribe } from 'redux';
import { ErrorSnackbar, Screen, SplashScreen } from './components';
import { resetNavigationToHome } from './core/actions';
import { apolloCachePersistor, initApolloClient } from './core/apollo';
import { MobileAuthService } from './core/auth';
import configMisc from './core/config/configMisc';
import configMoment from './core/config/configMoment';
import { configErrors } from './core/errors';
import { RootState } from './core/reducers';
import { navigationChannel } from './core/sagas';
import configureStore from './core/store/configureStore';
import { purchaseActions } from './features/purchases';
import { I18nProvider } from './i18n';
import RootNavigator from './RootNavigator';
import { trackScreenChange } from './utils/navigation';

configErrors();
configMoment();
configMisc();

interface State {
  initialized: boolean;
}

const NAVIGATION_PERSISTENCE_KEY = 'ww_nav_1';

class App extends React.Component<{}, State> {
  state: State = { initialized: false };
  private _store?: Store<RootState>;
  private _apolloClient?: ApolloClient<any>;
  private _storeSubscription?: Unsubscribe;
  private _authService!: AuthService;

  async componentDidMount() {
    this._authService = new MobileAuthService(
      this.resetApolloCache,
      this.onSignOut,
    );
    await this._authService.init();
    this._store = await configureStore();
    this._apolloClient = await initApolloClient(this._authService);
    const initialized = this._store.getState().app.initialized;
    if (!initialized) {
      this._storeSubscription = this._store.subscribe(this.listenForInitialize);
    }
    this.setState({ initialized });
  }

  componentWillUnmount(): void {
    if (this._storeSubscription) {
      this._storeSubscription();
    }
  }

  shouldComponentUpdate(nextProps: any, nextState: State) {
    return !this.state.initialized && nextState.initialized;
  }

  listenForInitialize = () => {
    const initialized = this._store!.getState().app.initialized;
    this.setState({ initialized });
  };

  onSignOut = () => {
    navigationChannel.put(resetNavigationToHome());
    if (this._store) {
      this._store.dispatch(purchaseActions.logout());
    }
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
    if (this._store && this.state.initialized) {
      return (
        <Provider store={this._store}>
          <ApolloProvider client={this._apolloClient!}>
            <PortalProvider>
              <TagsProvider>
                <AuthProvider service={this._authService}>
                  <I18nProvider onLanguageChange={this.resetApolloCache}>
                    <RootNavigator
                      onNavigationStateChange={trackScreenChange}
                      persistNavigationState={this.persistNavigationState}
                      loadNavigationState={this.loadNavigationState}
                      renderLoadingExperimental={this.renderLoadingExperimental}
                    />
                    <ErrorSnackbar />
                  </I18nProvider>
                </AuthProvider>
              </TagsProvider>
            </PortalProvider>
          </ApolloProvider>
        </Provider>
      );
    }
    return <Screen />;
  }
}

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  minimumBackgroundDuration: 60 * 5,
})(App);
