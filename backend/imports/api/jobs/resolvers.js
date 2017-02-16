import {Jobs} from './index';

export const jobsResolvers = {
  Query: {
    jobs: (root, {sourceId}, context) => {
      if (!context.isAdmin)
        return [];
      return Jobs.find({"data.sourceId": sourceId}, {fields: {data: 1, status: 1, updated: 1, after: 1, result: 1}});
    },
    jobsReport: (root, {sourceId}, context) => {
      if (!context.isAdmin)
        return [];
      let match = { type: 'harvest', status: { $in: ['running', 'ready', 'waiting'] } };
      if (sourceId)
        match["data.sourceId"] = sourceId;
      const project = sourceId ? { gaugeId: "$data.gaugeId" } : { sourceId: "$data.sourceId" };
      const group = sourceId ? { _id: "$gaugeId", count: { $sum: 1 } } : { _id: "$sourceId", count: { $sum: 1 } };
      const pipeline = [{ $match: match }, { $project: project }, { $group: group }];
      return Jobs.aggregate(pipeline);
    },
  }
};