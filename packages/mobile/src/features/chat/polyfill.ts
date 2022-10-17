// @ts-ignore
import { EventEmitter } from 'fbemitter';
// import unorm from 'unorm';

// String.prototype.normalize = function (form) {
//   return require('unorm')[String(form).toLowerCase()](this);
// };

//
if (!Promise.allSettled) {
  Promise.allSettled = (promises: Promise<unknown>[]): any => {
    return Promise.all(
      promises.map((promise) =>
        promise
          .then((value) => ({ state: 'fulfilled', value }))
          .catch((reason) => ({ state: 'rejected', reason })),
      ),
    );
  };
}

class Document {
  emitter: any;

  constructor() {
    this.emitter = new EventEmitter();
    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
    this._checkEmitter = this._checkEmitter.bind(this);
  }

  createElement() {
    return {};
  }

  _checkEmitter() {
    if (
      !this.emitter ||
      !(
        this.emitter.on ||
        this.emitter.addEventListener ||
        this.emitter.addListener
      )
    ) {
      this.emitter = new EventEmitter();
    }
  }

  addEventListener(eventName: string, listener: any) {
    this._checkEmitter();
    if (this.emitter.on) {
      this.emitter.on(eventName, listener);
    } else if (this.emitter.addEventListener) {
      this.emitter.addEventListener(eventName, listener);
    } else if (this.emitter.addListener) {
      this.emitter.addListener(eventName, listener);
    }
  }

  removeEventListener(eventName: string, listener: any) {
    this._checkEmitter();
    if (this.emitter.off) {
      this.emitter.off(eventName, listener);
    } else if (this.emitter.removeEventListener) {
      this.emitter.removeEventListener(eventName, listener);
    } else if (this.emitter.removeListener) {
      this.emitter.removeListener(eventName, listener);
    }
  }
}

window.document = window.document || new Document();
