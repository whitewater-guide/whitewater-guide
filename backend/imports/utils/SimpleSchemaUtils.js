import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export function formSchema(schema, ...omit) {
  if (omit && omit.length > 0) {
    schema = SimpleSchema.prototype.omit.apply(schema, omit);
  }
  return new SimpleSchema({
    data: {
      type: schema,
    },
    language: {
      type: String,
      optional: true,
    },
  });
}