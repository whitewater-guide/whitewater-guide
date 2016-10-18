import { Meteor } from 'meteor/meteor';
import { Jobs } from '../index';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';

Meteor.publish('jobs.all', function() {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  if (!isAdmin)
    return this.ready();
  return Jobs.find({});
});

Meteor.publish('jobs.forSource', function (source) {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  if (!isAdmin)
    return this.ready();
  new SimpleSchema({
    source: {type: String}
  }).validate({ source });

  return Jobs.find({"data.source": source});
});

Meteor.publish('jobs.activeReport', function (source) {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  if (!isAdmin)
    return this.ready();
  const observeSelector = source ? { type: 'harvest', "data.source": source } : { type: 'harvest' };
  let match = { type: 'harvest', status: { $in: ['running', 'ready', 'waiting'] } };
  if (source)
    match["data.source"] = source;
  const project = source ? { gauge: "$data.gauge" } : { source: "$data.source" };
  const group = source ? { _id: "$gauge", count: { $sum: 1 } } : { _id: "$source", count: { $sum: 1 } };
  ReactiveAggregate(
    this,
    Jobs,
    [{ $match: match }, { $project: project }, { $group: group }],
    {
      observeSelector,
      observeOptions: { fields: { status: 1, data: 1 } },
      clientCollection: 'activeJobsReport'
    }
  );
});