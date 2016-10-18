import { Mongo } from 'meteor/mongo';

//Admin-only client-side collection with jobs count by source/gauge
export const ActiveJobsReport = new Mongo.Collection('activeJobsReport');