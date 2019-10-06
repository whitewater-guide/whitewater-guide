import registerScreen from '../../../utils/registerScreen';

export const LazyAlreadyHaveScreen = registerScreen({
  require: () => require('./AlreadyHaveScreen'),
});
