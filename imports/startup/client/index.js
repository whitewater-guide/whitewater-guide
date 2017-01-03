import React from 'react';
import '../../tap-i18n';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import App from './App';
import moment from 'moment';
import 'moment-range';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

Meteor.startup(() => {
  render(<App/>, document.getElementById('render-target'));
});
