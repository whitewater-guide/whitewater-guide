import { Meteor } from 'meteor/meteor';
import '../imports/api/sources';
// import {SyncedCron} from 'meteor/percolate:synced-cron';
// import tirol from './scripts/tirol';

// SyncedCron.add({
//   name: 'Harvest tirolean data',
//   schedule: function(parser) {
//     // parser is a later.parse object
//     return parser.text('every 5 minutes hours');
//   },
//   job: function() {
//     tirol().then(results => {
//       console.log('---------------------------------------------');
//       console.log('Harvested Tirol: ' + results.length);
//     });
//   }
// });

Meteor.startup(() => {
  //SyncedCron.start();
});
