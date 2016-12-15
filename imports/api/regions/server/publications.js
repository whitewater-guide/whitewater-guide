import {TAPi18n} from 'meteor/tap:i18n';
import {Regions} from '../index';

TAPi18n.publish('regions.list', function() {
  return Regions.find({});
});
