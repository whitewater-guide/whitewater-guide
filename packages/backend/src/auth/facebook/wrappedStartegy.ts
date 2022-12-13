import express from 'express';
import passport from 'passport-strategy';

import classicStrategy from './classicStrategy';
import limitedStrategy from './limitedStrategy';

// This is a wrapper around old facebook token strategy (used on Android)
// and limited ios auth strategy (https://github.com/thebergamo/react-native-fbsdk-next#limited-login-ios)
class WrappedFacebookStrategy extends passport.Strategy {
  public authenticate(req: express.Request, options?: unknown): unknown {
    // select which strategy to use based on whether we have 'access_token' (old, andoid) or 'auth_token' (new, limited, ios)
    const delegate = ('auth_token' in req.query
      ? limitedStrategy
      : classicStrategy) as any as passport.Strategy;
    delegate.success = this.success.bind(delegate);
    delegate.fail = this.fail.bind(delegate);
    delegate.redirect = this.redirect.bind(delegate);
    delegate.pass = this.pass.bind(delegate);
    delegate.error = this.error.bind(delegate);
    return delegate.authenticate(req, options); //
  }
}

export const facebookStrategy = new WrappedFacebookStrategy();
