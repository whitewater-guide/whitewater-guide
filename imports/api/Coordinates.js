import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const LocationSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  "type":{
    type: String,
    allowedValues: ["Point"],
    defaultValue: "Point",
  },
  coordinates: {
    type: [Number],
    label: 'Longitude & Latitude',
    decimal: true,
    minCount: 2,
    maxCount: 2,
    custom: function(){
      if (this.value[0] >= 90 || this.value[0] <= -90)
        return "lonOutOfRange" ;
      if (this.value[1] >= 180 || this.value[1] <= -180)
        return "latOutOfRange" ;
    }
  },
  altitude: {
    type: Number,
    label: 'Altitude',
    decimal: true,
    optional: true,
  },
});

LocationSchema.messages = {
  lonOutOfRange: 'Longitude out of range', // Must be between -90 and 90
  latOutOfRange: 'Latitude out of range' // Must be between -180 and 180
};