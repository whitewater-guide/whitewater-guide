import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import _ from 'lodash';

export default {
  Query: {
    me: (root, args, context) => {
      if (!context.userId)
        return null;
      return Meteor.users.findOne(context.userId);
    },
    listUsers: (root, args, context) => {
      if (!Roles.userIsInRole(context.user, ['super-admin']))
        throw new Meteor.Error(403, "Not authorized to manage users");
      return Meteor.users.find({}).fetch();
    }
  },
  User: {
    email: (root) => _.get(root, 'services.facebook.email', ''),
    profile: (root) => _.get(root, 'services.facebook'),
    roles: (root) => _.get(root, 'roles.__global_roles__', []),
  },
  Mutation: {
    toggleAdmin: (root, {_id, isAdmin}, context) => {
      if (!Roles.userIsInRole(context.user, ['super-admin']))
        throw new Meteor.Error(403, "Not authorized to manage users");
      if (!Roles.userIsInRole(_id, ['super-admin'])) {//Cannot affect other super-admin
        if (isAdmin)
          Roles.addUsersToRoles(_id, 'admin', Roles.GLOBAL_GROUP);
        else
          Roles.removeUsersFromRoles([_id], ['admin'], Roles.GLOBAL_GROUP);
      }
      return Meteor.users.findOne(_id);
    }
  }
}