import { Meteor } from 'meteor/meteor';
import { Jobs } from '../index';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';

Meteor.publish('jobs.forSource', function (sourceId) {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  if (!isAdmin)
    return this.ready();
  new SimpleSchema({
    sourceId: {type: String}
  }).validate({ sourceId });

  return Jobs.find({"data.sourceId": sourceId}, { fields: { data: 1, status: 1, updated: 1, after: 1, result: 1 } });
});

Meteor.publish('jobs.activeReport', function (sourceId) {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  if (!isAdmin)
    return this.ready();
  const observeSelector = sourceId ? { type: 'harvest', "data.sourceId": sourceId } : { type: 'harvest' };
  let match = { type: 'harvest', status: { $in: ['running', 'ready', 'waiting'] } };
  if (sourceId)
    match["data.sourceId"] = sourceId;
  const project = sourceId ? { gaugeId: "$data.gaugeId" } : { sourceId: "$data.sourceId" };
  const group = sourceId ? { _id: "$gaugeId", count: { $sum: 1 } } : { _id: "$sourceId", count: { $sum: 1 } };
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