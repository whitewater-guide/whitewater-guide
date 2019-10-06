import registerScreen from '../../../utils/registerScreen';

export const LazyMainScreen = registerScreen({
  require: () => require('./AuthMainScreen'),
});
