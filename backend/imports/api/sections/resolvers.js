import {Sections} from './collection';
import {Gauges} from '../gauges';
import {Rivers} from '../rivers';
import {Regions} from '../regions';
import {Media} from '../media';
import {Points} from '../points';
import {HazardTags, KayakingTags, MiscTags, SupplyTags} from '../tags';
import graphqlFields from 'graphql-fields';
import {pickFromSelf} from '../../utils/ApolloUtils';
import {upsertChildren} from '../../utils/CollectionUtils';
import _ from 'lodash';

function removeSection(root, {_id}) {
  return Sections.remove(_id) > 0;
}

function upsertSection(root, data) {
  let {
    language,
    section: {
      _id,
      river,
      media = [],
      pois = [],
      supplyTags = [],
      kayakingTags = [],
      hazardsTags = [],
      miscTags = [],
    ...section
    }
  } = data;
  let {_id: riverId, name: riverName, regionId} = river;
  if (riverId === '@@new') {
    riverId = Rivers.insertTranslations({[language]: {name: riverName, regionId}});
    section = {...section, riverId, riverName, regionId};
  }
  else {
    const riverDoc = Rivers.findOne({_id: riverId}, {fields: {regionId: 1, name: 1}});
    if (riverDoc) {
      section.regionId = riverDoc.regionId;
      section.riverName = riverDoc.name;
      section.riverId = riverDoc._id;
    }
  }

  const mediaIds = upsertChildren(Media, media, language);
  const poiIds = upsertChildren(Points, pois, language);
  const supplyTagIds = _.map(supplyTags, '_id');
  const kayakingTagIds = _.map(kayakingTags, '_id');
  const hazardsTagIds = _.map(hazardsTags, '_id');
  const miscTagIds = _.map(miscTags, '_id');

  let {_id: putInId, ...putInData} = section.putIn;
  let putInResult = Points.upsertTranslations(putInId, {[language]: {...putInData, kind: 'put-in'}});
  putInId = putInId || putInResult.insertedId;
  let {_id: takeOutId, ...takeOutData} = section.takeOut;
  let takeOutResult = Points.upsertTranslations(takeOutId, {[language]: {...takeOutData, kind: 'take-out'}});
  takeOutId = takeOutId || takeOutResult.insertedId;

  section = {
    ...section,
    mediaIds,
    poiIds,
    supplyTagIds,
    kayakingTagIds,
    hazardsTagIds,
    miscTagIds,
    putIn: {_id: putInId, ...putInData, kind: 'put-in'},
    takeOut: {_id: takeOutId, ...takeOutData, kind: 'take-out'},
  };

  if (_id)
    Sections.updateTranslations(_id, {[language]: section});
  else
    _id = Sections.insertTranslations(section);
  return Sections.findOne(_id);
}

export const sectionsResolvers = {
  Query: {
    sections: (root, {terms, language}, context, info) => {
      //TODO: this can be refactored into graphql schema interface
      //and resolver wrapper for all other similar searches
      const query = graphqlFields(info);
      let fields = _.mapValues(query.sections, _.constant(1));
      //Add this for simple field resolvers
      fields = {...fields, riverId: 1, riverName: 1, regionId: 1, gaugeId: 1};
      let {sortBy, sortDirection = 'asc', skip = 0, limit = 10} = terms;
      limit = _.clamp(limit, 10, 100);
      const sort = (!sortBy || sortBy === 'name') ?
        [['riverName', sortDirection], ['name', sortDirection]] :
        [[sortBy, sortDirection]];
      const selector = _.pick(terms, ['regionId', 'riverId']);
      let result = {
        sections: Sections.find(selector, {fields, sort, skip, limit, lang: language}).fetch()
      };
      if (query.hasOwnProperty('count'))
        result.count = Sections.find(selector, {fields: {_id: 1}}).count();

      return result;
    },
    section: (root, {_id, language}) => Sections.findOne({_id}, {lang: language}),
  },
  Section: {
    gauge: (section, args, context, info) => {
      const simpleResult = pickFromSelf(section, context, info, {_id: 'gaugeId'});
      return simpleResult || section.gaugeId && Gauges.findOne(section.gaugeId);
    },
    region: (section, args, context, info) => {
      const simpleResult = pickFromSelf(section, context, info, {_id: 'regionId'});
      return simpleResult || section.regionId && Regions.findOne(section.regionId);
    },
    river: (section, args, context, info) => {
      const simpleResult = pickFromSelf(section, context, info, {_id: 'riverId', name: 'riverName'});
      return simpleResult || section.riverId && Rivers.findOne(section.riverId);
    },
    media: section => Media.find({_id: {$in: section.mediaIds}}),
    pois: section => Points.find({_id: {$in: section.poiIds}}),
    supplyTags:   section => section.supplyTagIds   ? SupplyTags.find({_id: {$in: section.supplyTagIds}})     : [],
    kayakingTags: section => section.kayakingTagIds ? KayakingTags.find({_id: {$in: section.kayakingTagIds}}) : [],
    hazardsTags:  section => section.hazardTagIds   ? HazardTags.find({_id: {$in: section.hazardTagIds}})     : [],
    miscTags:     section => section.miscTagIds     ? MiscTags.find({_id: {$in: section.miscTagIds}})         : [],
  },
  Mutation: {
    upsertSection,
    removeSection,
  },
};