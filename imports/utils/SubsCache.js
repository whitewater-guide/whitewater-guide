//Subs cache based on https://github.com/ccorcos/meteor-subs-cache
import _ from 'lodash';
import {ReactiveVar} from 'meteor/reactive-var';
import {Tracker} from 'meteor/tracker';
import {Meteor} from 'meteor/meteor';
import {EJSON} from 'meteor/ejson';
import {TAPi18n} from 'meteor/tap:i18n';

function hasCallbacks(args) {
  if (args.length > 0) {
    const lastArg = args[args.length - 1];
    return _.isFunction(lastArg) || (lastArg && _.some([lastArg.onReady, lastArg.onError, lastArg.onStop], _.isFunction));
  }
  else {
    return false;
  }
}

function withoutCallbacks(args) {
  if (hasCallbacks(args)) {
    return _.dropRight(args);
  }
  else {
    return args;
  }
}

function callbacksFromArgs(args) {
  if (hasCallbacks(args)) {
    if (_.isFunction(args[args.length - 1])) {
      return {onReady: args[args.length - 1]};
    }
    else {
      return args[args.length - 1];
    }
  }
  else {
    return {};
  }
}

class SubsCache {
  static caches = [];

  expireAfter = 5;
  cacheLimit = 10;
  cache = {};
  allReady = new ReactiveVar(true);
  allReadyComp = null;
  subscriptionFunc = Meteor.subscribe;
  subscriptionThis = Meteor;

  constructor(options = {}) {
    let {expireAfter, cacheLimit, subscriptionFunc, subscriptionThis} = options;
    if (_.isNumber(expireAfter))
      this.expireAfter = expireAfter;
    if (_.isNumber(cacheLimit) && cacheLimit > 0)
      this.cacheLimit = cacheLimit;
    if (_.isFunction(subscriptionFunc) && subscriptionThis) {
      this.subscriptionFunc = subscriptionFunc;
      this.subscriptionThis = subscriptionThis;
    }

    SubsCache.caches.push(this);
  }

  ready = () => this.allReady.get();

  onReady = (callback) => {
    Tracker.autorun(c => {
      if (this.ready()) {
        c.stop();
        callback();
      }
    });
  };

  static clearAll = () => _.map(SubsCache.caches, s => s.clear());

  clear = () => {
    _.values(this.cache).map(sub => sub.stopNow());
  };

  subscribe = (...args) => {
    return this.subscribeFor.apply(this, [this.expireAfter, ...args]);
  };

  subscribeFor = (expireTime, ...args) => {
    if (Meteor.isServer) {
      return this.subscriptionFunc.apply(this.subscriptionThis, args);
    }
    else {
      let hash = EJSON.stringify(withoutCallbacks(args));
      let cache = this.cache;
      if (hash in cache) {
        // if we find this subscription in the cache, then rescue the callbacks
        // and restart the cached subscription
        if (hasCallbacks(args)) {
          cache[hash].addHooks(callbacksFromArgs(args));
        }
        cache[hash].restart();
      }
      else {
        // create an object to represent this subscription in the cache
        const cachedSub = new CachedSub({
          hash,
          expireTime: this.expireAfter,
          stopCallback: () => {
            delete cache[hash]
          },
        });

        //create the subscription, giving it callbacks that call our stored hooks
        let newArgs = withoutCallbacks(args);
        newArgs.push({
          onError: cachedSub.makeCallHooksFn('onError'),
          onStop: cachedSub.makeCallHooksFn('onStop')
        });
        cachedSub.sub = Tracker.nonreactive(() => this.subscriptionFunc.apply(this.subscriptionThis, newArgs));
        if (hasCallbacks(args))
          cachedSub.addHooks(callbacksFromArgs(args));

        //delete the oldest subscription if the cache has overflown
        if (this.cacheLimit > 0) {
          const allSubs = _.sortBy(_.values(cache), 'when');
          const numSubs = allSubs.length;
          if (numSubs >= this.cacheLimit) {
            const needToDelete = numSubs - this.cacheLimit + 1;
            _.times(needToDelete, i => allSubs[i].stopNow());
          }
        }

        cache[hash] = cachedSub;
        cachedSub.start();

        // reactively set the allReady reactive variable
        if (this.allReadyComp)
          this.allReadyComp.stop();
        Tracker.autorun(c => {
          this.allReadyComp = c;
          const subs = _.values(this.cache);
          if (subs.length > 0)
            this.allReady.set(_.every(subs, s => s.ready()));
        });
      }
      return cache[hash];
    }
  };
}

class CachedSub {
  sub = null;
  hash = null;
  compsCount = 0;
  timerId = null;
  expireTime = 10;
  when = null;
  hooks = [];
  stopCallback = null;

  constructor(options) {
    this.hash = options.hash;
    this.expireTime = options.expireTime;
    this.stopCallback = options.stopCallback;
  }

  ready = () => this.sub.ready();

  onReady = (callback) => {
    if (this.ready()) {
      Tracker.nonreactive(() => callback());
    }
    else {
      Tracker.autorun(c => {
        if (this.ready()) {
          c.stop();
          Tracker.nonreactive(() => callback());
        }
      });
    }
  };

  addHooks = (callbacks) => {
    // this.onReady has the correct behaviour for new onReady callbacks, the
    // rest are stored for calling later
    if (_.isFunction(callbacks.onReady)) {
      this.onReady(callbacks.onReady);
      delete callbacks.onReady;
    }
    this.hooks.push(callbacks);
  };

  makeCallHooksFn = (hookName) => {
    // returns a function that passes its this argument and arguments list
    // to each of the hooks with the given name
    let cachedSub = this;
    return function callHooks() {
      let originalThis = this;
      let originalArgs = arguments;
      _.forEach(cachedSub.hooks, hookDict => {
        if (_.isFunction(hookDict[hookName])) {
          hookDict[hookName].apply(originalThis, originalArgs);
        }
      });
    };
  };

  start = () => {
    // so we know what to throw out when the cache overflows
    this.when = Date.now();
    // we need to count the number of computations that have called
    // this subscription so that we don't release it too early
    this.compsCount += 1;
    //if the computation stops, then delayedStop
    let c = Tracker.currentComputation;
    if (c)
      c.onInvalidate(() => this.delayedStop());
  };

  stop = () => this.delayedStop();

  delayedStop = () => {
    if (this.expireTime >= 0)
      this.timerId = setTimeout(this.stopNow, this.expireTime * 1000 * 60);
  };

  restart = () => {
    clearTimeout(this.timerId);
    this.start();
  };

  stopNow = () => {
    this.compsCount -= 1;
    if (this.compsCount <= 0) {
      this.sub.stop();
      this.stopCallback();
    }
  };
}

export const i18nSubsCache = new SubsCache({
  expireAfter: 10,
  cacheLimit: -1,
  subscriptionFunc: TAPi18n.subscribe,
  subscriptionThis: TAPi18n
});
export const subsCache = new SubsCache({expireAfter: 10, cacheLimit: -1});