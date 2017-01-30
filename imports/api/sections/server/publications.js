import {Meteor} from "meteor/meteor";
import {Sections} from "../index";
import {Rivers} from "../../rivers";
import {Regions} from "../../regions";
import {Media} from "../../media";
import {Points} from "../../points";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Roles} from "meteor/alanning:roles";
import {TAPi18n} from "meteor/tap:i18n";
import {Counts} from "meteor/tmeasday:publish-counts";
import {listQuery, mapQuery} from "../query";
import {ValidationError} from 'meteor/mdg:validation-error';

TAPi18n.publish('sections.list', function (terms, lang) {
  const query = listQuery(terms, lang);
  Counts.publish(this, `counter.sections.current`, Sections.find(query.selector), {noReady: true});
  return Sections.find(query.selector, query.options);
});

TAPi18n.publish('sections.map', function (terms, lang) {
  const query = mapQuery(terms, lang);
  const result = [Sections.find(query.selector, query.options)];
  if (query.selector.regionId) {
    result.push(Regions.find({_id: query.selector.regionId}, {fields: {name: 1, bounds: 1}, limit: 1}));
  }
  return result;
});


TAPi18n.publish('sections.details', function (sectionId) {
  if (!sectionId)
    return this.ready();

  new SimpleSchema({
    sectionId: {type: String}
  }).validate({sectionId});

  return Sections.find(sectionId);
});

/**
 *
 * Everything we need in 'New Section' and 'Edit Section` forms:
 * - Name of the river where we add this section;
 * - List of gauges, found by river->region->sources->gauges
 * - List of tags
 * Takes three arguments, only one will be present
 * - sectionId - if we need to edit existing section, undefined for new section
 * - riverId - if we need to add new section to this river, undefined otherwise
 * - regionId - if we need to create new section in this region
 */
Meteor.publishComposite('sections.edit', function ({sectionId, riverId, regionId}, lang) {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');

  new SimpleSchema({
    sectionId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true},
    riverId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true},
    regionId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true},
  }).validate({riverId});

  if (!sectionId && !riverId && !regionId) {
    throw new ValidationError([], 'One of [sectionId, riverId, regionId] is required');
  }

  if (!isAdmin) {
    return {
      find(){
        return null;
      }
    };
  }

  const publishRiverData = {
    find(sectionDoc){
      return Rivers.find(sectionDoc ? sectionDoc.riverId : riverId, {limit: 1, fields: {name: 1, regionId: 1}, lang});
    },
    children: [
      {
        find(riverDoc){//Finds river->region->sources
          return riverDoc.region({name: 1, bounds: 1});
        },
        children: [
          {
            find(regionDoc){
              return regionDoc.sources();
            },
            children: [
              {
                find(sourceDoc){
                  return sourceDoc.gauges({name: 1});
                }
              }
            ]
          }
        ]
      },
    ]
  };

  if (sectionId) {
    return {
      find(){
        return Sections.find(sectionId, {limit: 1, lang});
      },
      children: [
        publishRiverData,
        {
          find(sectionDoc){
            return Media.find({_id: {$in: sectionDoc.mediaIds}}, {lang});
          }
        },
        {
          find(sectionDoc){
            const pois = sectionDoc.poiIds || [];
            return Points.find({_id: {$in: [...pois]}}, {lang});
          }
        },
      ],
    };
  }
  else if (riverId) {
    return publishRiverData;
  }
  else if (regionId) {
    return {
      find() {
        return Regions.find({_id: regionId}, {limit: 1, fields: {name: 1, bounds: 1}});
      },
      children: [
        {
          find(regionDoc){
            return regionDoc.sources();
          },
          children: [
            {
              find(sourceDoc){
                return sourceDoc.gauges({name: 1});
              }
            }
          ]
        },
        {
          find(){
            return Rivers.find({regionId}, {fields: {name: 1, regionId: 1}}, {sort: {name: 1}});
          }
        }
      ]

    }
  }
});