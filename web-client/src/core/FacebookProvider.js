import PropTypes from 'prop-types';
import React, { Children } from 'react';

class FacebookProvider extends React.Component {

  static propTypes = {
    appId: PropTypes.string.isRequired,
    xfbml: PropTypes.bool,
    cookie: PropTypes.bool,
    version: PropTypes.string,
  };

  static defaultProps = {
    xfbml: false,
    cookie: false,
    version: '2.8',
  };

  static childContextTypes = {
    FB: PropTypes.shape({
      status: PropTypes.object,
      login: PropTypes.func,
      logout: PropTypes.func,
    })
  };

  state = {
    initialized: false,
    isLogging: false,
    status: {
      status: "unknown",
    },
  };

  getChildContext() {
    return {FB: {
      status: {status: 'unknown'},
      login: this.login,
      logout: this.logout,
    }};
  }

  componentDidMount() {
    if (document.getElementById('facebook-jssdk')) {
      this.setState({initialized: true});
      return;
    }

    window.fbAsyncInit = () => {
      //console.log('Fb async init');
      window.FB.init(this.props);
      //console.log('Initialized');
      this.setState({initialized: true});
      window.FB.getLoginStatus(this.onGetLoginStatus);
    };

    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = `//connect.facebook.net/en_US/all.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  onGetLoginStatus = (response) => {
    console.log('Got login status', response);
    this.setState({status: response, isLogging: true});
  };

  login = (callback) => {
    this.setState({isLogging: true});
    window.FB.login(loginResponse => this.onLogin(loginResponse, callback), {scope: 'email'});
  };

  onLogin = (response, callback) => {
    //console.log('On login', response);
    this.setState({isLogging: false, status: response});
    if (callback)
      callback(response);
  };

  logout = (callback) => {
    this.setState({isLogging: true});
    window.FB.logout(logoutResponse => this.onLogout(logoutResponse, callback));
  };

  onLogout = (response, callback) => {
    //console.log('On logout', response);
    this.setState({isLogging: false, status: response});
    if (callback)
      callback(response);
  };

  render() {
    return Children.only(this.props.children);
  }
}

export default FacebookProvider;
