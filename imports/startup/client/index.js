import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from './App';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

Meteor.startup(() => {
  render(<App/>, document.getElementById('render-target'));
});
