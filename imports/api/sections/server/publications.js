import {Meteor} from 'meteor/meteor';
import {Sections} from '../index';
import {Rivers} from '../../rivers';
import {Gauges} from '../../gauges';
import {Media} from '../../media';
import {Points} from '../../points';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Roles} from 'meteor/alanning:roles';
import {SupplyTags, KayakingTags, HazardTags, MiscTags} from '../../tags';
import {TAPi18n} from 'meteor/tap:i18n';
import {Counts} from 'meteor/tmeasday:publish-counts';
import {listQuery} from '../query';

Meteor.publishComposite('sections.list', function (terms, lang) {
  const query = listQuery(terms, lang);

  return {
    find: function () {
      Counts.publish(this, `counter.sections.current`, Sections.find(query.selector), {noReady: true});
      return Sections.find(query.selector, query.options);
    },

    children: [
      //River
      {
        find: function (sectionDoc) {
          return Rivers.find(sectionDoc.riverId, {limit: 1, lang, fields: {name: 1}});
        }
      },
      //Gauge
      {
        find: function (section) {
          return Gauges.find(section.gaugeId, {limit: 1, lang, fields: {name: 1}});
        }
      }
    ]
  }
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
 * Takes two arguments
 * - sectionId - if we need to edit existing section, undefined for new section
 * - riverId - if we need to add new section to this river, undefined otherwise
 */
Meteor.publishComposite('sections.edit', function (sectionId, riverId, lang) {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');

  // new SimpleSchema({
  //   riverId: {type: String}
  // }).validate({ riverId });

  if (!isAdmin) {
    return {
      find(){
        return null;
      }
    };
  }

  const publishAuxiliaryData = {
    find(sectionDoc){
      return Rivers.find(sectionDoc ? sectionDoc.riverId : riverId, {limit: 1, fields: {name: 1, regionId: 1}, lang});
    },
    children: [
      {
        find(riverDoc){//Finds river->region->sources
          const region = riverDoc.region().fetch();
          return region[0].sources();
        },
        children: [
          {
            find(sourceDoc){//Now find gauges
              return sourceDoc.gauges({name: 1});
            }
          }
        ]
      },
      {
        find(){
          return SupplyTags.find({});
        }
      },
      {
        find(){
          return KayakingTags.find({});
        }
      },
      {
        find(){
          return HazardTags.find({});
        }
      },
      {
        find(){
          return MiscTags.find({});
        }
      },
    ]
  };

  if (sectionId) {
    return {
      find(){
        return Sections.find(sectionId, {limit: 1, lang});
      },
      children: [
        publishAuxiliaryData,
        {
          find(sectionDoc){
            return Media.find({_id: {$in: sectionDoc.mediaIds}}, {lang});
          }
        },
        {
          find(sectionDoc){
            const pois = sectionDoc.poiIds || [];
            return Points.find({_id: {$in: [...pois, sectionDoc.putInId, sectionDoc.takeOutId]}}, {lang});
          }
        },
      ],
    };
  }
  else {
    return publishAuxiliaryData;
  }
});