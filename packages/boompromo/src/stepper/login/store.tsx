import noop from 'lodash/noop';
import { computed, flow, observable } from 'mobx';
import { FacebookProfile, getLoginStatus, getMyFacebookProfile, loadFacebookSDK, login, logout } from '../../auth/fb';
import { wwLogin } from '../../auth/ww';
import { ILoginStepStore } from './types';

export class LoginStepStore implements ILoginStepStore {
  private accessToken: string | null = null;

  @observable error: string | null = null;
  // tslint:disable-next-line:typedef
  @observable loading = false;
  // tslint:disable-next-line:typedef
  @observable facebookLoading = false;
  @observable me: FacebookProfile | null = null;

  @computed get ready() {
    return !!this.me;
  }

  // tslint:disable-next-line:typedef
  init = flow(function *init(this: LoginStepStore) {
    this.facebookLoading = true;
    this.loading = false;
    yield loadFacebookSDK(process.env.REACT_APP_FACEBOOK_APP_ID!);
    yield this.performFbLogin(true);
  }).bind(this);

  // tslint:disable-next-line:typedef
  private performFbLogin = flow(function *performFbLogin(this: LoginStepStore, initial: boolean) {
    const loginFunction = initial ? getLoginStatus : login;
    const { authResponse, status } = yield loginFunction();
    if (status === 'connected') {
      this.me = yield getMyFacebookProfile();
      this.accessToken = authResponse.accessToken;
    } else {
      this.me = null;
      this.accessToken = null;
    }
    this.facebookLoading = false;
  }).bind(this);

  // tslint:disable-next-line:typedef
  fbLogin = flow(function *fbLogin(this: LoginStepStore) {
    yield this.performFbLogin(false);
  }).bind(this);

  // tslint:disable-next-line:typedef
  fbLogout = flow(function *fbLogout(this: LoginStepStore) {
    this.facebookLoading = true;
    yield logout();
    this.facebookLoading = false;
    this.me = null;
  }).bind(this);

  login: () => Promise<boolean> = flow(function *loginWW(this: LoginStepStore) {
    this.loading = true;
    this.error = yield wwLogin(this.accessToken!);
    this.loading = false;
    return !this.error;
  }).bind(this);

}

export const getMockStore = (): ILoginStepStore => ({
  error: null,
  loading: false,
  facebookLoading: false,
  me: null,
  ready: false,
  init: noop,
  fbLogin: noop,
  fbLogout: noop,
  login: () => Promise.resolve(),
});
