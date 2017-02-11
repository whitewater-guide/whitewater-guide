import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import App from './core/App';
import 'react-virtualized/styles.css'; // only needs to be imported once

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

Meteor.startup(() => {
  render(<App/>, document.getElementById('render-target'));
});
