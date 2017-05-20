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
import { Durations } from '../../commons/domain';
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

  section = {
    ...section,
    mediaIds,
    poiIds,
    supplyTagIds,
    kayakingTagIds,
    hazardsTagIds,
    miscTagIds,
  };
  if (section.flows){
    section.flows.approximate = !!section.flows.approximate;// Force from null to false
  }
  if (section.levels){
    section.levels.approximate = !!section.levels.approximate;// Force from null to false
  }
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

function applyFilters(selector, searchTerms) {
  const { difficulty, duration, searchString, seasonNumeric, rating } = searchTerms;
  let result = selector;
  if (searchString && searchString !== '') {
    const regex = new RegExp(searchString, 'i');
    result = {...result, $or: [{name: regex}, {riverName: regex}]};
  }
  if (difficulty && difficulty.length === 2 && !(difficulty[0] === 1 && difficulty[1] === 6)) {
    result = {...result, difficulty: {$gte: difficulty[0], $lte: difficulty[1]}};
  }
  //TODO: fix - has some half-months that fall inside this range
  if (seasonNumeric && seasonNumeric.length === 2 && !(seasonNumeric[0] === 0 && seasonNumeric[1] === 23)) {
    result = {...result, seasonNumeric: {$elemMatch: {$gte: seasonNumeric[0], $lte: seasonNumeric[1]}}};
  }
  if (duration && duration.length === 2 && !(duration[0] === Durations[0].value && difficulty[1] === Durations[Durations.length-1].value)) {
    result = {...result, duration: {$gte: duration[0], $lte: duration[1]}};
  }
  if (rating && rating !== 0) {
    result = {...result, rating: {$gte: rating}};
  }
  return result;
}

export const sectionsResolvers = {
  Query: {
    sections: (root, {terms, language, skip = 0, limit = 10}, context, info) => {
      //TODO: this can be refactored into graphql schema interface
      //and resolver wrapper for all other similar searches
      const query = graphqlFields(info);
      let fields = _.mapValues(query.sections, _.constant(1));
      //Add this for simple field resolvers
      fields = {...fields, riverId: 1, riverName: 1, regionId: 1, gaugeId: 1, shape: 1};
      let {sortBy, sortDirection = 'asc'} = terms;
      limit = _.clamp(limit, 10, 100);
      const sort = (!sortBy || sortBy === 'name') ?
        [['riverName', sortDirection], ['name', sortDirection]] :
        [[sortBy, sortDirection]];
      let selector = _.pick(terms, ['regionId', 'riverId']);
      selector = applyFilters(selector, terms);
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
    putIn: ({_id, shape}) => ({_id: `${_id}_putIn`, kind: 'put-in', coordinates: shape[0]}),
    takeOut: ({_id, shape}) => ({_id: `${_id}_takeOut`, kind: 'take-out', coordinates: shape[shape.length - 1]}),
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
  Subscription: {
    measurementsUpdated: sections => sections,
  },
};