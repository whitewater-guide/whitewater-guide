declare module 'react-facebook-login/dist/facebook-login-render-props' {
  import React from 'react';
  import { ReactFacebookLoginProps } from 'react-facebook-login';

  export interface FacebookLoginRenderProps {
    onClick: () => void;
    isDisabled: boolean;
    isProcessing: boolean;
    isSdkLoaded: boolean;
  }
  export interface FacebookLoginProps extends ReactFacebookLoginProps {
    render: (props: FacebookLoginRenderProps) => React.ReactElement;
  }
  class FacebookLogin extends React.PureComponent<FacebookLoginProps> {}

  export default FacebookLogin;
}
