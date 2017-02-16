import _ from 'lodash';
import graphqlFields from 'graphql-fields';
import {Meteor} from 'meteor/meteor';

export function meteorResolver(resolver) {
  return function () {
    //Problem #1
    //Arguments of queries and mutations do not have prototypes
    //It causes errors in meteor's validated methods and collections and SimpleSchema, etc.
    //So we deeply clone arguments so they have prototypes
    if (arguments.length > 1) {
      arguments[1] = _.cloneDeep(arguments[1]);
    }
    let result = resolver.apply(this, arguments);
    //Problem #2
    //If meteor's find returns undefined, but apollo wants nulls
    if (_.isUndefined(result))
      return null;
    //Problem #3
    //Sometimes I forget to call fetch()
    if (result && _.isFunction(result.fetch)) {
      return result.fetch();
    }
    else {
      return result;
    }
  }
}

export function adminResolver(resolver) {
  return function (root, args, context, info) {
    if (!context.isAdmin)
      throw new Meteor.Error('unauthorized', 'Access denied');
    return resolver(root, args, context, info);
  }
}

export function pickFromSelf(self, context, info, fieldsMap) {
  const result = {};
  const fields = _.keys(graphqlFields(info));
  for (let i = fields.length - 1; i >= 0; i--) {
    const field = fields[i];
    if (field === '__typename')
      continue;
    const selfField = fieldsMap[field];
    if (!selfField)
      return null;
    result[field] = self[selfField];
  }
  return result;
}