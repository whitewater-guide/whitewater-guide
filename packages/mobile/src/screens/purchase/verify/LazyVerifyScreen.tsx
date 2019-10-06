import registerScreen from '../../../utils/registerScreen';

export const LazyVerifyScreen = registerScreen({
  require: () => require('./VerifyScreen'),
});
