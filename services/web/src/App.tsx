import { MyProfileProvider } from '@whitewater-guide/clients';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Store } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { client } from './apollo';
import { Loading } from './components';
import { RootLayout } from './layout';
import { configureStore } from './redux';
import { theme } from './styles';

interface State {
  store?: Store;
  persistor?: Persistor;
}

export default class App extends React.PureComponent<{}, State> {
  state: State = {};

  async componentDidMount() {
    const state = await configureStore();
    this.setState(state);
  }

  renderLoading = () => <Loading />;

  render() {
    const { store, persistor } = this.state;
    if (store && persistor) {
      return (
        <MuiThemeProvider muiTheme={theme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ApolloProvider client={client}>
                <MyProfileProvider renderLoading={this.renderLoading}>
                  <BrowserRouter>
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
