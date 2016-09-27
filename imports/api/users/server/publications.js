import {Meteor} from 'meteor/meteor';

Meteor.publish('userData', function() {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {id: 1, first_name: 1, last_name: 1}});
  } else {
    this.ready();
  }
});