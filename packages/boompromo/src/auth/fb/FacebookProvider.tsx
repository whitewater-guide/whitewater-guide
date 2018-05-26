import React from 'react';
import Context from './context';
import getLoginStatus from './getLoginStatus';
import getMyFacebookProfile from './getMyFacebookProfile';
import loadFacebookSDK from './loadFacebookSDK';
import login from './login';
import logout from './logout';
import { FacebookProfile } from './types';

interface State {
  loading: boolean;
  me?: FacebookProfile;
  accessToken?: string;
}

export class FacebookProvider extends React.PureComponent<{}, State> {
  state: State = { loading: true };

  async componentDidMount() {
    await loadFacebookSDK(process.env.REACT_APP_FACEBOOK_APP_ID!);
    await this.performLogin(true);
  }

  performLogin = async (initial: boolean) => {
    const loginFunction = initial ? getLoginStatus : login;
    const { authResponse, status } = await loginFunction();
    if (status === 'connected') {
      const me = await getMyFacebookProfile();
      this.setState({ loading: false, me, accessToken: authResponse.accessToken });
    } else {
      this.setState({ loading: false, me: undefined, accessToken: undefined });
    }
  };

  handleLogin = async () => {
    this.setState({ loading: true });
    await this.performLogin(false);
  };

  handleLogout = async () => {
    this.setState({ loading: true });
    await logout();
    this.setState({ loading: false, me: undefined, accessToken: undefined });
  };

  render() {
    return (
      <Context.Provider value={{ ...this.state, login: this.handleLogin, logout: this.handleLogout }}>
        { this.props.children }
      </Context.Provider>
    );
  }
}
