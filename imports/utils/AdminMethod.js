import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

export default class AdminMethod extends ValidatedMethod {
  constructor(options) {
    //Include CallPromiseMixin by default in all admin methods
    if (Array.isArray(options.mixins)) {
      options.mixins = [...options.mixins, CallPromiseMixin];
    } else {
      options.mixins = [CallPromiseMixin];
    }

    const runMethod = options.run;

    options.run = function run() {
      if (Roles.userIsInRole(this.userId, 'admin'))
        return runMethod.apply(this, arguments);
      else
        throw new Meteor.Error(`${options.name}.unauthorized`, `You must be admin to run method ${options.name}`);
    };

    super(options);
  }
}