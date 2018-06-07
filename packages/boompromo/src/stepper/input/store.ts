import ApolloClient from 'apollo-client';
import noop from 'lodash/noop';
import { action, computed, flow, observable } from 'mobx';
import { getApolloClient } from '../../apollo';
import { BoomPromoInfo } from '../../ww-commons';
import { CHECK_BOOM_PROMO_QUERY, Result } from './checkBoomPromo.query';
import { IInputStepStore } from './types';

export class InputStepStore implements IInputStepStore {
  private client: ApolloClient<any> = getApolloClient();

  // tslint:disable-next-line:typedef
  @observable code = '';
  // tslint:disable-next-line:typedef
  @observable loading = false;
  @observable error: string | null = null;

  @computed get ready() {
    return this.code.length === 8;
  }

  @action.bound setCode(e: any) {
    this.code = e.target.value;
    this.error = null;
  }

  checkBoomPromo: () => Promise<BoomPromoInfo | null> = flow(function *checkBoomPromo(this: InputStepStore) {
    let info: BoomPromoInfo | null = null;
    this.loading = true;
    try {
      const { data, errors } = yield this.client.query<Result>({
        query: CHECK_BOOM_PROMO_QUERY,
        variables: { code: this.code },
        fetchPolicy: 'network-only',
      });
      info = data ? data.checkBoomPromo : null;
      const hasErrors = errors && errors.length > 0;
      if (info) {
        if (info.redeemed) {
          this.error = 'Этот промокод уже активирован';
          info = null;
        } else if (hasErrors) {
          this.error = 'Упс! Что-то сломалось. Попробуйте заново';
        } else {
          this.error = null;
        }
      } else {
        this.error = 'Похоже этот промокод не подходит';
      }
    } catch (e) {
      this.error = 'Упс! Что-то сломалось. Попробуйте заново';
    } finally {
      this.loading = false;
    }
    return info;
  }).bind(this);

  @action.bound reset() {
    this.loading = false;
    this.error = null;
    this.code = '';
  }
}

export const getMockStore = (): IInputStepStore => ({
  code: '',
  loading: false,
  error: null,
  ready: false,
  setCode: noop,
  checkBoomPromo: () => Promise.resolve(null),
  reset: noop,
});
