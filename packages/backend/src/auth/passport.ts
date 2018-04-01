import passport from 'koa-passport';
import FacebookWebStrategy from './facebook-web';

const usePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(FacebookWebStrategy);
};

export default usePassport;
