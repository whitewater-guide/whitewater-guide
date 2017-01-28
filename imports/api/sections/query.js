import _ from 'lodash';

const listFields = {
  name: 1,
  riverName: 1,
  difficulty: 1,
  difficultyXtra: 1,
  rating: 1,
  drop: 1,
  distance: 1,
  duration: 1,
};

export function listQuery(terms, lang = null){
  let {sortBy, sortDirection, limit} = terms;
  sortDirection = sortBy ? sortDirection.toLowerCase() : 'asc';
  limit = _.isNumber(limit) ? limit : 25;
  sortBy = (!sortBy || sortBy === 'name') ?
    [['riverName', sortDirection], ['name', sortDirection]] :
    [[sortBy, sortDirection]];
  const selector = _.pick(terms, ['regionId', 'riverId']);
  return {
    selector,
    options: {
      limit,
      sort: sortBy,
      fields: {...listFields, ..._.mapValues(selector, () => 1)},//Fields must include selector for client-side filtering
      lang,
    }
  };
}

const mapFields = {
  name: 1,
  riverName: 1,
  putIn: 1,
  takeOut: 1,
  difficulty: 1,
  difficultyXtra: 1,
  rating: 1,
};

export function mapQuery(terms, lang = null){
  const selector = _.pick(terms, ['regionId', 'riverId']);
  return {
    selector,
    options: {
      fields: {...mapFields, ..._.mapValues(selector, () => 1)},//Fields must include selector for client-side filtering
      lang,
    }
  };
}