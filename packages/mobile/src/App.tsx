import { ApolloClient, ApolloProvider } from '@apollo/client';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import * as Sentry from '@sentry/react-native';
import {
  AuthProvider,
  AuthService,
  RegionsFilterProvider,
  TagsProvider,
} from '@whitewater-guide/clients';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import NativeSplashScreen from 'react-native-bootsplash';
import { Provider as PaperProvider } from 'react-native-paper';

import Loading from '~/components/Loading';
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

  // See https://github.com/apollographql/apollo-cache-persist/issues/34#issuecomment-371177206 for explanation
  resetApolloCache = async () => {
    apolloCachePersistor.pause();
    await apolloCachePersistor.purge();
    await this._apolloClient?.resetStore();
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
                    <RegionsFilterProvider>
                      <AppSettingsProvider>
                        <IapProvider>
                          <OfflineContentProvider>
                            <ActionSheetProvider>
                              <NavigationRoot>
                                <PreviousVersion />
                                <View style={StyleSheet.absoluteFill}>
                                  <RootDrawer />
                                  <OfflineContentDialog />
                                </View>
                              </NavigationRoot>
                            </ActionSheetProvider>
                          </OfflineContentProvider>
                        </IapProvider>
                      </AppSettingsProvider>
                    </RegionsFilterProvider>
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

export default Sentry.wrap(App, {
  profilerProps: {
    name: 'whitewater',
    disabled: true,
    updateProps: {},
  },
  touchEventBoundaryProps: {
    ignoreNames: [
      'Background',
      'Card',
      'CellRenderer',
      'ErrorBoundary',
      'FastImage',
      'FlatList',
      'Handler',
      'Icon',
      'IconBase',
      'LargeList',
      'Left',
      'LinearGradient',
      'ListItem',
      'MaybeScreen',
      'MaybeScreenContainer',
      'OptimizedComponent',
      'Paper',
      'Pressable',
      'Right',
      'Row',
      'Screen',
      'ScreenContainer',
      'StaticContainer',
      'Surface',
      'Text',
      'ThemedComponent',
      'View',
      /.*[nN]ative.*/,
      /.*[nN]avigat.*/,
      /.*Button.*/,
      /.*GestureHandler.*/,
      /.*Provider/,
      /.*Scene.*/,
      /.*ScrollView.*/,
      /[\s]*/,
      /[wW]ith.*/,
      /[wW]rap.*/,
      /Animated.*/,
      /Drawer.*/,
      /Lazy.*/,
      /Material.*/,
      /SafeArea.*/,
      /Stack.*/,
      /Themed.*/,
      /Touchable.*/,
      /Virtualized.*/,
    ],
  },
});
