import SimpleSchema from 'simpl-schema';

export function metaSchema() {
  return {
    createdAt: {
      type: Date,
      autoValue: function() {
        if (this.isInsert)
          return new Date();
      },
      denyUpdate: true,
    },
    updatedAt: {
      type: Date,
      autoValue: function() {
        if (this.isUpdate) {
          return new Date();
        }
      },
      denyInsert: true,
    },
    createdBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      autoValue: function() {
        if (this.isInsert)
          return this.userId;
      },
      denyUpdate: true,
    },
    i18n: {
      type: Object,
      optional: true,
      blackbox: true,
    },
  };
}