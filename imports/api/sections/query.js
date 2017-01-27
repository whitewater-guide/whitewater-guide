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
  return {
    selector: _.pick(terms, ['regionId', 'riverId']),
    options: {
      limit,
      sort: sortBy,
      fields: listFields,
      lang,
    }
  };
}