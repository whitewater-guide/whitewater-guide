import registerScreen from '../../../utils/registerScreen';

export const LazyWelcomeScreen = registerScreen({
  require: () => require('./WelcomeScreen'),
});
