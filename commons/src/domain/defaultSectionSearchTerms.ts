import { Durations } from './Durations';

export default {
  sortBy: 'name',
  sortDirection: 'ASC',
  searchString: '',
  difficulty: [1, 6],
  duration: [Durations[0].value, Durations[Durations.length - 1].value],
  rating: 0,
  seasonNumeric: [0, 23],
};
