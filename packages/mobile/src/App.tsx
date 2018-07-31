import ApolloClient from 'apollo-client';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import codePush from 'react-native-code-push';
import { PortalProvider } from 'react-native-portal';
import { Provider } from 'react-redux';
import { Store, Unsubscribe } from 'redux';
import { Screen, SplashScreen } from './components';
import { getApolloClient } from './core/apollo';
import configMisc from './core/config/configMisc';
import configMoment from './core/config/configMoment';
import { configErrors } from './core/errors';
import { RootState } from './core/reducers';
import configureStore from './core/store/configureStore';
import { I18nProvider } from './i18n';
import RootNavigator from './RootNavigator';
import { trackScreenChange } from './utils/navigation';
import { TagsProvider } from './ww-clients/features/tags';
import { MyProfileProvider } from './ww-clients/features/users';

configErrors();
configMoment();
configMisc();

interface State {
  initialized: boolean;
}

const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;

class App extends React.Component<{}, State> {
  state: State = { initialized: false };
  store?: Store<RootState>;
  apolloClient?: ApolloClient<any>;
  storeSubscription?: Unsubscribe;
  showSplash: boolean = true;

  async componentDidMount() {
    this.store = await configureStore();
    this.apolloClient = await getApolloClient();
    const initialized = this.store.getState().app.initialized;
    if (!initialized) {
      this.storeSubscription = this.store.subscribe(this.listenForInitialize);
    }
    this.setState({ initialized });
  }

  shouldComponentUpdate(nextProps: any, nextState: State) {
    return !this.state.initialized && nextState.initialized;
  }

  listenForInitialize = () => {
    const initialized = this.store!.getState().app.initialized;
    this.setState({ initialized });
  };

  onHideSplash = () => { this.showSplash = false; };

  renderProfileLoading = () =>
    (__DEV__ || !this.showSplash) ? null : <SplashScreen onHide={this.onHideSplash} />;

  renderLoadingExperimental = () => __DEV__ ? <SplashScreen /> : null;

  render() {
    if (this.store && this.state.initialized) {
      return (
        <Provider store={this.store}>
          <ApolloProvider client={this.apolloClient!}>
            <PortalProvider>
              <TagsProvider>
                <MyProfileProvider renderLoading={this.renderProfileLoading}>
                  <I18nProvider>
                    <RootNavigator
                      persistenceKey={navigationPersistenceKey}
                      onNavigationStateChange={trackScreenChange}
                      renderLoadingExperimental={this.renderLoadingExperimental}
                    />
                  </I18nProvider>
                </MyProfileProvider>
              </TagsProvider>
            </PortalProvider>
          </ApolloProvider>
        </Provider>
      );
    }
    return (
      <Screen />
    );
  }
}

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  minimumBackgroundDuration: 60 * 5,
})(App);
