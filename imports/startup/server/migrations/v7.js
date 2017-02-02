import {Roles} from 'meteor/alanning:roles';
import {Meteor} from 'meteor/meteor';

//Make all current admin super-admins
export default {
  version: 7,
  up: function migration7up() {
    Meteor.users.find({}).forEach(user => {
      const { email } = user.services.facebook;

      if (Meteor.settings.private.admins.includes(email.toLowerCase())){
        Roles.addUsersToRoles(user._id, ['admin', 'super-admin'], Roles.GLOBAL_GROUP);
      }
    });

    return true;
  }
}