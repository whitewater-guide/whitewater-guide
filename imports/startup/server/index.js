import {Meteor} from 'meteor/meteor';
import './scripts';
import setupAccounts from './accounts';
import '../../api/sources';
import '../../api/gauges';

Meteor.startup(() => {
  setupAccounts();
});
