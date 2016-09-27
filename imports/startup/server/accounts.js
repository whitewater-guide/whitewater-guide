import { Meteor } from 'meteor/meteor';
import {ServiceConfiguration} from 'meteor/service-configuration';

export default function setupAccounts() {
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
}