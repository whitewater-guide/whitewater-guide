import { Meteor } from 'meteor/meteor';
import {ServiceConfiguration} from 'meteor/service-configuration';
import {Accounts} from 'meteor/accounts-base';
import {Roles} from 'meteor/alanning:roles';
import {Random} from 'meteor/random';

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

Accounts.onCreateUser((options, user) => {
  if (! user.services.facebook) {
    throw new Error('Expected login with Facebook only.');
  }
  const { first_name, last_name, email, id } = user.services.facebook;

  if (Meteor.settings.private.admins.includes(email.toLowerCase())){
    user._id = Random.id();
    user.first_name = first_name;
    user.last_name = last_name;
    user.id = id;

    Roles.addUsersToRoles(user._id, 'admin', Roles.GLOBAL_GROUP);
  }

  return user;
});