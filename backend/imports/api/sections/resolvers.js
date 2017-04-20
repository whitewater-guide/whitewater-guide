import {Sections} from './collection';
import {Gauges} from '../gauges';
import {Rivers} from '../rivers';
import {Regions} from '../regions';
import {Media, upsertMedia, moveTempFiles} from '../media';
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
      gauge,
      ...section
    }
  } = data;
  let {_id: riverId, name: riverName, regionId} = river;
  if (riverId === '@@new') {
    riverId = Rivers.insertTranslations({name: riverName, regionId}, {[language]: {name: riverName}});
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

  const mediaIds = upsertMedia(media, language);
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
  if (gauge) {
    section.gaugeId = gauge._id;
  }

  if (_id)
    Sections.updateTranslations(_id, {[language]: section});
  else
    _id = Sections.insertTranslations(section);

  //If no error has been thrown to this point, move uploaded images to permanent location
  try {
    moveTempFiles(media);
  }
  catch (err){
    console.error('Some files failed to move from temp dir: ', err);
  }

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
      let selector = _.pick(terms, ['regionId', 'riverId']);
      if (terms.searchString) {
        const regex = new RegExp(terms.searchString, 'i');
        selector = {...selector, $or: [{name: regex}, {riverName: regex}]};
      }
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
      if (section.gaugeId) {
        const simpleResult = pickFromSelf(section, context, info, { _id: 'gaugeId' });
        return simpleResult || Gauges.findOne(section.gaugeId);
      }
      return null;
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
    hazardsTags:  section => section.hazardsTagIds   ? HazardTags.find({_id: {$in: section.hazardsTagIds}})     : [],
    miscTags:     section => section.miscTagIds     ? MiscTags.find({_id: {$in: section.miscTagIds}})         : [],
    seasonNumeric: section => section.seasonNumeric || [],
  },
  Mutation: {
    upsertSection,
    removeSection,
  },
};