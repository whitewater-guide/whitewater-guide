import registerScreen from '../../../utils/registerScreen';

export const LazyResetScreen = registerScreen({
  require: () => require('./ResetScreen'),
});
