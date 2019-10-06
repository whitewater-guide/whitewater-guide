import registerScreen from '../../../utils/registerScreen';

export const LazyRegisterScreen = registerScreen({
  require: () => require('./RegisterScreen'),
});
