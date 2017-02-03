import _ from 'lodash';

export function meteorResolver(resolver){
  return function() {
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
    if (_.isFunction(result.fetch)) {
      return result.fetch();
    }
    else {
      return result;
    }
  }
}