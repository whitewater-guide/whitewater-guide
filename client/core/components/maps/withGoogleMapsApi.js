import React from 'react';
import {ScriptCache} from '../../../utils/ScriptCache';
import GoogleApi from './GoogleApi';

const createCache = (options) => {
  let apiKey = options && options.apiKey;

  if (!apiKey) {
    try {
      const {Meteor} = require('meteor/meteor');
      apiKey = Meteor.settings.public.googleMaps.apiKey;
    } catch (err) {}
  }

  return ScriptCache({
    google: GoogleApi({...options, apiKey})
  });
};

const withGoogleMapsApi = (options) => (WrappedComponent) => {

  class GoogleMapWrapper extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.scriptCache = createCache(options);
      this.scriptCache.google.onLoad(this.onLoad);

      this.state = {
        loaded: false,
        map: null,
        google: null
      };
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          loaded={this.state.loaded}
          google={window.google}
        />
      );
    }

    onLoad = () => {
      this._gapi = window.google;
      this.setState({loaded: true, google: this._gapi});
    };
  }

  return GoogleMapWrapper;
};

export default withGoogleMapsApi;
