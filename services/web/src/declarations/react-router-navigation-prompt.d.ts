declare module 'react-router-navigation-prompt' {
  import H from 'history';
  import React from 'react';

  interface Props {
    when?:
      | boolean
      | ((currentLoc: H.Location, nextLoc?: H.Location) => boolean);
  }

  export default class NavigationPrompt extends React.Component<Props> {}
}
