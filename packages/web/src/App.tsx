import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Store } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { getApolloClient } from './apollo';
import { Loading } from './components';
import { EditorLanguageLink } from './i18n/editors';
import { RootLayout } from './layout';
import { configureStore, RootState } from './redux';
import { theme } from './styles';
import { MyProfileProvider } from './ww-clients/features/users';

interface State {
  store?: Store<RootState>;
  persistor?: Persistor;
}

const BASENAME = process.env.NODE_ENV === 'production' ? '/admin' : undefined;

export default class App extends React.PureComponent<{}, State> {
  private editorLanguageLink: EditorLanguageLink = new EditorLanguageLink();

  state: State = {};

  async componentDidMount() {
    const state = await configureStore();
    this.setState(state);
  }

  renderLoading = () => <Loading />;

  render() {
    const { store, persistor } = this.state;
    if (store && persistor) {
      const apolloClient = getApolloClient(store.dispatch, [this.editorLanguageLink]);
      return (
        <MuiThemeProvider muiTheme={theme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ApolloProvider client={apolloClient}>
                <MyProfileProvider renderLoading={this.renderLoading}>
                  <BrowserRouter basename={BASENAME}>
                    <RootLayout />
                  </BrowserRouter>
                </MyProfileProvider>
              </ApolloProvider>
            </PersistGate>
          </Provider>
        </MuiThemeProvider>
      );
    }
    return (
      <MuiThemeProvider muiTheme={theme}>
        <Loading />
      </MuiThemeProvider>
    );
  }
}
