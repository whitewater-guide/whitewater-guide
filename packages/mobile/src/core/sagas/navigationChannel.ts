import { NavigationAction, NavigationDispatch } from 'react-navigation';
import { Channel, END } from 'redux-saga';

class NavigationChannel implements Channel<NavigationAction> {
  private _dispatch?: NavigationDispatch;

  set dispatch(value: NavigationDispatch) {
    this._dispatch = value;
  }

  put = (message: NavigationAction | END) => {
    if (message === END) {
      throw new Error('Cannot end NavigationChannel');
    }
    if (this._dispatch) {
      this._dispatch(message as any);
    } else {
      console.warn('NavigationChannel dispatch not set');
      // throw new Error('NavigationChannel dispatch not set');
    }
  };

  take(): void {
    throw new Error('NavigationChannel take not implemented');
  }

  flush(): void {
    throw new Error('NavigationChannel flush not implemented');
  }

  close(): void {
    throw new Error('NavigationChannel close not implemented');
  }
}

export const navigationChannel = new NavigationChannel();
