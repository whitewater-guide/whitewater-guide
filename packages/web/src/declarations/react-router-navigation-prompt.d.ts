declare module 'react-router-navigation-prompt' {
  import * as React from 'react';
  import * as H from 'history';

  interface Props {
    when?: boolean | ((currentLoc: H.Location, nextLoc?: H.Location) => boolean);
  }

  export default class NavigationPrompt extends React.Component<Props> {}
}
