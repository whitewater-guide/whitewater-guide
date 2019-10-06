import registerScreen from '../../../utils/registerScreen';

export const LazySuccessScreen = registerScreen({
  require: () => require('./SuccessScreen'),
});
