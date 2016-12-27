import {Meteor} from "meteor/meteor";
import {TAPi18n} from "meteor/tap:i18n";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {formSchema} from "../../utils/SimpleSchemaUtils";
import AdminMethod from "../../utils/AdminMethod";
import {Sources} from "../sources";
import {Measurements} from "../measurements";
import {Jobs} from "../jobs";
import cronParser from "cron-parser";
import {PointSchema, upsertPoint} from "../points";
import _ from 'lodash';

export const Gauges = new TAPi18n.Collection('gauges');

const GaugesI18nSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Gauge name',
    max: 200,
  },
});

const GaugesSchema = new SimpleSchema([
  GaugesI18nSchema,
  {
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    sourceId: {
      type: String,
      label: 'Gauge source',
      index: true,
    },
    code: {
      type: String,
      label: 'Unique code',
      max: 100,
      index: true,
    },
    location: {
      //Denormalize location here. Omit i18n props, which still can be obtained from Points collection
      type: PointSchema,
      optional: true,
    },
    unit: {
      type: String,
      defaultValue: 'cm',
      label: 'Measurement unit'
    },
    measurement: {
      type: String,
      defaultValue: 'Water level',
      label: 'Type of measurement',
    },
    requestParams: {
      type: Object,
      label: 'Additional API request parameters',
      optional: true,
      blackbox: true,
    },
    cron: {
      type: String,
      label: 'Cron expression',
      optional: true,
      custom: function () {
        if (this.value) {
          try {
            cronParser.parseExpression(this.value);
          }
          catch (e) {
            return 'notAllowed';
          }
        }
      },
    },
    lastTimestamp: {
      type: Date,
      label: 'Last measurement timestamp',
      optional: true,
    },
    lastValue: {
      type: Number,
      label: 'Last measured value',
      optional: true,
      decimal: true,
    },
    url: {
      type: String,
      label: 'URL',
      optional: true,
      regEx: SimpleSchema.RegEx.Url,
    },
    enabled: {
      type: Boolean,
      label: 'Enabled',
      defaultValue: false
    },
    i18n: {
      type: Object,
      optional: true,
      blackbox: true,
    },
  }
]);

Gauges.attachSchema(GaugesSchema);
Gauges.attachI18Schema(GaugesI18nSchema);

export const createGauge = new AdminMethod({
  name: 'gauges.create',

  validate: formSchema(GaugesSchema, "_id", "enabled").validator({clean: true}),

  applyOptions: {
    noRetry: true,
  },

  run({data}) {
    const updates = prepareUpdates(data, 'en');
    return Gauges.insertTranslations(updates);
  }
});

export const editGauge = new AdminMethod({
  name: 'gauges.edit',

  validate: formSchema(GaugesSchema, 'enabled').validator({clean: true}),

  applyOptions: {
    noRetry: true,
  },

  run({data: {_id, ...data}, language}) {
    const current = Gauges.findOne(_id);
    const hasJobs = Jobs.find({
        "data.gauge": _id,
        status: {$in: ['running', 'ready', 'waiting', 'paused']}
      }).count() > 0;
    //Cannot change harvest settings for already running script
    if (hasJobs && (data.cron !== current.cron)) {
      throw new Meteor.Error('gauges.edit.jobsRunning', 'Cannot edit gauge which has running jobs');
    }
    const updates = prepareUpdates(data, language);
    return Gauges.updateTranslations(_id, {[language]: updates});
  }
});

function prepareUpdates({location, ...updates}, language) {
  if (!location)
    return updates;
  location = upsertPoint.call({data: {...location, kind: 'gauge'}, language});
  return {...updates, location: _.omit(location, 'i18n', 'name', 'description')};
}

export const setEnabled = new AdminMethod({
  name: 'gauges.setEnabled',

  validate: new SimpleSchema({
    gaugeId: {type: String, regEx: SimpleSchema.RegEx.Id},
    enabled: {type: Boolean},
  }).validator(),

  run({gaugeId, enabled}) {
    //Server hook is used to start/stop jobs
    return Gauges.update(gaugeId, {$set: {enabled}});
  }

});

export const enableAll = new AdminMethod({
  name: 'gauges.enableAll',

  validate: new SimpleSchema({
    sourceId: {type: String, regEx: SimpleSchema.RegEx.Id},
  }).validator(),

  run({sourceId}) {
    //Server hook is used to start/stop jobs
    return Gauges.update({sourceId, enabled: false}, {$set: {enabled: true}}, {multi: true});
  }
});

export const removeGauge = new AdminMethod({
  name: 'gauges.remove',

  validate: new SimpleSchema({
    gaugeId: {type: String}
  }).validator(),

  applyOptions: {
    noRetry: true,
  },

  run({gaugeId}) {
    return Gauges.remove(gaugeId);
  },

});


export const removeAllGauges = new AdminMethod({
  name: 'gauges.removeAll',

  validate: new SimpleSchema({
    sourceId: {type: String}
  }).validator(),

  applyOptions: {
    noRetry: true,
  },

  run({sourceId}) {
    return Gauges.remove({sourceId});
  },

});

export const removeDisabledGauges = new AdminMethod({
  name: 'gauges.removeDisabled',

  validate: new SimpleSchema({
    sourceId: {type: String}
  }).validator(),

  applyOptions: {
    noRetry: true,
  },

  run({sourceId}) {
    return Gauges.remove({sourceId, enabled: false});
  },

});

Gauges.helpers({
  source(){
    return Sources.findOne(this.sourceId);
  },
  measurements() {
    return Measurements.find({gaugeId: this._id});
  },
});