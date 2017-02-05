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
    levelUnit: {
      type: String,
      label: 'Level measurement unit',//Leave empty if gauge does not harvest levels
      optional: true,
    },
    flowUnit: {
      type: String,
      label: 'Flow measurement unit',//Leave empty if gauge does not harvest flows
      optional: true,
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
    lastLevel: {
      type: Number,
      label: 'Last measured water level',
      optional: true,
      decimal: true,
    },
    lastFlow: {
      type: Number,
      label: 'Last measured water flow',
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
    const updates = prepareUpdates(this, data, 'en');
    return Gauges.insertTranslations(updates);
  }
});

export const editGauge = new AdminMethod({
  name: 'gauges.edit',

  validate: formSchema(GaugesSchema, 'enabled', 'sourceId').validator({clean: true}),

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
    const updates = prepareUpdates(this, data, language);
    return Gauges.updateTranslations(_id, {[language]: updates});
  }
});

function prepareUpdates(context, {location, ...updates}, language) {
  if (!location)
    return updates;
  location = upsertPoint._execute(context, {data: {...location, kind: 'gauge'}, language});
  return {...updates, location: _.omit(location, 'i18n', 'name', 'description')};
}

export const setEnabled = new AdminMethod({
  name: 'gauges.setEnabled',

  validate: new SimpleSchema({
    _id: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true},
    sourceId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true},
    enabled: {type: Boolean},
  }).validator(),

  run({enabled, ...query}) {
    //Server hook is used to start/stop jobs
    return Gauges.update(query, {$set: {enabled}}, {multi: true});
  }

});

export const removeGauges = new AdminMethod({
  name: 'gauges.remove',

  validate: new SimpleSchema({
    _id: {type: String, optional: true},
    sourceId: {type: String, optional: true},
    disabledOnly: {type: Boolean, optional: true},
  }).validator(),

  applyOptions: {
    noRetry: true,
  },

  run({disabledOnly, ...query}) {
    if (disabledOnly)
      query.enabled = false;
    return Gauges.remove(query);
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