import {
  FacebookProfile,
  fbWebService,
} from '@whitewater-guide/clients/dist/web';
import noop from 'lodash/noop';
import { computed, flow, observable } from 'mobx';
import { wwLogin, wwLogout } from '../../auth/ww';
import { FACEBOOK_APP_ID } from '../../environment';
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
  init = flow(function* init(this: LoginStepStore) {
    this.facebookLoading = true;
    this.loading = false;
    yield fbWebService.loadSDK(FACEBOOK_APP_ID, 'ru_RU');
    yield this.performFbLogin(true);
  }).bind(this);

  // tslint:disable-next-line:typedef
  private performFbLogin = flow(function* performFbLogin(
    this: LoginStepStore,
    initial: boolean,
  ) {
    const loginFunction = initial
      ? fbWebService.getLoginStatus
      : fbWebService.login;
    const { authResponse, status } = yield loginFunction();
    if (status === 'connected') {
      this.me = yield fbWebService.getMyProfile();
      this.accessToken = authResponse.accessToken;
    } else {
      this.me = null;
      this.accessToken = null;
    }
    this.facebookLoading = false;
  }).bind(this);

  // tslint:disable-next-line:typedef
  fbLogin = flow(function* fbLogin(this: LoginStepStore) {
    yield this.performFbLogin(false);
  }).bind(this);

  // tslint:disable-next-line:typedef
  fbLogout = flow(function* fbLogout(this: LoginStepStore) {
    this.facebookLoading = true;
    yield fbWebService.logout();
    this.facebookLoading = false;
    yield wwLogout();
    this.me = null;
  }).bind(this);

  login: () => Promise<boolean> = flow(function* loginWW(this: LoginStepStore) {
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
