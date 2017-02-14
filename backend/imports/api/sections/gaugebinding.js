import SimpleSchema from 'simpl-schema';

export const GaugeBindingSchema = new SimpleSchema({
  minimum: Number,
  maximum: Number,
  optimum: Number,
  impossible: Number,
  approximate: Boolean,
  lastTimestamp: Date,
  lastValue: Number,
}, {requiredByDefault: false});
