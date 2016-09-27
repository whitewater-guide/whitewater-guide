import { Meteor } from 'meteor/meteor';
import {ServiceConfiguration} from 'meteor/service-configuration';
import {Roles} from 'meteor/alanning:roles';

// Don't let people write arbitrary data to their 'profile' field from the client
Meteor.users.deny({
  update() {
    return true;
  },
});

ServiceConfiguration.configurations.upsert(
  { service: "facebook" },
  {
    $set: {
      appId: Meteor.settings.private.oAuth.facebook.appId,
      loginStyle: "popup",
      secret: Meteor.settings.private.oAuth.facebook.secret,
    }
  }
);

Meteor.users.after.insert(function (userId, user) {
  const { email } = user.services.facebook;
  if (Meteor.settings.private.admins.includes(email.toLowerCase())){
    Roles.addUsersToRoles(user._id, ['admin'], Roles.GLOBAL_GROUP);
  }
});