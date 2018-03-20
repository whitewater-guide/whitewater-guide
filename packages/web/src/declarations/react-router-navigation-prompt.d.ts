declare module 'react-router-navigation-prompt' {
  import React from 'react';
  import H from 'history';

  interface Props {
    when?: boolean | ((currentLoc: H.Location, nextLoc?: H.Location) => boolean);
  }

  export default class NavigationPrompt extends React.Component<Props> {}
}
