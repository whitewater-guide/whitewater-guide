import { PurchaseInput, PurchasePlatform } from '@whitewater-guide/commons';
import ApolloClient from 'apollo-client';
import { action, flow, observable } from 'mobx';
import { getApolloClient } from '../../apollo';
import { ACTIVATE_PROMO_MUTATION } from './activatePromo.mutation';
import { IConfirmStepStore } from './types';

export class ConfirmStepStore implements IConfirmStepStore {
  private client: ApolloClient<any> = getApolloClient();
  // tslint:disable-next-line:typedef
  @observable loading = false;
  @observable error: string | null = null;
  @observable success: boolean | null = null;

  activatePromo: (code: string, sku: string) => Promise<void> = flow(
    function* activatePromo(this: ConfirmStepStore, code: string, sku: string) {
      const purchase: PurchaseInput = {
        platform: PurchasePlatform.boomstarter,
        transactionId: code,
        productId: sku,
      };
      this.loading = true;
      let success = false;
      try {
        const { data, errors } = yield this.client.mutate<boolean>({
          mutation: ACTIVATE_PROMO_MUTATION,
          variables: { purchase },
        });
        success = data ? !!data.addPurchase : false;
        const hasErrors = errors && errors.length > 0;
        if (hasErrors) {
          // tslint:disable-next-line:no-console
          console.log(errors);
        }
        this.error = success ? null : 'Похоже этот промокод не подходит';
      } catch (e) {
        this.error = 'Упс! Что-то сломалось. Попробуйте заново';
      } finally {
        this.loading = false;
      }
      this.success = success;
    },
  ).bind(this);

  @action.bound reset() {
    this.loading = false;
    this.error = null;
  }
}

export const getMockStore = (): IConfirmStepStore => ({
  loading: false,
  error: null,
  success: null,
  activatePromo: () => Promise.resolve(),
  reset: () => {},
});
