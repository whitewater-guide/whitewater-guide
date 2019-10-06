import registerScreen from '../../../utils/registerScreen';

export const LazySignInScreen = registerScreen({
  require: () => require('./SignInScreen'),
});
