import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const MediaSchema = new SimpleSchema({
  url: {
    type: String,
    label: 'URL',
    regEx: SimpleSchema.RegEx.Url,
  },
  "type":{
    type: String,
    label: 'Type',
    allowedValues: ["photo","video","blog"],
  },
  description: {
    type: String,
    label: 'Description',
    optional: true,
  },
});